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
        imgUrl: d.images[0].url,
    }));

    return newData;
};
