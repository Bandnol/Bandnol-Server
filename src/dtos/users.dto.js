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