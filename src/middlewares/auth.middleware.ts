import { NextFunction, Request, Response } from "express";
import signInSchema from "../validation/signin.schema";
import signUpSchema from "../validation/signup.schema";
import { forgotPasswordSchema } from "../validation/forgotpassword.schema";

const signInMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = signInSchema.parse(req.body);
        req.body = parsedData;
    } catch (error) {
        throw error;
    }
}

const signUpMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = signUpSchema.parse(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        throw error;
    }
}

const forgotPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = forgotPasswordSchema.parse(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        throw error;
    }
}

export {
    signInMiddleware,
    signUpMiddleware,
    forgotPasswordMiddleware
}