import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { formatUserResponse } from "../utils/auth.utils.js";
import userCache from "../services/userCache.service.js";
import blacklistService from "../services/blacklist.service.js";

// Utility helper to attach HTTP-only session cookie
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// Get current user profile and candidate preparation stats
const getProfileController = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { providers: true },
  });

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  // Calculate candidate prep analytics from interview reports
  const reports = await prisma.interviewReport.findMany({
    where: { userId: req.user.id },
    select: { matchScore: true },
  });

  const totalReports = reports.length;
  const validScores = reports.map((r) => r.matchScore).filter((s) => s !== null && s !== undefined);
  const averageScore = validScores.length > 0
    ? Math.round(validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length)
    : 0;
  const topScore = validScores.length > 0 ? Math.max(...validScores) : 0;

  const formattedUser = formatUserResponse(user);
  const statsData = {
    totalReports,
    averageScore,
    topScore,
  };

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: {
      user: formattedUser,
      stats: statsData,
    },
  });
});

// Update profile details (username, email, avatar)
// Enforces currentPassword validation before modifying email for credential users (Fix A7)
const updateProfileController = asyncHandler(async (req, res) => {
  const { username, email, avatar, currentPassword } = req.body;
  const userId = req.user.id;

  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) {
    throw new ApiError(404, "User account not found");
  }

  // Check username uniqueness (case-insensitive) if changing username
  if (username && username.toLowerCase() !== currentUser.username.toLowerCase()) {
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
        NOT: { id: userId },
      },
    });
    if (existingUsername) {
      throw new ApiError(400, "Username is already taken");
    }
  }

  // Check email uniqueness and require current password validation (Fix A7)
  if (email && email.toLowerCase() !== currentUser.email.toLowerCase()) {
    if (currentUser.password) {
      if (!currentPassword) {
        throw new ApiError(400, "Current password is required to change email address");
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        throw new ApiError(401, "Current password is incorrect");
      }
    } else {
      throw new ApiError(
        400,
        "Accounts registered via Google OAuth cannot change their email address directly"
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingEmail && existingEmail.id !== userId) {
      throw new ApiError(400, "Email is already taken");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(username ? { username } : {}),
      ...(email ? { email: email.toLowerCase() } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
    },
    include: { providers: true },
  });

  await userCache.invalidate(userId);

  const formattedUpdatedUser = formatUserResponse(updatedUser);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user: formattedUpdatedUser },
  });
});

// Change password for credential accounts
// Revokes old session token in Redis and issues a fresh JWT session (Fix A5)
const changePasswordController = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "Accounts registered via Google OAuth do not have a password. Please sign in with Google."
    );
  }

  if (newPassword === currentPassword) {
    throw new ApiError(400, "New password must be different from your current password");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHash },
  });

  // Active session revocation: Blacklist existing session token in Redis
  const oldToken =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (oldToken) {
    const decoded = jwt.decode(oldToken);
    if (decoded?.exp) {
      await blacklistService.blacklist(oldToken, decoded.exp);
    }
  }

  // Invalidate Redis user cache
  await userCache.invalidate(userId);

  // Issue fresh session token so current browser remains authenticated securely
  const newToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  setAuthCookie(res, newToken);

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// Delete account and all associated candidate data (GDPR Compliance)
const deleteAccountController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.exp) {
      await blacklistService.blacklist(token, decoded.exp);
    }
  }

  await userCache.invalidate(userId);

  // Prisma cascading deletes all OAuthProviders and InterviewReports (with questions, gaps, plans)
  await prisma.user.delete({
    where: { id: userId },
  });

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Account and all associated candidate data deleted successfully",
  });
});

export {
  getProfileController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
};

