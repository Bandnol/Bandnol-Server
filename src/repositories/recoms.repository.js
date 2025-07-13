import { prisma } from "../configs/db.config.js";

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

// 특정 유저가 보낸 추천곡 중에서 검색
export const findSentSongByUser = async (userId, artistName, songName) => {
  return await prisma.userRecomsSong.findFirst({
    where: {
      senderId: userId,
      recomsSong: {
        artistName: {
          contains: artistName,
          mode: 'insensitive',
        },
        title: {
          contains: songName,
          mode: 'insensitive',
        },
      },
    },
    include: {
      recomsSong: true,
    },
  });
};

// 특정 유저가 받은 추천곡 중에서 검색
export const findReceivedSongByUser = async (userId, artistName, songName) => {
  return await prisma.userRecomsSong.findFirst({
    where: {
      receiverId: userId,
      recomsSong: {
        artistName: {
          contains: artistName,
          mode: 'insensitive',
        },
        title: {
          contains: songName,
          mode: 'insensitive',
        },
      },
    },
    include: {
      recomsSong: true,
      sender: true,
    },
  });
};