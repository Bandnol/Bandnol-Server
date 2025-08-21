import { prisma } from "../configs/db.config.js";
import { NotFoundArtistsError } from "../errors.js";

export const createArtist = async (artistData) => {
    const created = await prisma.artist.create({
        data: {
            id: artistData.id,
            name: artistData.name,
            imgUrl: artistData.imgUrl,
        },
    });

    return created;
};

export const getArtistByName = async (artistName) => {
    console.log(artistName);
    const artist = await prisma.artist.findFirst({
        where: {
            name: artistName
        }
    })
    return artist.id;
}

export const getArtistById = async (artistId) => {
    return await prisma.artist.findUnique({
        where: {
            id: artistId,
        },
    });
};

export const getSing = async (recomsSongId, artistId) => {
    return await prisma.sing.findFirst({
        where: {
            recomsSongId: recomsSongId,
            artistId: artistId,
        },
    });
};

export const createSing = async (songId, artistId) => {
    const created = await prisma.sing.create({
        data: {
            recomsSongId: songId,
            artistId: artistId,
        },
    });
};

export const getArtistsByPopularity = async (decoded, limit) => {
    let result;
    if (decoded) {
        result = await prisma.$queryRaw`
        SELECT a.*,
            CONCAT(LPAD(COALESCE(likes.count, 0)::text, 10, '0'), LPAD(a.id, 30, '0')) AS cursor
        FROM artist AS a
        LEFT JOIN (
            SELECT artist_id, COUNT(*) AS count
            FROM user_liked_artist
            GROUP BY artist_id
        ) AS likes ON a.id = likes.artist_id
        WHERE CONCAT(LPAD(COALESCE(likes.count, 0)::text, 10, '0'), LPAD(a.id, 30, '0')) <=
            (
                SELECT CONCAT(LPAD(COALESCE(sub.count, 0)::text, 10, '0'), LPAD(sub.artist_id, 30, '0'))
                FROM (
                    SELECT a.id AS artist_id, COUNT(ula.*) AS count
                    FROM artist a
                    LEFT JOIN user_liked_artist ula ON a.id = ula.artist_id
                    GROUP BY a.id
                ) AS sub
                WHERE sub.artist_id = ${decoded.artistId}
            )
        ORDER BY COALESCE(likes.count, 0) DESC, a.id DESC
        LIMIT ${limit + 1};
        `;
    } else {
        result = await prisma.$queryRaw`
        SELECT a.*,
            CONCAT(LPAD(COALESCE(likes.count, 0)::text, 10, '0'), LPAD(a.id, 30, '0')) AS cursor
        FROM artist AS a
        LEFT JOIN (
            SELECT artist_id, COUNT(*) AS count
            FROM user_liked_artist
            GROUP BY artist_id
        ) AS likes ON a.id = likes.artist_id
        ORDER BY COALESCE(likes.count, 0) DESC, a.id DESC
        LIMIT ${limit + 1};
        `;
    }
    return result;
};

export const createLikedArtist = async (body, userId) => {
    const created = await prisma.userLikedArtist.create({
        data: {
            user: {
                connect: {
                    id: userId,
                },
            },
            artist: {
                connectOrCreate: {
                    where: { id: body.id },
                    create: {
                        id: body.id,
                        name: body.name,
                        imgUrl: body.imgUrl,
                    },
                },
            },
        },
    });
    return created;
};

export const getUserlikedArtist = async (artistId, userId) => {
    const liked = await prisma.userLikedArtist.findFirst({
        where: { artistId: artistId, userId: userId },
    });
    return liked;
};

export const updateInactiveStatusToFalse = async (id) => {
    const updated = await prisma.userLikedArtist.update({
        where: { id: id },
        data: {
            inactiveStatus: false,
        },
    });
    return updated;
};

export const updateInactiveStatusToTrue = async (id) => {
    const updated = await prisma.userLikedArtist.update({
        where: { id: id },
        data: {
            inactiveStatus: true,
            inactiveAt: new Date(),
        },
    });
    return updated;
};

export const deleteUserLikedArtists = async () => {
    let compareDate = new Date();
    compareDate.setDate(compareDate.getDate() - 7);

    const deleted = await prisma.userLikedArtist.deleteMany({
        where: {
            inactiveStatus: true,
            inactiveAt: {
                lt: compareDate,
            },
        },
    });
    return deleted;
};

export const getArtistsChannel = async (userId, artistId) => {
    const artist = await prisma.artist.findFirst({
        where: {
            id: artistId
        },
        select: {
            id: true,
            name: true,
            imgUrl: true
        }
    });

    if(!artist) {
        throw new NotFoundArtistsError("해당 아티스트가 없습니다.");
    }
    
    const likedRow = await prisma.userLikedArtist.findFirst({
        where: {
            artistId: artist.id,
            userId
        },
        select: {
            inactiveStatus: true
        }
    });

    const isLiked = likedRow?.inactiveStatus === false;

    const likedCount = await prisma.userLikedArtist.count({
        where: {
            artistId: artist.id,
            inactiveStatus: false
        }
    });

    const [sentCount, receivedCount] = await Promise.all([
        prisma.userRecomsSong.count({
            where: {
                recomsSong: {
                    sings: {
                        some: {
                            artistId: artist.id
                        }
                    }
                }
            },
        }),
        prisma.userRecomsSong.count({
            where: {
                recomsSong: {
                    sings: {
                        some: {
                            artistId: artist.id
                        }
                    }
                },
                receiverId: { 
                    not: null 
                }     
            },
        }),
    ]);

    return {
        artistName : artist.name,
        imgUrl: artist.imgUrl ?? null,
        isLiked,
        likedCount,
        recommends: {
            sentCnt: sentCount,
            receivedCnt: receivedCount
        }
    };
};

export const getMyLikedArtists = async (userId, limit = 6) => {
    const myLikes = await prisma.userLikedArtist.findMany({
        where: { 
            userId, 
            inactiveStatus: false 
        },
        select: { 
            artistId: true 
        },
    });
    const artistIds = myLikes.map((x) => x.artistId);
    if (artistIds.length === 0) return [];

    const ranked = await prisma.userLikedArtist.groupBy({
        by: ["artistId"],
        where: { 
            artistId: { 
                in: artistIds 
            }, 
            inactiveStatus: false 
        },
        _count: { 
            artistId: true 
        },
        orderBy: { 
            _count: { 
                artistId: "desc" 
            } 
        },
        take: limit,
    });
    const topIdsInOrder = ranked.map((r) => r.artistId);
    
    const artists = await prisma.artist.findMany({
        where: { 
            id: { 
                in: topIdsInOrder 
            } 
        },
        select: { 
            id: true, 
            name: true, 
            imgUrl: true 
        },
    });
    const byId = new Map(artists.map((a) => [a.id, a]));

    return topIdsInOrder.map((id) => ({
        id,
        name: byId.get(id)?.name ?? "",
        imgUrl: byId.get(id)?.imgUrl ?? null,
    }));
}