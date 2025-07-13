import { trackInfoResponseDTO } from "../dtos/recoms.dto.js";
import { RecomsSongNotFoundError } from "../errors.js";
import { getRecomsSong } from "../repositories/recoms.repository.js";
import { findSentSongByUser } from "../repositories/recoms.repository.js";
import { findReceivedSongByUser } from "../repositories/recoms.repository.js";

export const recomsSong = async (recomsId) => {
    const recomsData = await getRecomsSong(recomsId);

    if (recomsData === null) {
        throw new RecomsSongNotFoundError("해당 추천곡을 찾을 수 없습니다.");
    }

    console.log(recomsData);
    return trackInfoResponseDTO(recomsData);
};

export const searchSong = async (userId, artistName, songName) => {
  if (!artistName && !songName) {
    const error = new Error('검색어를 입력하세요.');
    error.status = 400;
    error.code = 'RS1300';
    throw error;
  }

  const send = await findSentSongByUser(userId, artistName, songName);
  const receive = await findReceivedSongByUser(userId, artistName, songName);

  return {
    send: send
      ? {
          date: send.createdAt,
          comment: send.comment,
          title: send.recomsSong.title,
          artistName: send.recomsSong.artistName,
          imageUrl: send.recomsSong.imgUrl,
        }
      : null,
    receive: receive
      ? {
          senderNickname: receive.sender.nickname,
          date: receive.createdAt,
          comment: receive.comment,
          title: receive.recomsSong.title,
          artistName: receive.recomsSong.artistName,
          imageUrl: receive.recomsSong.imgUrl,
        }
      : null,
  };
};