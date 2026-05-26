const express = require('express');
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { authLimiter } = require('../middlewares/rateLimit.middleware')

const authRouter = express.Router();


authRouter.post('/register', authLimiter, authController.registerUserController)
authRouter.post('/login', authLimiter, authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear the token cookie to logout the user
 * @access Public
 */
authRouter.post('/logout', authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */

authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController)


module.exports = authRouter;