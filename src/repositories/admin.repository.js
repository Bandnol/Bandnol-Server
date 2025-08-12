import { prisma } from "../configs/db.config.js";

export const createAdminNotification = async (content) => {
    return await prisma.announcement.create({
        data: {
            content: content,
        },
    });
};
