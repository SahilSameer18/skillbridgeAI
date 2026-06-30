import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @name registerUserController
 * @description register a new user with username, email and password in request body
 * @access Public
 */
const registerUserController = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const isUserAlreadyExist = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (isUserAlreadyExist) {
    throw new ApiError(400, "User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
    },
  });

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

/**
 * @name loginUserController
 * @description login user with email and password in request body
 * @access Public
 */
const loginUserController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

/**
 * @name logoutUserController
 * @description logout user by clearing the token cookie and adding the token to blacklist
 * @access Public
 */
const logoutUserController = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    await prisma.tokenBlacklist.create({
      data: { token },
    });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 */
const getMeController = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User details retrieved successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};