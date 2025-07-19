import { prisma } from "../configs/db.config.js";

export const getUserById = async (userId) => {
    const userData = await prisma.user.findUnique({
        where: {id: userId}
    })
    return userData;
}

export const getUserByOwnId = async (checkingOwnId) => {
    const userData = await prisma.user.findUnique({
        where: { ownId: checkingOwnId}
    })
    return userData;
}

export const modifyUser = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: data,
  });

  return updatedUser;
}
