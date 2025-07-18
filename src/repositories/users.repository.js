import { prisma } from "../configs/db.config.js";

export const getUser = async (userId) => {
    const userData = await prisma.user.findUnique({
        where: {id: userId}
    })
    return userData;
}