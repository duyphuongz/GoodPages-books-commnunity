import prisma from "../configs/prisma.client.config";

const findUserByUsername = async (username: string) => {
    const userFound = await prisma.user.findUnique({
        where: {
            username
        }
    });
    return userFound;
};

const findUserByEmail = async (email: string) => {
    const userFound = await prisma.user.findUnique({
        where: {
            email
        }
    });
    return userFound;
}

const updatePasswordOfUser = async (password: string, username: string) => {
    const updatedUser = prisma.user.update({
        where: {
            username
        },
        data: {
            password
        }
    })
    return updatedUser;
}

export {
    findUserByUsername,
    findUserByEmail,
    updatePasswordOfUser
}