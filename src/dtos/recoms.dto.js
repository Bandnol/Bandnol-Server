export const trackInfoResponseDTO = (recomsData) => {
    const kstDate = new Date(recomsData.createdAt.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대

    return {
        id: recomsData.id,
        createdAt: kstDate.toISOString().slice(0, 10), // "YYYY-MM-DD"
        isAnoymous: recomsData.isAnoymous,
        isLiked: recomsData.isLiked,
        recomsSong: recomsData.recomsSong,
        sender: {
            id: recomsData.sender.id,
            nickname: recomsData.sender.nickname,
        },
        receiver: {
            id: recomsData.receiver.id,
            nickname: recomsData.receiver.nickname,
        },
        replyId: recomsData.replies ? recomsData.replies.id : null,
    };
};
