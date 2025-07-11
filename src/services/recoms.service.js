import * as recomsRepo from '../repositories/recoms.repository.js';

export const searchSong = async (userId, artistName, songName) => {
  if (!artistName && !songName) {
    const error = new Error('검색어를 입력하세요.');
    error.status = 400;
    error.code = 'RS1300';
    throw error;
  }

  return await recomsRepo.findSongByUser(userId, artistName, songName);
};
