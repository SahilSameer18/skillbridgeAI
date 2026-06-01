import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

/**
 *
 * @name registerUserController
 * @description register a new user with username, email and password in request body
 * @access Public
 */

async function registerUserController(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isUserAlreadyExist = await userModel.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (isUserAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later",
    });
  }
}

/**
 * @name loginUserController
 * @description login user with email and password in request body
 * @access Public
 */

async function loginUserController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later",
    });
  }
}

/**
 * @name logoutUserController
 * @description logout user by clearing the token cookie and adding the token to blacklist
 * @access Public
 */

async function logoutUserController(req, res, next) {
  try {
    const token = req.cookies.token;

    if (token) {
      await tokenBlacklistModel.create({
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
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later",
    });
  }
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 */

async function getMeController(req, res, next) {
  try {
    const user = await userModel.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
  } catch (error) {
    console.error("Get user details error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve user details" });
  }
}

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
