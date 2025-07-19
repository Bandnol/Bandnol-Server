import { StatusCodes } from "http-status-codes";
import {
    sentRecomsSong,
    receivedRecomsSong,
    searchSong,
    viewComment,
    modifyLikeStatus,
    addRecoms,
} from "../services/recoms.service.js";
import { searchSpotifyTracks } from "../services/spotify.service.js";
import { NotFoundKeywordError } from "../errors.js";
import { genAIComment } from "../services/gemini.service.js"; 

export const handleAllTracks = async (req, res, next) => {
    /*
    #swagger.summary = 'Spotify API 이용하여 추천할 노래 검색하기';
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };
  */
  try{
        const keyword = req.query.keyword;
        const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

        const tracks = await searchSpotifyTracks(keyword, cursor);
        res.status(StatusCodes.OK).success(tracks);
  }catch(err){
    next(err);
  }
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

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecommendationNotFoundError"
    };
    */

    try {
        const recomsData = await sentRecomsSong(req.params.recomsId, req.user.id);
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

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecommendationNotFoundError"
    };
    */

    try {
        const recomsData = await receivedRecomsSong(req.params.recomsId, req.user.id);
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

    #swagger.responses[400] = {
        $ref: "#/components/responses/NotFoundKeywordError"
    }

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

        // 결과가 없을 때는 백엔드에서 에러 처리 안 하기로 해서 일단 주석처리 해놨습니당 -> statusCode 겹쳐서 하나만 처리

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

export const handleViewComments = async (req, res, next) => {
    /*
    #swagger.summary = '코멘트 조회 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[400] = {
        $ref: "#/components/responses/QueryParamError"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecommendationNotFoundError"
    };
    */

    try {
        const comment = await viewComment(req.params.recomsId, req.query.type, req.user.id);

        res.status(StatusCodes.OK).success(comment);
    } catch (err) {
        next(err);
    }
};

export const handleModifyLikeStatus = async (req, res, next) => {
    /*
    #swagger.summary = '추천 곡에 좋아요/별로예요 누르기 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[400] = {
        $ref: "#/components/responses/RequestBodyError"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecommendationNotFoundError"
    };
    */

    try {
        const status = await modifyLikeStatus(req.params.recomsId, req.user.id, req.body.isLiked);

        res.status(StatusCodes.OK).success(status);
    } catch (err) {
        next(err);
    }
};

export const handleAddRecoms = async (req, res, next) => {
    /*
    #swagger.summary = '노래 추천하기 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[400] = {
        $ref: "#/components/responses/NotFoundSongError"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/NoUserError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/NotFoundKeywordError"
    };

    #swagger.responses[409] = {
        $ref: "#/components/responses/DuplicateRecomsError"
    };
    */

    try {
        const userId = req.user.id;
        const recomsSong = await addRecoms(req.body, userId);
        console.log(req.body);
        res.status(StatusCodes.OK).success(recomsSong);
    } catch (err) {
        next(err);
    }
}

export const handleAIComment = async (req, res, next) => {
   /*
    #swagger.summary = 'AI를 이용하여 코멘트 작성하기 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/NoUserError"
    };
    
    */

    try {
        const userId = req.user.id;
        console.log(req.body);

        const newComment = await genAIComment(req.body, userId);
        res.status(StatusCodes.OK).success(newComment);
    } catch (err) {
        next(err);
    }
}