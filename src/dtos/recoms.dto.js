export const searchTracksResponseDTO = (tracks) => {
    return {
        data: tracks,
    };
};

export const sentRecomsResponseDTO = (recomsData) => {
    const kstDate = new Date(recomsData.createdAt.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대

    return {
        id: recomsData.id,
        createdAt: kstDate.toISOString().slice(0, 10), // "YYYY-MM-DD"
        recomsSong: {
            id: recomsData.recomsSong.id,
            title: recomsData.recomsSong.title,
            artistName: recomsData.recomsSong.artistName,
            imgUrl: recomsData.recomsSong.imgUrl,
        },
        receiver: {
            id: recomsData.receiver.id,
            nickname: recomsData.receiver.nickname,
        },
        replyId: recomsData.replies[0] ? recomsData.replies[0].id : null,
    };
};

export const receivedRecomsResponseDTO = (recomsData) => {
    const kstDate = new Date(recomsData.createdAt.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대

    return {
        id: recomsData.id,
        createdAt: kstDate.toISOString().slice(0, 10), // "YYYY-MM-DD",
        isAnoymous: recomsData.isAnoymous,
        isLiked: recomsData.isLiked,
        recomsSong: {
            id: recomsData.recomsSong.id,
            title: recomsData.recomsSong.title,
            artistName: recomsData.recomsSong.artistName,
            imgUrl: recomsData.recomsSong.imgUrl,
        },
        sender: {
            id: recomsData.sender.id,
            nickname: recomsData.sender.nickname,
        },
        replyId: recomsData.replies[0] ? recomsData.replies[0].id : null,
    };
};
