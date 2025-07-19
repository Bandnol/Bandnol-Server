import { prisma } from "../configs/db.config.js";
import { startOfDay, endOfDay } from "date-fns";

// 발신한 추천 곡 반환
export const getSentRecomsSong = async (recomsId, userId) => {
    const recomsData = await prisma.userRecomsSong.findUnique({
        where: { id: recomsId, senderId: userId },
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
export const getReceivedRecomsSong = async (recomsId, userId) => {
    const recomsData = await prisma.userRecomsSong.findUnique({
        where: { id: recomsId, receiverId: userId },
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
    return await prisma.userRecomsSong.findMany({
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
            sender: { select: { id: true, nickname: true } },
            receiver: { select: { id: true, nickname: true } },
        },
    });
};

export const getSenderToday = async (userId) => {
    return await prisma.userRecomsSong.findFirst({
        where: {
            senderId: userId,
            createdAt: {
                // 오늘과 생성 날짜가 같은지 (하루에 2번 추천하는지 확인 용도)
                gte: startOfDay(new Date()),
                lt: endOfDay(new Date()),
            },
        },
    });
};

export const getRecomsSong = async (recomsSongId) => {
    return await prisma.recomsSong.findUnique({
        where: {
            id: recomsSongId,
        },
    });
};

export const createRecomsSong = async (recomsSong) => {
    const created = await prisma.recomsSong.create({
        data: {
            id: recomsSong.id,
            title: recomsSong.title,
            artistName: recomsSong.artistName,
            imgUrl: recomsSong.imgUrl,
            previewUrl: recomsSong.preview_url,
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
    });

    return created;
};
