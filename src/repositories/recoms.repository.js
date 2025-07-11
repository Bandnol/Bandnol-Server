import { prisma } from "../db.config.js";

// 추천 곡 반환
export const getRecomsSong = async (recomsId) => {
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
