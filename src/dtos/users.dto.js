export const userInfoRequestDTO = (body) => {
    const birth = new Date(body.birth);

    return {
        nickname: body.name,
        ownId: body.ownId,
        gender: body.gender,
        birth: birth,
        bio: body.bio,
        recomsTime: body.recomsTime,
        email: body.email,
        password: body.password
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
        bio: data.bio,
    };
};

export const withdrawResponseDTO = (data) => {
    const kstDate = data.inactiveAt !== null ? new Date(data.inactiveAt.getTime() + 9 * 60 * 60 * 1000) : null;

    return {
        id: data.id,
        inactiveAt: kstDate,
        inactiveStatus: data.inactiveStatus
    }
}

export const myPageModifyRequestDTO = (body, fileUrls) => {
    const rmPhoto = body.rmPhoto === "true" || body.rmPhoto === true;
    const rmBackImg = body.rmBackImg === "true" || body.rmBackImg === true;

    return {               
        photo: rmPhoto ? null : (fileUrls.photoUrl ?? undefined),
        backgroundImg: rmBackImg ? null : (fileUrls.backgroundImgUrl ?? undefined),
    };
};

export const isConfirmedResponseDTO = (notificationId, updated) => {
    return {
        id: notificationId,
        isConfirmed: updated.isConfirmed,
    };
};
