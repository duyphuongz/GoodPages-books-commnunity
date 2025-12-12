import { Request, Response } from "express";
import { signAccessToken, signInByUsername, signRefreshToken, signUp, verifyOtp } from "../services/auth.service";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { findUserByEmail, findUserByUsername, updatePasswordOfUser } from "../services/user.service";
import { responseMapper } from "../mappers/rest-response.mapper";
import { User } from "../generated/prisma/client";
import { changePasswordMapper, signInMapper, signUpMapper } from "../mappers/auth.mapper";
import HTTP_STATUS from "../constants/httpStatus.constanst";
import { RestResponse, SignInResponse, UserWithRole, UserWithRoleOrNull } from "../type";
import { generateOtp } from "../utils/string.util";
import { extractRecord, setNewRecord } from "../services/redis.service";
import { generateSendOTPTemplate, sendEmail } from "../services/email.service";


const signUpController = async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;
    console.log(">>> username:", username);
    console.log(">> password:", password);

    const isUsernamExisted = await findUserByUsername(username);
    if (isUsernamExisted != null) {
        throw new Error("Username has been used");
    }

    const isEmailExisted = await findUserByEmail(username);
    if (isEmailExisted != null) {
        throw new Error("Email has been used");
    }

    if (password != confirmPassword) {
        throw new Error("Password and Confirm Password is not matched");
    }

    const otp = generateOtp();
    const pendingUser = {
        otp,
        username,
        email,
        password
    };

    const redisResult = await setNewRecord(`otp:${email}`, pendingUser);
    const emailOtpTemplate = generateSendOTPTemplate(email, otp);

    const emailResult = await sendEmail({
        to: email,
        subject: "GoodPages OTP Verification",
        html: emailOtpTemplate
    });
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
};

const verifyOtpAndSignUpController = async (req: Request, res: Response) => {
    try {
        const { otp, email } = req.body;
        //verify otp 
        const { username, password } = await verifyOtp(otp, email);

        //create new user 
        const newUser = await signUp({ username, password, email });

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
    console.log(">> password:", password);

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
    verifyOtpAndSignUpController,
    signUpController,
    changePasswordController
}