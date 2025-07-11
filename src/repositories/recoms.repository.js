import { prisma } from '../db.config.js';

export const findSongByUser = async (userId, artistName, songName) => {
  const whereClause = {
    recomsSong: {
      ...(artistName && { artistName: { contains: artistName } }),
      ...(songName && { title: { contains: songName } }),
    },
  };

  const sent = await prisma.userRecomsSong.findFirst({
    where: {
      senderId: userId,
      ...whereClause,
    },
    include: { recomsSong: true },
    orderBy: { createdAt: 'desc' },
  });

  const received = await prisma.userRecomsSong.findFirst({
    where: {
      receiverId: userId,
      ...whereClause,
    },
    include: {
      recomsSong: true,
      sender: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    send: sent
      ? {
          date: sent.createdAt,
          comment: sent.comment,
          title: sent.recomsSong.title,
          artistName: sent.recomsSong.artistName,
          imageUrl: sent.recomsSong.imgUrl,
        }
      : null,
    receive: received
      ? {
          senderNickname: received.sender.nickname,
          date: received.createdAt,
          comment: received.comment,
          title: received.recomsSong.title,
          artistName: received.recomsSong.artistName,
          imageUrl: received.recomsSong.imgUrl,
        }
      : null,
  };
};
