import { Request, Response } from "express";
import { signAccessToken, signInByUsername, signRefreshToken, signUp } from "../services/auth.service";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { findUserByEmail, findUserByUsername, updatePasswordOfUser } from "../services/user.service";
import { responseMapper } from "../mappers/rest-response.mapper";
import { User } from "../generated/prisma/client";
import { changePasswordMapper, signInMapper, signUpMapper } from "../mappers/auth.mapper";
import HTTP_STATUS from "../constants/httpStatus.constanst";


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

    let hashedPassword = await hashPassword(password);

    const user = await signUp({
        username,
        email,
        password: hashedPassword
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const responseData = signUpMapper(user, accessToken, refreshToken);

    const response = {
        statusCode: HTTP_STATUS.CREATED,
        isSuccess: true,
        message: "SIGN UP SUCCESSFULLY",
        data: responseData,
        error: null
    }

    return res.status(HTTP_STATUS.CREATED).json(responseMapper(response));
}

const signInController = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(">>> username:", username);
    console.log(">> password:", password);

    const userFound = await signInByUsername(username);
    if (!userFound) {
        throw new Error("Username is not existed");
    }

    let isPasswordMatched = comparePassword(password, userFound.password);

    if (!isPasswordMatched) {
        throw new Error("Password is not incorrect");
    }

    const accessToken = signAccessToken(userFound);
    const refreshToken = signRefreshToken(userFound);

    const responseData = signInMapper(userFound, accessToken, refreshToken);

    return res.status(HTTP_STATUS.OK).json(responseMapper({
        statusCode: HTTP_STATUS.OK,
        isSuccess: true,
        message: "SIGN IN SUCCESSFULLY",
        data: responseData,
        error: null
    }));
}

const changePasswordController = async (req: Request, res: Response) => {
    const { username, password } = req.user as User;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const isOldPasswordMatched = comparePassword(oldPassword, password);
    if (!isOldPasswordMatched) {
        throw new Error("Old password is not matched together");
    }

    if (newPassword != confirmNewPassword) {
        throw new Error("Password and Confirm Password is not matched");
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await updatePasswordOfUser(hashedPassword, username);

    const accessToken = signAccessToken(updatedUser);
    const refreshToken = signRefreshToken(updatedUser);

    return res.status(HTTP_STATUS.OK).json(responseMapper({
        statusCode: HTTP_STATUS.OK,
        isSuccess: true,
        message: "CHANGE PASSWORD SUCCESSFULLY",
        data: changePasswordMapper(accessToken, refreshToken),
        error: null
    }));
}

export {
    signInController,
    signUpController,
    changePasswordController
}