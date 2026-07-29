import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import blacklistService from "../services/blacklist.service.js";
import ApiError from "../utils/ApiError.js";

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, "Token not provided");
    }

    if (await blacklistService.isBlacklisted(token)) {
      throw new ApiError(401, "Token is invalid");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
}

export { authUser };