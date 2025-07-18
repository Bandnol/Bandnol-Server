import { StatusCodes } from "http-status-codes";
import { sentRecomsSong, receivedRecomsSong, searchSong } from "../services/recoms.service.js";
import { searchSpotifyTracks } from "../services/spotify.service.js";
import { NotFoundKeywordError } from "../errors.js";


export const handleAllTracks = async (req, res, next) => {
    /*
    #swagger.summary = 'Spotify API 이용하여 추천할 노래 검색하기';
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };
  */

    const keyword = req.query.keyword;
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const tracks = await searchSpotifyTracks(keyword, cursor);
    res.status(StatusCodes.OK).success(tracks);
};

export const handleSentRecomsSong = async (req, res, next) => {
    /*
    #swagger.summary = '발신한 추천 곡 조회 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsSongNotFoundError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };
    */

    try {
        const recomsData = await sentRecomsSong(req.params.recomsId, req.user.userId);
        res.status(StatusCodes.OK).success(recomsData);
    } catch (err) {
        next(err);
    }
};

export const handleReceivedRecomsSong = async (req, res, next) => {
    /*
    #swagger.summary = '수신한 추천 곡 조회 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsSongNotFoundError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };
    */

    try {
        const recomsData = await receivedRecomsSong(req.params.recomsId, req.user.userId);
        res.status(StatusCodes.OK).success(recomsData);
    } catch (err) {
        next(err);
    }
};

export const searchRecomSong = async (req, res, next) => {

  /*
    #swagger.summary = '추천 기록 검색 API'

    #swagger.security = [{
        bearerAuth: []
    }]
    
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsSongNotFoundError"
    };
  */  
  try {
    const { keyword } = req.query;
    const userId = req.user.userId; 

    // 1) 검색어 없으면
    if (!keyword || keyword.trim() === "") {
      throw new NotFoundKeywordError("검색어를 입력하세요.");
    }

    const results = await searchSong(userId, keyword);

    // // 2) 결과가 없으면
    // if (results.length === 0) {
    //   throw new RecommendationNotFoundError("추천 기록이 존재하지 않습니다.");
    // }
    
    const send = [];
    const receive = [];

    for (const item of results) {
      const commonData = {
        date: item.createdAt,
        comment: item.comment,
        title: item.recomsSong.title,
        artistName: item.recomsSong.artistName,
        imageUrl: item.recomsSong.imgUrl,
      };

      if (item.senderId === userId) {
        send.push(commonData);
      }
      if (item.receiverId === userId) {
        receive.push({
          ...commonData,
          senderNickname: item.sender.nickname,
        });
      }
    }
    
      res.status(200).success({ send, receive });
    } catch (err) {
        next(err);
    }
};
