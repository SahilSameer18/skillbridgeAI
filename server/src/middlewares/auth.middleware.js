import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  try {
    const isTokenBlacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token },
    });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export { authUser };