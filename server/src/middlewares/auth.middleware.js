import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findUnique({
    where: { token },
  });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

export { authUser };
