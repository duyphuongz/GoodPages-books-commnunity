import { NextFunction, Request, Response } from "express";
import { changePasswordSchema, signInSchema, signUpSchema, verifyOtpSignUpSchema } from "../validations/auth.schema";

const signInMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = signInSchema.parse(req.body);
        req.body = parsedData;
        next()
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

const verifyOtpSignUpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = verifyOtpSignUpSchema.parse(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        throw error;
    }
}

const changePasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(">>> [changePasswordMiddleware] came");
    try {
        const parsedData = changePasswordSchema.parse(req.body);
        req.body = parsedData;
        next();
    } catch (error) {
        throw error;
    }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.user as { username: string, email: string, role: string } || "UNAUTHORIZE";
        if ("ADMIN" == role) {
            next();
        } else {
            throw new Error("Your role is unauthorize");
        }
    } catch (error) {
        throw error;
    }
}

const isAuthor = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.user as { username: string, email: string, role: string } || "UNAUTHORIZE";
        if ("AUTHOR" == role) {
            next();
        } else {
            throw new Error("Your role is unauthorize");
        }
    } catch (error) {
        throw error;
    }
}

const isUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.user as { username: string, email: string, role: string } || "UNAUTHORIZE";
        if ("READER" == role) {
            next();
        } else {
            throw new Error("Your role is unauthorize");
        }
    } catch (error) {
        throw error;
    }
}

export {
    signInMiddleware,
    signUpMiddleware,
    verifyOtpSignUpMiddleware,
    changePasswordMiddleware,
    isAdmin,
    isAuthor,
    isUser
}