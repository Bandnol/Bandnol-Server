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

export const findOrCreateUser = async (userName, userEmail, type) => {
    let user = await prisma.user.findFirst({ where: { email: userEmail } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: userName,
                email: userEmail,
                socialType: type,
            },
        });
    } else {
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: userName,
                email: userEmail,
                socialType: type,
            },
        });
    }
    return { id: user.id, name: user.name, email: user.email, socialType: user.socialType };
};

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
        where: { id: id },
    });
};

export const createExpoToken = async (userId, token) => {
    return await prisma.expoPushToken.create({
        data: {
            token: token,
            userId: userId,
        },
    });
};

export const getExpoTokens = async (userIds) => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];

    const rows = await prisma.expoPushToken.findMany({
        where: { userId: { in: ids } },
    });

    if (!Array.isArray(userIds)) return rows[0] || null;
    return rows;
};

export const createAllowedNotifications = async (userId) => {
    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.notificationType.findFirst({ where: { userId: userId } });

        let data = {};
        if (!user) {
            data = await tx.notificationType.create({
                data: {
                    userId: userId,
                },
            });
        }
        return data;
    });
    return result;
};

export const getAllowedNotifications = async (userIds) => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];

    const rows = await prisma.notificationType.findMany({
        where: { userId: { in: ids } },
    });

    if (!Array.isArray(userIds)) return rows[0] || null;
    return rows;
};

export const createNotifications = async (receiverId, senderId, type, link) => {
    const result = await prisma.notification.create({
        data: {
            receiverId: receiverId,
            senderId: senderId,
            type: type,
            link: link,
        },
    });
    return result;
};
