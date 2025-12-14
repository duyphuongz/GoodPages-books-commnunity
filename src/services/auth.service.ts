import prisma from "../configs/prisma.client.config"
import { UserWithRole } from "../type";
import { signToken } from "../utils/jwt.util";
import { generateOtp } from "../utils/string.util";
import { generateSendOTPTemplate, sendEmail } from "./email.service";
import { deleteRecord, extractRecord } from "./redis.service";

const signUp = async ({
    username,
    password,
    email
}: {
    username: string,
    password: string,
    email: string
}) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password,
                role: {
                    connect: {
                        roleName: "READER"
                    }
                },
            },
            include: {
                role: true
            }
        });

        return newUser;
    } catch (error) {
        throw error;
    }
}

const verifyOtp = async (otp: String, email: string) => {
    try {
        //extract redis record by key
        const rawRedisValue = await extractRecord(`otp:${email}`);
        console.log(">>> rawRedisValue:", String(rawRedisValue));

        if (rawRedisValue == undefined) {
            throw new Error("Redis record not found");
        }

        const pendingUser = await JSON.parse(String(rawRedisValue));
        console.log(">>> pendingUser:", pendingUser);

        if (otp != pendingUser.otp) {
            throw new Error("OTP is not matched");
        }

        const result = await deleteRecord(`otp:${email}`);

        return pendingUser;
    } catch (error) {
        throw error;
    }
}

const signInByUsername = async (username: string) => {
    try {
        const foundUser = await prisma.user.findUnique({
            where: {
                username
            },
            include: {
                role: true
            }
        });
        return foundUser;
    } catch (error) {
        throw error;
    }
}

const signAccessToken = (user: UserWithRole) => {
    const payload = {
        username: user.username,
        role: user.role?.roleName || "UNAUTHORIZED"
    };
    const accessToken = signToken(payload, "1d");
    return accessToken;
}

const signRefreshToken = (user: UserWithRole) => {
    const payload = {
        username: user.username,
        role: user.role?.roleName || "UNAUTHORIZED"
    };
    const accessToken = signToken(payload, "7d");
    return accessToken;
}

export {
    signInByUsername,
    signUp,
    verifyOtp,
    signAccessToken,
    signRefreshToken
}