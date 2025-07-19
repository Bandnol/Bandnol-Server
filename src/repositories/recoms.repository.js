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
    const searchRecomsData =  await prisma.userRecomsSong.findMany({
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
                    nickname: true 
                } 
            }
        },
    });

    return searchRecomsData;
};