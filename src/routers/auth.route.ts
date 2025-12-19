import express from 'express';
import { changePasswordController, signInController, signUpController, signUpTestController, verifyOtpAndSignUpController } from '../controllers/auth.controller';
import { changePasswordMiddleware, signInMiddleware, signUpMiddleware, validateToken, verifyOtpSignUpMiddleware } from '../middlewares/auth.middleware';

const authRoute = express.Router();

authRoute.post("/sign-up-test", signUpTestController);
authRoute.post("/sign-up", signUpMiddleware, signUpController);
authRoute.post("/sign-up/verify-otp", verifyOtpSignUpMiddleware, verifyOtpAndSignUpController);
authRoute.post("/sign-in", signInMiddleware, signInController);
authRoute.post("/change-password", validateToken, changePasswordMiddleware, changePasswordController);

export default authRoute;