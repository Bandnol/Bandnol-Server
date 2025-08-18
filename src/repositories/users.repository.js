import { prisma } from "../configs/db.config.js";
import { Prisma } from "@prisma/client";

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

export const getUserByEmail = async (userBirth, userEmail) => {
    return await prisma.user.findFirst({
        where: {
            birth: userBirth,
            email: userEmail,
        },
    });
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

export const createUser = async (user) => {
    user = await prisma.user.create({
        data: {
           ownId : user.ownId,
           nickname : user.nickname,
           password : user.password,
           birth : user.birth,
           gender : user.gender,
           email : user.email,
        },
    });
    return user;
};

export const updateUserLogin = async (id, userName, userEmail, type) => {
    const user = await prisma.user.update({
        where: { id: id },
        data: {
            name: userName,
            email: userEmail,
        },
    });
    return user;
};

export const getNotification = async (userId, decoded, limit = 20) => {
    const pageLimit = Number(limit) + 1;

    const base = Prisma.sql`
    SELECT * FROM (
      SELECT
        n.id::text AS id,
        n.created_at AS "createdAt",
        n.type,
        n.is_confirmed AS "isConfirmed",
        n.link,
        NULL::text AS "content",
        json_build_object('id', u.id::text, 'nickname', u.nickname) AS "sender"
      FROM "notification" n
      LEFT JOIN "user" u ON u.id::text = n.sender_id::text
      WHERE n.receiver_id::text = ${userId}::text

      UNION ALL

      SELECT
        a.id::text AS id,
        a.created_at AS "createdAt",
        'ANNOUNCEMENT' AS type,
        COALESCE(s.is_confirmed, FALSE) AS "isConfirmed",
        NULL::text AS "link",
        a.content AS "content",
        NULL::json AS "sender"
      FROM "announcement" a
      LEFT JOIN "user_announcement" s
        ON s.announcement_id::text = a.id::text
       AND s.user_id::text = ${userId}::text
    ) feed
  `;

    if (decoded) {
        return await prisma.$queryRaw`
      ${base}
      WHERE (feed."createdAt", feed.id)
        < (${decoded.createdAt}::timestamptz, ${decoded.id}::text)
      ORDER BY feed."createdAt" DESC, feed.id DESC
      LIMIT ${pageLimit}
    `;
    }

    return await prisma.$queryRaw`
    ${base}
    ORDER BY feed."createdAt" DESC, feed.id DESC
    LIMIT ${pageLimit}
  `;
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

export const getAllowedAnnouncement = async () => {
    const result = await prisma.notificationType.findMany({
        where: { announcement: true },
        select: { userId: true },
    });
    return result;
};

export const findUserByToken = async (id) => {
    return await prisma.user.findUnique({
        where: { id: id },
    });
};

export const modifyUserStatus = async (id, status) => {
    return await prisma.user.update({
        where: { id: id },
        data: {
            inactiveStatus: status,
            inactiveAt: status ? new Date() : null, // "YYYY-MM-DD"
        },
    });
};

export const updateNotificationSetting = async (userId, body) => {
    return await prisma.notificationType.update({
        where: { userId: userId },
        data: body,
    });
};

export const createUserAnnouncement = async (userId, notificationId) => {
    const result = await prisma.$transaction(async (tx) => {
        const notification = await tx.announcement.findFirst({
            where: { id: notificationId },
        });

        if (!notification) return;

        const isExisted = await tx.userAnnouncement.findFirst({
            where: { userId, announcementId: notificationId },
        });

        if (isExisted) return;

        return await tx.userAnnouncement.create({
            data: {
                userId,
                announcementId: notificationId,
                isConfirmed: true,
            },
        });
    });
    return result;
};

export const updateNotification = async (userId, notificationId) => {
    return await prisma.notification.update({
        where: { id: notificationId, receiverId: userId, isConfirmed: false },
        data: {
            isConfirmed: true,
        },
    });
};
