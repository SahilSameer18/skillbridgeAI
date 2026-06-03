import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const authRouter = express.Router();

// register route
authRouter.post("/register", authLimiter, authController.registerUserController);

// login route
authRouter.post("/login", authLimiter, authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description clear the token cookie to logout the user
 * @access Public
 */
authRouter.post("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */

authRouter.get("/get-me", authUser, authController.getMeController);

export default authRouter;


