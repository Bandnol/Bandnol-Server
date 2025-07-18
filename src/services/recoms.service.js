import { sentRecomsResponseDTO, receivedRecomsResponseDTO, userRecomsSongResponseDTO } from "../dtos/recoms.dto.js";
import { RecomsSongNotFoundError, UserMismatchError, NotFoundKeywordError, NoUserError, DuplicateRecoms, NotFoundSongError } from "../errors.js";
import { getSentRecomsSong, getReceivedRecomsSong, findSongByKeyword, getSenderToday, getRecomsSong, createRecomsSong, createUserRecomsSong } from "../repositories/recoms.repository.js";
import { getUser } from "../repositories/users.repository.js";
import { getSongInfo } from "./spotify.service.js";

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
        throw new NotFoundKeywordError("검색어를 입력하세요.");
    }
    return await findSongByKeyword(userId, keyword);
};

export const addRecoms = async(data, userId) => {
    // 로그인한 사용자인지 확인 
    const recomsUser = await getUser(userId);
    if(!recomsUser){
        throw new NoUserError("사용자를 찾을 수 없습니다. 로그인 후 이용부탁드립니다.");
    }

    // 오늘 추천한 적 있는지 확인
    const existUser = await getSenderToday(userId);
    if(existUser){
        throw new DuplicateRecoms("오늘은 이미 노래를 추천하셨습니다.");
    }

    // recomsSong 테이블에 데이터 생성
    let recomsSong = await getRecomsSong(data.id);
    if(!recomsSong){
        const songData = await getSongInfo(data.id);
        console.log(songData);
        if(!songData){
            throw new NotFoundSongError("트랙 ID가 존재하지 않습니다.");
        }
        recomsSong = await createRecomsSong(songData);
    }

    //UserRecomsSong 테이블에 데이터 생성
    if(!recomsSong){
        throw new RecomsSongNotFoundError("recomsSong 테이블에 데이터가 생성되지 않았습니다.");
    }

    const newUserSongData = await createUserRecomsSong(data,userId,recomsSong);
    return userRecomsSongResponseDTO(newUserSongData);
}