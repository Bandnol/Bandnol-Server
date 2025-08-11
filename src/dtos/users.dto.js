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

export const withdrawResponseDTO = (data) => {
    const kstDate = data.inactiveAt!==null ? new Date(data.inactiveAt.getTime() + 9 * 60 * 60 * 1000): null;
    
    return {
        id: data.id,
        inactiveAt: kstDate,
        inactiveStatus: data.inactiveStatus
    }
}

export const myPageModifyRequestDTO = (body, fileUrls) => {
    const removePhoto = body.removePhoto === "true" || body.removePhoto === true;
    const removeBackgroundImg = body.removeBackgroundImg === "true" || body.removeBackgroundImg === true;

    return {
        nickname: body.nickname,                      
        bio: body.bio ?? undefined,                   
        photo: removePhoto ? null : (fileUrls.photoUrl ?? undefined),
        backgroundImg: removeBackgroundImg ? null : (fileUrls.backgroundImgUrl ?? undefined),
    };
};