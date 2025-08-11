import { prisma } from "../configs/db.config.js";

export const getUserById = async (userId) => {
    const userData = await prisma.user.findUnique({
        where: { id: userId },
    });
    return userData;
};

export const getUserByOwnId = async (checkingOwnId) => {
    const userData = await prisma.user.findUnique({
        where: { ownId: checkingOwnId },
    });
    return userData;
};

export const getUserByEmail = async (userName, userEmail) => {
    return await prisma.user.findFirst({ 
        where: { 
            name: userName,
            email: userEmail 
        } 
    });
}

export const modifyUser = async (userId, data) => {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: data,
    });

    return updatedUser;
};

export const createInquiry = async (userName, userEmail, text) => {
    console.log(userName, userEmail, text);
    const newInquiry = await prisma.inquiry.create({
        data: {
            name: userName,
            email: userEmail,
            content: text,
        },
    });
    return newInquiry.id;
};

export const createUser = async (userName, userEmail, type) => {
    user = await prisma.user.create({
        data: {
            name: userName,
            email: userEmail,
            socialType: type,
        },
    });
    return user;
}

export const updateUserLogin = async (id, userName, userEmail, type) => {
    const user = await prisma.user.update({
            where: { id: id},
            data: {
                name: userName,
                email: userEmail,
                socialType: type,
            },
    });
    return user;
}

export const getNotification = async (userId, decoded, limit) => {
    const notification = await prisma.notification.findMany({
        take: limit + 1,
        skip: decoded ? 1 : 0,
        ...(decoded && { cursor: { createdAt: decoded.createdAt, id: decoded.id } }),
        where: { receiverId: userId },
        select: {
            id: true,
            createdAt: true,
            type: true,
            isConfirmed: true,
            link: true,
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            content: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    return notification;
};

export const findUserByToken = async (id) => {
    return await prisma.user.findUnique({ 
        where: { id: id } 
    });
}

export const modifyUserStatus = async (id, status) => {
    return await prisma.user.update({
        where: {id: id},
        data: {
            inactiveStatus: status,
            inactiveAt: status ? new Date() : null // "YYYY-MM-DD"
        }
    })
}