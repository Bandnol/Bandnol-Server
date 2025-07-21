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
}

export const createInquiry = async (userName, userEmail, text) => {
    console.log(userName,userEmail,text);
    const newInquiry = await prisma.inquiry.create({
        data: {
            name: userName,
            email: userEmail,
            content: text
        }
    })
    return newInquiry.id;
}

export const getNotification = async (userId, decoded, limit) => {
    const notification = await prisma.notification.findMany({
        take: limit + 1,
        skip: decoded ? 1 : 0,
        ...(decoded && { cursor: { createdAt: decoded.createdAt, id: decoded.id } }),
        where: { receiverId: userId },
        select: {
            id: true,
            content: true,
            createdAt: true,
            type: true,
            referenceId: true,
            isConfirmed: true,
            link: true,
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    return notification;
};
