import { sentRecomsResponseDTO, receivedRecomsResponseDTO } from "../dtos/recoms.dto.js";
import { RecomsSongNotFoundError, UserMismatchError, MissingSearchQueryError } from "../errors.js";
import { getSentRecomsSong, getReceivedRecomsSong, findSongByKeyword } from "../repositories/recoms.repository.js";

export const sentRecomsSong = async (recomsId, userId) => {
    const recomsData = await getSentRecomsSong(recomsId);

    if (!recomsData) {
        throw new RecomsSongNotFoundError("해당 추천곡을 찾을 수 없습니다.");
    }

    if (recomsData.sender.id !== userId) {
        throw new UserMismatchError("본인이 발신한 추천 곡이 아닙니다. 조회 권한이 없습니다.");
    }

    console.log(recomsData);
    return sentRecomsResponseDTO(recomsData);
};

export const receivedRecomsSong = async (recomsId, userId) => {
    const recomsData = await getReceivedRecomsSong(recomsId);

    if (!recomsData) {
        throw new RecomsSongNotFoundError("해당 추천곡을 찾을 수 없습니다.");
    }

    if (recomsData.receiver.id !== userId) {
        throw new UserMismatchError("본인이 수신한 추천 곡이 아닙니다. 조회 권한이 없습니다.");
    }

    console.log(recomsData);
    return receivedRecomsResponseDTO(recomsData);
};

export const searchSong = async (userId, keyword) => {
    if (!keyword) {
        throw new MissingSearchQueryError();
    }

    return await findSongByKeyword(userId, keyword);
};
