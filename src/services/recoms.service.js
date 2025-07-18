import { sentRecomsResponseDTO, receivedRecomsResponseDTO, commentResponseDTO } from "../dtos/recoms.dto.js";
import { RecommendationNotFoundError, UserMismatchError, NotFoundKeywordError, QueryParamError } from "../errors.js";
import {
    getSentRecomsSong,
    getReceivedRecomsSong,
    findSongByKeyword,
    getComment,
} from "../repositories/recoms.repository.js";

export const sentRecomsSong = async (recomsId, userId) => {
    const recomsData = await getSentRecomsSong(recomsId);

    if (!recomsData) {
        throw new RecommendationNotFoundError("해당 추천곡을 찾을 수 없습니다.");
    }

    if (recomsData.sender.id !== userId) {
        throw new UserMismatchError("본인이 발신한 추천 곡이 아닙니다. 조회 권한이 없습니다.");
    }

    return sentRecomsResponseDTO(recomsData);
};

export const receivedRecomsSong = async (recomsId, userId) => {
    const recomsData = await getReceivedRecomsSong(recomsId);

    if (!recomsData) {
        throw new RecommendationNotFoundError("해당 추천곡을 찾을 수 없습니다.");
    }

    if (recomsData.receiver.id !== userId) {
        throw new UserMismatchError("본인이 수신한 추천 곡이 아닙니다. 조회 권한이 없습니다.");
    }

    return receivedRecomsResponseDTO(recomsData);
};

export const searchSong = async (userId, keyword) => {
    if (!keyword) {
        throw new NotFoundKeywordError("검색어를 입력하세요.");
    }
    return await findSongByKeyword(userId, keyword);
};

export const viewComment = async (recomsId, type, userId) => {
    if (!["sent", "received"].includes(type)) {
        throw new QueryParamError("필수 쿼리 파라미터가 입력되지 않았거나 잘못된 쿼리 파라미터를 입력했습니다.");
    }

    const comment = await getComment(recomsId);

    if (!comment) {
        throw new RecommendationNotFoundError("해당 코멘트가 포함된 추천 곡을 찾을 수 없습니다.");
    }

    const targetId = type === "sent" ? comment.sender.id : comment.receiver.id;

    if (targetId !== userId) {
        throw new UserMismatchError("본인이 발신/수신한 코멘트가 아닙니다. 조회 권한이 없습니다.");
    }

    console.log(comment);
    return commentResponseDTO(comment);
};
