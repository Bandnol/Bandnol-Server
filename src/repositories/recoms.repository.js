import { prisma } from "../configs/db.config.js";
import { startOfDay, endOfDay } from "date-fns";

function getUtcWindowForTodayKst(now = new Date()) {
    const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
    const y = kstNow.getUTCFullYear();
    const m = kstNow.getUTCMonth();
    const d = kstNow.getUTCDate();

    const kstMidnightUTCms = Date.UTC(y, m, d, 0, 0, 0, 0); // "KST 자정"을 UTC 기준으로 표현
    const startUtc = new Date(kstMidnightUTCms - KST_OFFSET_MS); // KST 00:00 -> UTC
    const endUtc = new Date(kstMidnightUTCms + 24 * 60 * 60 * 1000 - KST_OFFSET_MS); // 다음날 KST 00:00 -> UTC
    return { startUtc, endUtc };
}

// 발신한 추천 곡 반환
export const getSentRecomsSong = async (userId) => {
    const { startUtc, endUtc } = getUtcWindowForTodayKst();

    const recomsData = await prisma.userRecomsSong.findFirst({
        where: {
            senderId: userId,
            createdAt: {
                gte: startUtc,
                lt: endUtc,
            },
        },
        select: {
            id: true,
            createdAt: true,
            recomsSong: true,
            receiver: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            replies: {
                select: {
                    id: true,
                },
            },
        },
    });
    return recomsData;
};

// 수신한 추천 곡 반환
export const getReceivedRecomsSong = async (userId) => {
    const { startUtc, endUtc } = getUtcWindowForTodayKst();

    const recomsData = await prisma.userRecomsSong.findFirst({
        where: {
            receiverId: userId,
            createdAt: {
                gte: startUtc,
                lt: endUtc,
            },
        },
        select: {
            id: true,
            createdAt: true,
            isAnoymous: true,
            isLiked: true,
            recomsSong: true,
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            replies: {
                select: {
                    id: true,
                },
            },
        },
    });
    return recomsData;
};

export const findSongByKeyword = async (userId, keyword) => {
    const searchRecomsData = await prisma.userRecomsSong.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { recomsSong: { title: { contains: keyword, mode: "insensitive" } } },
                        { recomsSong: { artistName: { contains: keyword, mode: "insensitive" } } },
                    ],
                },
                {
                    OR: [{ senderId: userId }, { receiverId: userId }],
                },
            ],
        },
        include: {
            recomsSong: true,
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });

    return searchRecomsData;
};

export const getSenderToday = async (userId) => {
    const { startUtc, endUtc } = getUtcWindowForTodayKst();

    return await prisma.userRecomsSong.findFirst({
        where: {
            senderId: userId,
            createdAt: {
                // 오늘과 생성 날짜가 같은지 (하루에 2번 추천하는지 확인 용도)
                gte: startUtc,
                lt: endUtc,
            },
        },
    });
};

export const getRecomsSong = async (recomsSongId) => {
    return await prisma.recomsSong.findUnique({
        where: { id: recomsSongId },
    });
};

export const createRecomsSong = async (recomsSong, artistIds = []) => {
    const created = await prisma.recomsSong.create({
        data: {
            id: recomsSong.id,
            title: recomsSong.title,
            artistIds: artistIds,
            artistName: recomsSong.artist,
            imgUrl: recomsSong.albumImg,
            previewUrl: recomsSong.previewUrl,
        },
    });
    return created;
};

export const createUserRecomsSong = async (data, userId, recomsSong) => {
    const created = await prisma.userRecomsSong.create({
        data: {
            sender: {
                connect: { id: userId },
            },
            recomsSong: {
                connect: { id: recomsSong.id },
            },
            isAnoymous: data.isAnoymous,
            comment: data.comment,
        },
    });
    return created;
};

export const getCommentAndReply = async (recomsId, type, userId) => {
    let whereClause = {};
    type === "sent"
        ? (whereClause = { id: recomsId, senderId: userId })
        : (whereClause = { id: recomsId, receiverId: userId });

    const data = await prisma.userRecomsSong.findUnique({
        where: whereClause,
        select: {
            id: true,
            comment: true,
            replies: {
                select: {
                    id: true,
                    content: true,
                },
            },
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            receiver: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });
    return data;
};

// 좋아요/별로예요 누르기
export const patchLikeStatus = async (recomsId, userId, isLiked) => {
    const status = await prisma.userRecomsSong.update({
        where: { id: recomsId, receiverId: userId },
        data: { isLiked: isLiked },
    });
    return status;
};

export const getCalendarRecomsSong = async (userId, year, month, status) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1, -9));
    const endDate = new Date(Date.UTC(year, month, 1, -9));

    const whereClause = {
        createdAt: {
            gte: startDate,
            lt: endDate,
        },
        ...(status === "recommending" ? { senderId: userId } : { receiverId: userId }),
    };

    const calendarsData = await prisma.userRecomsSong.findMany({
        where: whereClause,
        select: {
            id: true,
            createdAt: true,
            comment: true,
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            receiver: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
            recomsSong: {
                select: {
                    title: true,
                    artistName: true,
                    imgUrl: true,
                },
            },
        },
    });

    return calendarsData;
};

export const createReply = async (recomsId, userId, content) => {
    // 권한이 있는 유저인지 체크
    const recomsSong = await prisma.userRecomsSong.findUnique({
        where: { id: recomsId, receiverId: userId },
    });

    if (!recomsSong) {
        return null;
    }

    const created = await prisma.recomsReply.create({
        data: {
            content: content,
            userRecomsSongId: recomsId,
            responderId: userId,
        },
        include: {
            userRecomsSong: {
                select: {
                    senderId: true,
                },
            },
            responder: {
                select: {
                    nickname: true,
                },
            },
        },
    });

    return created;
};

export const updateReceiver = async (recomsId, userId) => {
    const receiverUpdate = await prisma.userRecomsSong.update({
        where: { id: recomsId, NOT: { senderId: userId } },
        data: {
            receiverId: userId,
        },
        include: {
            receiver: {
                select: {
                    nickname: true,
                },
            },
        },
    });

    return receiverUpdate;
};

export const createUserRecomsSongByAI = async (receiverId, comment, recomsSong) => {
    const created = await prisma.userRecomsSong.create({
        data: {
            sender: {
                connect: { id: "AI" },
            },
            receiver: {
                connect: { id: receiverId },
            },
            recomsSong: {
                connect: { id: recomsSong.id },
            },
            isAnoymous: true,
            comment: comment,
        },
        include: {
            receiver: {
                select: {
                    nickname: true,
                },
            },
        },
    });
    return created;
};

export const getListRecomsSong = async (userId) => {
    const listData = await prisma.userRecomsSong.findMany({
        where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
        },
        select: {
            createdAt: true,
            comment: true,
            senderId: true,
            receiverId: true,
            recomsSong: {
                select: {
                    title: true,
                    artistIds: true,
                    artistName: true,
                    imgUrl: true,
                },
            },
        },
    });

    return listData;
};

export const updateIsDeliveredToTrue = async (userIds) => {
    const modified = await prisma.user.updateMany({
        where: {
            id: { in: userIds },
        },
        data: {
            isDelivered: true,
        },
    });

    return modified;
};

export const updateIsDeliveredToFalse = async () => {
    // userId를 가져오기 위해 findMany() 추가
    const result = await prisma.$transaction(async (tx) => {
        const users = await tx.user.findMany({
            where: { inactiveStatus: false, NOT: { id: "AI" } },
            select: { id: true },
        });

        const userIds = users.map((u) => u.id);

        const updatedCount = await tx.user.updateMany({
            where: { id: { in: userIds } },
            data: { isDelivered: false },
        });

        return updatedCount;
    });

    return result;
};

export const getIsReadFalse = async () => {
    const { startUtc, endUtc } = getUtcWindowForTodayKst();
    const nowUtc = new Date();
    const threeHoursAgoUtc = new Date(nowUtc.getTime() - 3 * 60 * 60 * 1000);
    const fourHoursAgoUtc = new Date(nowUtc.getTime() - 4 * 60 * 60 * 1000);

    const isReadFalse = await prisma.userRecomsSong.findMany({
        where: {
            createdAt: {
                gte: startUtc,
                lt: endUtc,
            },
            updatedAt: {
                gte: fourHoursAgoUtc,
                lt: threeHoursAgoUtc,
            },
            isRead: false,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });

    return isReadFalse;
};

export const getUserList = async () => {
    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const hour = String(kstNow.getUTCHours()).padStart(2, "0");
    const min = String(kstNow.getUTCMinutes()).padStart(2, "0");
    const time = hour + min;

    const userList = await prisma.user.findMany({
        where: {
            isDelivered: false,
            recomsTime: { lte: time },
            inactiveStatus: false,
        },
        select: { id: true },
    });
    return userList;
};
