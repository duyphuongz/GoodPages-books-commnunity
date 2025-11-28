import express from 'express';
import { forgotPasswordController, signInController, signUpController } from '../controllers/auth.controller';
import { forgotPasswordMiddleware, signInMiddleware, signUpMiddleware } from '../middlewares/auth.middleware';

const authRoute = express.Router();

authRoute.post("/sign-up", signUpMiddleware, signUpController);
authRoute.post("/sign-in", signInMiddleware, signInController);
authRoute.post("/forgot-password", forgotPasswordMiddleware, forgotPasswordController);

export default authRoute;