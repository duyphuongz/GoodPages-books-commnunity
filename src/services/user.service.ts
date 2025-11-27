import prisma from "../config/prisma.client.config";

const findUserByUsername = async (username: string) => {
    const userFound = await prisma.user.findUnique({
        where: {
            username
        }
    });
    return userFound;
};

export {
    findUserByUsername
}