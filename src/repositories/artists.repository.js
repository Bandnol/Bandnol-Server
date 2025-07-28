import { prisma } from "../configs/db.config.js";

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
            CONCAT(LPAD(likes.count::text, 10, '0'), LPAD(a.id, 30, '0')) AS cursor
        FROM "Artist" AS a
        JOIN (
            SELECT artist_id, COUNT(*) AS count
            FROM "UserLikedArtist"
            GROUP BY artist_id
        ) AS likes ON a.id = likes.artist_id
        WHERE CONCAT(LPAD(likes.count::text, 10, '0'), LPAD(a.id, 30, '0')) <=
            (
                SELECT CONCAT(LPAD(like_count_sub.count::text, 10, '0'), LPAD(like_count_sub.artist_id, 30, '0'))
                FROM (
                    SELECT artist_id, COUNT(*) AS count
                    FROM "UserLikedArtist"
                    GROUP BY artist_id
                ) AS like_count_sub
                WHERE like_count_sub.artist_id = ${decoded.artistId}
            )
        ORDER BY likes.count DESC, a.id DESC
        LIMIT ${limit + 1};
    `;
    } else {
        result = await prisma.$queryRaw`
        SELECT a.*,
            CONCAT(LPAD(u.count::text, 10, '0'), LPAD(a.id, 30, '0')) AS cursor
        FROM "Artist" AS a
        JOIN (
            SELECT artist_id, COUNT(*) AS count 
            FROM "UserLikedArtist"
            GROUP BY artist_id
        ) AS u ON a.id = u.artist_id
        ORDER BY u.count DESC, a.id DESC
        LIMIT ${limit + 1};
    `;
    }

    return result;
};
