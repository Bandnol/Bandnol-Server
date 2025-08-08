export const artistsResponseDTO = (data, hasNext, nextCursor) => {
    const newData = data.map((d) => ({
        id: d.id,
        name: d.name,
        imgUrl: d.img_url,
    }));

    return {
        data: newData,
        hasNext: hasNext,
        nextCursor: nextCursor,
    };
};

export const recomsArtistsResponseDTO = (data) => {
    const newData = data.map((d) => ({
        id: d.id,
        name: d.name,
        imgUrl: d.images?.[0]?.url || null,
    }));

    return newData;
};

export const likedArtistsResponseDTO = (data) => {
    return {
        id: data.id,
        artistId: data.artistId,
        userId: data.userId,
        inactiveStatus: data.inactiveStatus,
        inactiveAt: data.inactiveAt,
    };
};

export const channelResponseDTO = (data) => {
    return {
        id: data.id,
        imgUrl: data.imgUrl,
        isLiked: data.isLiked,
        likedCount: data.likedCount,
        recommends: {
            sent: data.recommends.sent,
            received: data.recommends.received
        }
    };
};
