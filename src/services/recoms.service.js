import { sentRecomsResponseDTO, receivedRecomsResponseDTO, searchRecomsResponseDTO } from "../dtos/recoms.dto.js";
import { RecomsSongNotFoundError, UserMismatchError, MissingSearchQueryError, RecommendationNotFoundError } from "../errors.js";
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

export const searchRecomsSong = async (userId, keyword) => {
  if (!keyword.trim()) {
    throw new MissingSearchQueryError("검색어가 입력되지 않았습니다.");
  }

  const searchRecomsData = await findSongByKeyword(userId, keyword);

  if (!searchRecomsData || searchRecomsData.length === 0) {
    throw new RecommendationNotFoundError("추천 기록이 존재하지 않습니다.");
  }

  return searchRecomsResponseDTO(searchRecomsData, userId);
};
