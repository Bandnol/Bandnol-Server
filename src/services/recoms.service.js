import {
    sentRecomsResponseDTO,
    receivedRecomsResponseDTO,
    searchRecomsResponseDTO,
    commentResponseDTO,
    likeStatusResponseDTO,
    userRecomsSongResponseDTO,
    replyResponseDTO,
    calendarRecomsResponseDTO,
} from "../dtos/recoms.dto.js";
import {
    QueryParamError,
    RequestBodyError,
    NoUserError,
    DuplicateRecoms,
    NotFoundSongError,
} from "../errors.js";
import {
    getSentRecomsSong,
    getReceivedRecomsSong,
    findSongByKeyword,
    getCommentAndReply,
    patchLikeStatus,
    getSenderToday,
    getRecomsSong,
    createRecomsSong,
    createUserRecomsSong,
    getCalendarRecomsSong,
} from "../repositories/recoms.repository.js";
import { getUserById } from "../repositories/users.repository.js";
import { getSongInfo } from "./spotify.service.js";
import { checkAuth, checkAuthByType } from "../utils/validate.js";

export const sentRecomsSong = async (recomsId, userId, isLiked) => {
    const recomsData = await getSentRecomsSong(recomsId, isLiked);
    checkAuth(recomsData, userId, "sender");
    return sentRecomsResponseDTO(recomsData);
};

export const receivedRecomsSong = async (recomsId, userId) => {
    const recomsData = await getReceivedRecomsSong(recomsId);
    checkAuth(recomsData, userId, "receiver");
    return receivedRecomsResponseDTO(recomsData);
};

export const addRecoms = async (data, userId) => {
    // 로그인한 사용자인지 확인
    const recomsUser = await getUserById(userId);
    if (!recomsUser) {
        throw new NoUserError("사용자를 찾을 수 없습니다. 로그인 후 이용부탁드립니다.");
    }

    // 오늘 추천한 적 있는지 확인
    const existUser = await getSenderToday(userId);
    if (existUser) {
        throw new DuplicateRecoms("오늘은 이미 노래를 추천하셨습니다.");
    }

    // recomsSong 테이블에 데이터 생성
    let recomsSong = await getRecomsSong(data.id);
    if (!recomsSong) {
        const songData = await getSongInfo(data.id);
        console.log(songData);
        if (!songData) {
            throw new NotFoundSongError("트랙 ID가 존재하지 않습니다.");
        }
        recomsSong = await createRecomsSong(songData);
    }

    //UserRecomsSong 테이블에 데이터 생성
    if (!recomsSong) {
        throw new RecomsSongNotFoundError("recomsSong 테이블에 데이터가 생성되지 않았습니다.");
    }

    const newUserSongData = await createUserRecomsSong(data, userId, recomsSong);
    return userRecomsSongResponseDTO(newUserSongData);
};

export const viewComment = async (recomsId, type, userId) => {
    if (!["sent", "received"].includes(type)) {
        throw new QueryParamError("필수 쿼리 파라미터가 입력되지 않았거나 잘못된 쿼리 파라미터를 입력했습니다.");
    }

    const data = await getCommentAndReply(recomsId);
    checkAuthByType(data, type, userId);

    return commentResponseDTO(data);
};

export const searchRecomsSong = async (userId, keyword) => {
    if (!keyword.trim()) {
      throw new QueryParamError("검색어가 입력되지 않았습니다.");
    }

    const searchRecomsData = await findSongByKeyword(userId, keyword);
    const send = searchRecomsData.filter(r => r.senderId === userId);
    const receive = searchRecomsData.filter(r => r.senderId !== userId);

    return {
        send: send.map(searchRecomsResponseDTO),
        receive: receive.map((item) => searchRecomsResponseDTO(item, true)), // true → isReceived
    };
};

export const modifyLikeStatus = async (recomsId, userId, isLiked) => {
    if (![true, false, null].includes(isLiked)) {
        throw new RequestBodyError("Request Body가 올바르지 않습니다.");
    }

    const status = await patchLikeStatus(recomsId, isLiked);
    checkAuth(status, userId, "receiverId");
    return likeStatusResponseDTO(status);
};

export const viewReplies = async (recomsId, type, userId) => {
    if (!["sent", "received"].includes(type)) {
        throw new QueryParamError("필수 쿼리 파라미터가 입력되지 않았거나 잘못된 쿼리 파라미터를 입력했습니다.");
    }

    const data = await getCommentAndReply(recomsId);
    checkAuthByType(data, type, userId);
    return replyResponseDTO(data);
};

export const calendarRecomsSong = async (userId, year, month, status) => {
    if (!["recommending", "recommended"].includes(status)) {
        throw new QueryParamError("잘못된 추천 상태입니다. 'recommending' 또는 'recommended'만 가능합니다.");
    }

    if (!year || !month) {
        throw new QueryParamError("year와 month 쿼리 파라미터가 누락되었습니다.");
    }

    const data = await getCalendarRecomsSong(userId, year, month, status);

    return calendarRecomsResponseDTO(data, status);
};