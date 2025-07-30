export const userInfoRequestDTO = (body) => {
    const birth = new Date(body.birth);

    return {
        nickname: body.name,
        ownId: body.ownId,
        gender: body.gender,
        birth: birth,
        bio: body.bio,
        recomsTime: body.recomsTime,
    };
};

export const notificationResponseDTO = (data, hasNext, nextCursor) => {
    return {
        data,
        hasNext,
        nextCursor,
    };
};

export const getMyPageResponseDTO = (data) => {
    return {
        nickname: data.nickname,
        ownId: data.ownId,
        photo: data.photo,
        backgroundImg: data.backgroundImg,
        bio: data.bio
    };
};