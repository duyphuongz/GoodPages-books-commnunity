import prisma from "../config/prisma.client.config"
import { signToken } from "../utils/jwt.util";

const signUp = async ({
    username,
    password,
    email
}: {
    username: string,
    password: string,
    email: string
}) => {
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password,
            role: "User",
        }
    });
    return newUser;
}

const signInByUsername = async (username: string) => {
    const foundUser = await prisma.user.findUnique({
        where: {
            username
        }
    });
    return foundUser;
}

const signAccessToken = (user: any) => {
    const payload = {
        username: user.username,
        role: user.role
    }
    const accessToken = signToken(payload, "1d");
    return accessToken;
}

const signRefreshToken = (user: any) => {
    const payload = {
        username: user.username,
        role: user.role
    }
    const accessToken = signToken(payload, "7d");
    return accessToken;
}

export {
    signInByUsername,
    signUp,
    signAccessToken,
    signRefreshToken
}