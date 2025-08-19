import {
    sentRecomsResponseDTO,
    receivedRecomsResponseDTO,
    searchRecomsResponseDTO,
    commentResponseDTO,
    likeStatusResponseDTO,
    userRecomsSongResponseDTO,
    replyResponseDTO,
    calendarRecomsResponseDTO,
    createdReplyResponseDTO,
    listRecomsResponseDTO,
} from "../dtos/recoms.dto.js";
import {
    QueryParamError,
    RequestBodyError,
    NoUserError,
    DuplicateRecomsError,
    NotFoundSongError,
    RecomsNotFoundOrAuthError,
    RecommendationNotFoundError,
    NoModifyDataError,
    NoReplyError,
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
    createReply,
    getListRecomsSong,
    updateReceiver,
    createUserRecomsSongByAI,
    updateIsDeliveredToTrue,
} from "../repositories/recoms.repository.js";
import {
    createArtist,
    createSing,
    getSing,
    getArtistById,
    getArtistByName,
} from "../repositories/artists.repository.js";
import {
    createNotifications,
    getAllowedNotifications,
    getExpoTokens,
    getUserById,
} from "../repositories/users.repository.js";
import { getSongInfo, getArtistInfo, getSongInfoBySearch } from "./musicAPI.service.js";
import { Prisma } from "@prisma/client";
import { genAIAutoRecoms } from "./gemini.service.js";
import redisClient from "../utils/redis.js";
import { sendPushNotification } from "../utils/expo.push.token.js";

export const sentRecomsSong = async (userId) => {
    const data = await getSentRecomsSong(userId);
    if (!data) {
        return [];
    }
    return sentRecomsResponseDTO(data);
};

export const receivedRecomsSong = async (userId) => {
    const data = await getReceivedRecomsSong(userId);
    if (!data) {
        return [];
    }
    return receivedRecomsResponseDTO(data);
};

export const addRecoms = async (data, userId) => {
    // 로그인한 사용자인지 확인
    const recomsUser = await getUserById(userId);
    if (!recomsUser) {
        throw new NoUserError("사용자를 찾을 수 없습니다. 로그인 후 이용부탁드립니다.");
    }

    // 오늘 추천한 적 있는지 확인
    const existUser = await getSenderToday(userId);
    // if (existUser) {
    //     throw new DuplicateRecomsError("오늘은 이미 노래를 추천하셨습니다.");
    // }

    // recomsSong 테이블에 데이터 생성
    let recomsSong = await getRecomsSong(data.id);
    if (!recomsSong) {
        const songData = await getSongInfo(parseInt(data.id));
        console.log(songData);
        if (!songData) {
            throw new NotFoundSongError("트랙 ID가 존재하지 않습니다.");
        }

        let artistNames;
        if (songData.artist.includes("&")) {
            artistNames = songData.artist.split("&").map((s) => s.trim());
        }
        if (songData.artist.includes(",")) {
            artistNames = songData.artist.split(",").map((s) => s.trim());
        }
        let artists = [];
        for (const artistName of artistNames) {
            const artistData = await getArtistInfo(artistName);
            const existArtist = await getArtistById(artistData.id);
            if (!existArtist) {
                await createArtist(artistData);
            }
            artists.push(artistData);
        }
        console.log(artists);

        const artistIds = artists.map((a) => a.id);

        recomsSong = await createRecomsSong(songData, artistIds);

        let singData = null;
        for (const artist of artists) {
            singData = await getSing(recomsSong.id, artist.id);
            if (!singData) {
                singData = await createSing(recomsSong.id, artist.id);
            }
        }
    }

    const newUserSongData = await createUserRecomsSong(data, userId, recomsSong);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0); // 오늘 자정(내일 0시)으로 설정

    const expireAt = tomorrow.getTime();
    await redisClient.set(`userRecomsSongData:user:${userId}`, JSON.stringify(newUserSongData), { PXAT: expireAt });

    return userRecomsSongResponseDTO(newUserSongData);
};

export const viewComment = async (recomsId, type, userId) => {
    if (!["sent", "received"].includes(type)) {
        throw new QueryParamError("필수 쿼리 파라미터가 입력되지 않았거나 잘못된 쿼리 파라미터를 입력했습니다.");
    }
    const data = await getCommentAndReply(recomsId, type, userId);

    if (!data) {
        throw new RecomsNotFoundOrAuthError("추천 곡이 없거나 접근 권한이 없습니다.");
    }
    return commentResponseDTO(data);
};

export const searchRecomsSong = async (userId, keyword) => {
    if (!keyword.trim()) {
        throw new QueryParamError("검색어가 입력되지 않았습니다.");
    }

    const searchRecomsData = await findSongByKeyword(userId, keyword);
    const send = searchRecomsData.filter((r) => r.senderId === userId);
    const receive = searchRecomsData.filter((r) => r.senderId !== userId);

    return {
        send: send.map(searchRecomsResponseDTO),
        receive: receive.map((item) => searchRecomsResponseDTO(item, true)), // true → isReceived
    };
};

export const modifyLikeStatus = async (recomsId, userId, isLiked) => {
    try {
        if (![true, false, null].includes(isLiked)) {
            throw new RequestBodyError("Request Body가 올바르지 않습니다.");
        }
        const data = await patchLikeStatus(recomsId, userId, isLiked);
        return likeStatusResponseDTO(data);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new RecomsNotFoundOrAuthError("추천 곡이 없거나 접근 권한이 없습니다.");
        }
        throw err;
    }
};

export const viewReplies = async (recomsId, type, userId) => {
    if (!["sent", "received"].includes(type)) {
        throw new QueryParamError("필수 쿼리 파라미터가 입력되지 않았거나 잘못된 쿼리 파라미터를 입력했습니다.");
    }
    const data = await getCommentAndReply(recomsId, type, userId);
    if (!data) {
        throw new RecomsNotFoundOrAuthError("추천 곡이 없거나 접근 권한이 없습니다.");
    }
    if (!data.replies) {
        throw new NoReplyError("답장이 없습니다.");
    }
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

    return calendarRecomsResponseDTO(data);
};

export const sendReplies = async (recomsId, userId, content) => {
    try {
        if (!content) {
            throw new RequestBodyError("Request Body가 올바르지 않습니다.");
        }
        const data = await createReply(recomsId, userId, content);

        if (!data) {
            throw new RecomsNotFoundOrAuthError("추천 곡이 없거나 접근 권한이 없습니다.");
        }

        // 푸시 알림 발송
        const senderId = data.userRecomsSong.senderId;
        const senderNotification = await getAllowedNotifications(senderId);

        if (senderNotification?.commentArrived) {
            const tokens = await getExpoTokens(senderId);
            const body = `띵동~ 오늘의 추천곡에 대한 ${data.responder.nickname} 님의 코멘트가 도착했어요!`;
            await sendPushNotification(tokens, "코멘트 도착!", body, {
                link: "bandnol://music-recommend/sendRecommend",
            });

            // 알림 테이블에 저장 (링크 추후 수정)
            const notification = await createNotifications(
                senderId,
                userId,
                "COMMENT_ARRIVED",
                "bandnol://music-recommend/sendRecommend"
            );
            console.log(notification);
        }

        return createdReplyResponseDTO(data);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002" && err.meta?.target?.includes("user_recoms_song_id")) {
                throw new DuplicateRecomsError("이미 해당 추천곡에 대한 답장이 존재합니다.");
            }
        }
        throw err;
    }
};

export const listRecomsSong = async (userId) => {
    const data = await getListRecomsSong(userId);

    return listRecomsResponseDTO(data, userId);
};

export const sendUserRecoms = async (recomsId, receiverId, senderId) => {
    let update = await updateReceiver(recomsId, receiverId);
    if (!update) {
        throw new RecommendationNotFoundError("userRecomsSong 테이블에 데이터가 생성되지 않았습니다.");
    }
    await redisClient.del(`userRecomsSongData:user:${senderId}`);

    // isDelivered true로 변경
    const isDelivered = await updateIsDeliveredToTrue(receiverId);
    if (!isDelivered) {
        throw new NoModifyDataError("userId가 잘못되었습니다. isDelivered가 변경되지 않았습니다.");
    }
    await redisClient.sRem("user:isDeliveredFalse", receiverId); // redis set에서 데이터 제거
    return update;
};

export const sendAIRecoms = async (userId) => {
    // 보낼 추천 곡이 없는 경우 - AI 생성
    const result = await genAIAutoRecoms();
    //console.log(result);

    // iTunes에서 곡 정보 받아오기 (DTO로 가공됨)
    const songData = await getSongInfoBySearch(result.artist);
    //console.log("songData: ", songData);
    if (!songData.id) {
        throw new NotFoundSongError("트랙이 존재하지 않습니다.");
    }

    // recomsSong에 중복 데이터가 있는지 확인 -> artist만으로는 중복 데이터를 확인할 수 없어서 부득이하게 곡 정보를 가져온 후 검사를 하게 됨
    let recomsSong = await getRecomsSong(songData.id);

    // recomsSong 테이블에 데이터 생성
    if (!recomsSong) {
        recomsSong = await createRecomsSong(songData);
        if (!recomsSong) {
            throw new RecommendationNotFoundError("recomsSong 테이블에 데이터가 생성되지 않았습니다.");
        }
        //console.log("ai가 recomsSong에 생성한 데이터: ", recomsSong);
    }

    // UserRecomsSong 테이블에 데이터 생성
    let newUserSongData = await createUserRecomsSongByAI(userId, songData.comment || result.comment, recomsSong);
    if (!newUserSongData) {
        throw new RecommendationNotFoundError("userRecomsSong 테이블에 데이터가 생성되지 않았습니다.");
    }
    //console.log("ai가 userRecomsSong에 생성한 데이터: ", newUserSongData);

    // isDelivered true로 변경
    await redisClient.sRem("user:isDeliveredFalse", userId); // redis set에서 데이터 제거
    const isDelivered = await updateIsDeliveredToTrue(userId);
    if (!isDelivered) {
        throw new NoModifyDataError("userId가 잘못되었습니다. isDelivered가 변경되지 않았습니다.");
    }
    //console.log(isDelivered);
    return newUserSongData;
};
