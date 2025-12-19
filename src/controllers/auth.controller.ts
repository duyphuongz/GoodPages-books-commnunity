import { request, Request, Response } from "express";
import { signAccessToken, signInByUsername, signRefreshToken, signUp, verifyOtp } from "../services/auth.service";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { findUserByEmail, findUserByUsername, updatePasswordOfUser } from "../services/user.service";
import { responseMapper } from "../mappers/rest-response.mapper";
import { User } from "../generated/prisma/client";
import { changePasswordMapper, signInMapper, signUpMapper } from "../mappers/auth.mapper";
import HTTP_STATUS from "../constants/httpStatus.constanst";
import { RestResponse, SignInResponse, UserWithRole, UserWithRoleOrNull } from "../type";
import { generateOtp } from "../utils/string.util";
import { setNewRecord } from "../services/redis.service";
import { generateSendOTPTemplate, sendEmail } from "../services/email.service";
import logger from "../configs/winston.config";


const signUpController = async (req: Request, res: Response) => {
    try {
        logger.info(">>> [signUpController]: started signUpController");
        const { username, email, password, confirmPassword } = req.body;
        console.log(">>> req.body:", req.body);

        const isUsernamExisted = await findUserByUsername(username);

        if (isUsernamExisted != null) {
            logger.info(`>>> [signUpController]: username ${username} is already existed`);
            throw new Error("Username has been used");
        }
        logger.info(`>>> [signUpController]: username: ${username} is not existed`);

        const isEmailExisted = await findUserByEmail(username);
        if (isEmailExisted != null) {
            logger.info(`>>> [signUpController]: email ${email} is already existed`);
            throw new Error("Email has been used");
        }
        logger.info(`>>> [signUpController]: email ${email} is not existed`);

        if (password != confirmPassword) {
            logger.info(">>> [signUpController]: password and confirm password is not matched");
            throw new Error("Password and Confirm Password is not matched");
        }

        const otp = generateOtp();
        console.log(">>> otp:", otp);
        console.log(`>>> otp for ${email}`, otp);

        const pendingUser = {
            otp,
            username,
            email,
            password
        };

        const redisResult = await setNewRecord(`otp:${email}`, pendingUser);
        logger.info(">>> [signUpController]: set pending user to redis successfully");
        console.log(">>> redisResult: ", redisResult);

        const emailOtpTemplate = generateSendOTPTemplate(email, otp);

        const emailResult = await sendEmail({
            to: email,
            subject: "GoodPages OTP Verification",
            html: emailOtpTemplate
        });
        logger.info(">>> [signUpController]: OTP sent email:", email);
        console.log(">>> emailResult:", emailResult);

        const response: RestResponse = {
            statusCode: HTTP_STATUS.CREATED,
            isSuccess: true,
            message: "SEND OTP EMAIL SUCCESSFULLY",
            data: {
                message: "OTP sent to email: " + email
            },
            error: null
        }

        return res.status(HTTP_STATUS.CREATED).json(responseMapper(response));
    } catch (error) {
        throw error;
    }
};

const signUpTestController = async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await signUp({ username, password: hashedPassword, email });

    const [accessToken, refreshToken] = await Promise.all([signAccessToken(result), signRefreshToken(result)]);
    const responseData = await signUpMapper(result, accessToken, refreshToken);

    return res.status(HTTP_STATUS.CREATED).json(responseMapper({
        statusCode: HTTP_STATUS.CREATED,
        isSuccess: true,
        message: "SIGN UP SUCCESSFULLY",
        data: responseData,
        error: null
    }))
}

const verifyOtpAndSignUpController = async (req: Request, res: Response) => {
    try {
        const { otp, email } = req.body;
        //verify otp 
        const { username, password } = await verifyOtp(otp, email);

        //hash password 
        const hashedPassword = await hashPassword(password);

        //create new user 
        const newUser = await signUp({ username, password: hashedPassword, email });

        const accessToken = signAccessToken(newUser);
        const refreshToken = signRefreshToken(newUser);

        const responseData = signInMapper(newUser, accessToken, refreshToken);

        return res.status(HTTP_STATUS.OK).json(responseMapper({
            statusCode: 201,
            isSuccess: true,
            message: "SIGN UP SUCCESSFULLY",
            data: responseData,
            error: null
        }));
    } catch (error) {
        throw error;
    }
};

const signInController = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(">>> username:", username);
    console.log(">>> password:", password);

    const userFound: UserWithRoleOrNull = await signInByUsername(username);
    if (!userFound) {
        throw new Error("Username is not existed");
    }

    let isPasswordMatched: boolean = await comparePassword(password, userFound.password);

    if (!isPasswordMatched) {
        throw new Error("Password is not incorrect");
    }

    const accessToken = signAccessToken(userFound);
    const refreshToken = signRefreshToken(userFound);

    const responseData: SignInResponse = signInMapper(userFound, accessToken, refreshToken);

    return res.status(HTTP_STATUS.OK).json(responseMapper({
        statusCode: HTTP_STATUS.OK,
        isSuccess: true,
        message: "SIGN IN SUCCESSFULLY",
        data: responseData,
        error: null
    } as RestResponse));
}

const changePasswordController = async (req: Request, res: Response) => {
    console.log(">>> [changePasswordController] came");
    const { username } = req.user as User;
    console.log(">>> req.user:", req.user);
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    console.log(">>> req.body:", req.body);

    const userFound = await findUserByUsername(username);

    if (userFound == null) {
        throw new Error(">>> User is not existed");
    }

    const isOldPasswordMatched = await comparePassword(oldPassword, userFound.password);

    if (!isOldPasswordMatched) {
        throw new Error("Old password is not matched together");
    }

    if (newPassword != confirmNewPassword) {
        throw new Error("Password and Confirm Password is not matched");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser: UserWithRole = await updatePasswordOfUser(hashedPassword, username);

    const accessToken = signAccessToken(updatedUser);
    const refreshToken = signRefreshToken(updatedUser);

    return res.status(HTTP_STATUS.OK).json(responseMapper({
        statusCode: HTTP_STATUS.OK,
        isSuccess: true,
        message: "CHANGE PASSWORD SUCCESSFULLY",
        data: changePasswordMapper(accessToken, refreshToken),
        error: null
    } as RestResponse));
}

export {
    signInController,
    signUpTestController,
    verifyOtpAndSignUpController,
    signUpController,
    changePasswordController
}