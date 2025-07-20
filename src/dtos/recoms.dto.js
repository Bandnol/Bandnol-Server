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
            previewUrl: recomsData.recomsSong.previewUrl,
        },
        receiver: {
            id: recomsData.receiver.id,
            nickname: recomsData.receiver.nickname,
        },
        replyId: recomsData.replies ? recomsData.replies.id : null,
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
            previewUrl: recomsData.recomsSong.previewUrl,
        },
        sender: {
            id: recomsData.sender.id,
            nickname: recomsData.sender.nickname,
        },
        replyId: recomsData.replies ? recomsData.replies.id : null,
    };
};

export const searchRecomsResponseDTO = (recom, isReceived = false) => {
    const kstDate = new Date(recom.createdAt.getTime() + 9 * 60 * 60 * 1000);

    const searchRecomsData = {
        date: kstDate.toISOString().slice(0, 10),
        comment: recom.comment,
        title: recom.recomsSong.title,
        artistName: recom.recomsSong.artistName,
        imageUrl: recom.recomsSong.imgUrl || null,
    };

    if (isReceived) {
        return {
            senderNickname: recom.sender.nickname,
            ...searchRecomsData,
        };
    }

    return searchRecomsData;
};

export const getSongInfoResponseDTO = (songData) => {
    //console.log(songData);
    const artists = songData.artists.map((artist) => artist.name).join(", ");

    return {
        id: songData.id,
        title: songData.name,
        artistName: artists,
        imgUrl: songData.album.images?.[0]?.url || null,
        previewUrl: songData.previewUrl || null,
    };
};

export const userRecomsSongResponseDTO = (userRecomsSongData) => {
    return {
        id: userRecomsSongData.id,
        recomsSong: {
            id: userRecomsSongData.recomsSongId,
        },
        sender: {
            id: userRecomsSongData.senderId,
        },
        comment: userRecomsSongData.comment,
    };
};
export const commentResponseDTO = (comment) => {
    return {
        id: comment.id,
        sender: {
            id: comment.sender.id,
            nickname: comment.sender.nickname,
        },
        comment: comment.comment,
    };
};

export const likeStatusResponseDTO = (status) => {
    return {
        id: status.id,
        isLiked: status.isLiked,
    };
};

export const replyResponseDTO = (reply) => {
    return {
        id: reply.id,
        receiver: {
            id: reply.receiver.id,
            nickname: reply.receiver.nickname,
        },
        replies: {
            id: reply.replies.id,
            content: reply.replies.content,
        },
    };
};

export const calendarRecomsResponseDTO = (data, status) => {
    return data.map(item => {
        const base = {
            date: item.createdAt.toISOString().slice(0, 10),
            title: item.recomsSong.title,
            artistName: item.recomsSong.artistName,
            imageUrl: item.recomsSong.imgUrl,
            comment: item.comment,
        };

        if (status === 'recommended') {
            base.senderNickname = item.sender.nickname;
        }

        return base;
    });
};

export const createdReplyResponseDTO = (reply) => {
    return {
        id: reply.id,
        content: reply.content,
    };
};
