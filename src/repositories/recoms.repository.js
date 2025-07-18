import { prisma } from "../configs/db.config.js";

// 발신한 추천 곡 반환
export const getSentRecomsSong = async (recomsId) => {
    const recomsData = await prisma.userRecomsSong.findFirst({
        where: { id: recomsId },
        select: {
            id: true,
            createdAt: true,
            recomsSong: true,
            sender: {
                select: {
                    id: true,
                },
            },
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
export const getReceivedRecomsSong = async (recomsId) => {
    const recomsData = await prisma.userRecomsSong.findFirst({
        where: { id: recomsId },
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
            receiver: {
                select: {
                    id: true,
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

// 코멘트 조회
export const getComment = async (recomsId) => {
    const comment = await prisma.userRecomsSong.findFirst({
        where: { id: recomsId },
        select: {
            id: true,
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
                },
            },
        },
    });

    return comment;
};

// 좋아요/별로예요 누르기
export const patchLikeStatus = async (recomsId, isLiked) => {
    const status = await prisma.userRecomsSong.update({
        where: { id: recomsId },
        data: { isLiked: isLiked },
    });

    return status;
};
