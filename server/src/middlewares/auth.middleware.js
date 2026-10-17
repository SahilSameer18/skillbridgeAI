import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import blacklistService from "../services/blacklist.service.js";
import userCache from "../services/userCache.service.js";
import ApiError from "../utils/ApiError.js";

async function authUser(req, res, next) {
  try {
    let token = req.cookies?.token;

    // Support standard Authorization: Bearer <token> for mobile, Postman, and API clients
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Token not provided");
    }

    if (await blacklistService.isBlacklisted(token)) {
      throw new ApiError(401, "Token is invalid");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userCache.get(decoded.id);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, email: true },
      });
      if (!user) throw new ApiError(401, "User no longer exists");
      await userCache.set(decoded.id, user);
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}

export { authUser };