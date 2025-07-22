import { prisma } from "../configs/db.config.js";

export const createArtist = async (artistData) => {
    const created = await prisma.artist.create({
        data: {
            id: artistData.id,
            name: artistData.name,
            imgUrl: artistData.imgUrl
        }
    })

    return created;
}

export const getArtistById = async(artistId) => {
    return await prisma.artist.findUnique({
        where: {
            id: artistId
        }
    })
}

export const getSing = async(recomsSongId, artistId) => {
    return await prisma.sing.findFirst({
        where:{
            recomsSongId : recomsSongId,
            artistId : artistId,
        }
    })
}

export const createSing = async (songId, artistId) => {
    const created = await prisma.sing.create({
        data:{
            recomsSongId: songId,
            artistId: artistId,
        }
    })
}