import * as recomsService from '../services/recoms.service.js';

export const searchRecomSong = async (req, res, next) => {
  try {
    const { artistName, songName } = req.query;
    //const userId = req.user.id; 
    const userId = "user-1"; // 임시로 고정
    const result = await recomsService.searchSong(userId, artistName, songName);

    res.status(200).json({
      success: true,
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
