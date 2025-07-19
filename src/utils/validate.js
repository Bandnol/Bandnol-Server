import { RecommendationNotFoundError, UserMismatchError } from "../errors.js";

export const checkAuth = (data, userId, role) => {
    if (!data) {
        throw new RecommendationNotFoundError("추천 곡을 찾을 수 없습니다.");
    }

    const targetId = role === "sender" ? data.sender?.id : role === "receiver" ? data.receiver?.id : data[role]; // data.receiverId 같은 경우

    if (!targetId) {
        throw new RecommendationNotFoundError("데이터 구조에 문제가 있습니다.");
    }

    if (targetId !== userId) {
        throw new UserMismatchError(
            `본인이 ${role === "sender" ? "발신" : "수신"}한 추천 곡이 아닙니다. 권한이 없습니다.`
        );
    }
};

export const checkAuthByType = (data, type, userId) => {
    if (!data) {
        throw new RecommendationNotFoundError("추천 곡을 찾을 수 없습니다.");
    }

    const targetId = type === "sent" ? data.sender?.id : data.receiver?.id;

    if (!targetId) {
        throw new RecommendationNotFoundError("데이터 구조에 문제가 있습니다.");
    }

    if (targetId !== userId) {
        throw new UserMismatchError("본인이 발신/수신한 답장이 아닙니다. 조회 권한이 없습니다.");
    }
};
