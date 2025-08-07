import { QueryParamError, CursorError, NotFoundArtistsError, RequestBodyError } from "../errors.js";
import {
    getArtistsByPopularity,
    createLikedArtist,
    getUserlikedArtist,
    updateInactiveStatusToFalse,
    updateInactiveStatusToTrue,
} from "../repositories/artists.repository.js";
import { getArtistsRandomly } from "./musicAPI.service.js";
import { artistsResponseDTO, recomsArtistsResponseDTO, likedArtistsResponseDTO } from "../dtos/artists.dto.js";

export const viewRecomArtists = async (sort, cursor) => {
    // 커서 오류를 잡기 위한 디코딩
    let decoded;
    if (cursor) {
        try {
            decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
            //console.log("decoded: ", decoded);
        } catch (err) {
            throw new CursorError("커서가 잘못되었습니다.");
        }
    }

    if (!["popularity", "random"].includes(sort)) {
        throw new QueryParamError("필수 쿼리 파라미터가 입력되지 않았거나 잘못된 쿼리 파라미터를 입력했습니다.");
    }

    if (sort === "popularity") {
        // 인기순으로 아티스트 목록 조회 - 즐겨찾기 횟수 순서
        const limit = 20;
        let data = await getArtistsByPopularity(decoded, limit);

        if (!data) {
            throw new NotFoundArtistsError("아티스트를 불러올 수 없습니다.");
        }

        let hasNext = false;
        let nextCursor = null;
        if (data.length > limit) {
            hasNext = true;
            const nextCursorData = {
                artistId: data[limit].id,
            };
            data = data.slice(0, limit);
            nextCursor = Buffer.from(JSON.stringify(nextCursorData)).toString("base64");
        }

        return artistsResponseDTO(data, hasNext, nextCursor);
    } else {
        // 랜덤 아티스트 목록 조회 - 스포티파이에서 불러옴
        const spotifyData = await getArtistsRandomly();
        return recomsArtistsResponseDTO(spotifyData);
    }
};

export const postLikedArtists = async (body, userId) => {
    if (
        typeof body !== "object" ||
        typeof body.id !== "string" ||
        typeof body.name !== "string" ||
        typeof body.imgUrl !== "string"
    ) {
        throw new RequestBodyError("잘못된 request body 형식입니다.");
    }
    let updated;
    const likedArtist = await getUserlikedArtist(body.id, userId);
    if (likedArtist) {
        if (likedArtist.inactiveStatus) {
            updated = await updateInactiveStatusToFalse(likedArtist.id);
        } else {
            updated = await updateInactiveStatusToTrue(likedArtist.id);
        }
    } else {
        updated = await createLikedArtist(body, userId);
    }
    return likedArtistsResponseDTO(updated);
};
