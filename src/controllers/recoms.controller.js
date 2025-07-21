import { StatusCodes } from "http-status-codes";
import {
    sentRecomsSong,
    receivedRecomsSong,
    searchRecomsSong,
    viewComment,
    modifyLikeStatus,
    addRecoms,
    viewReplies,
    calendarRecomsSong,
    sendReplies,
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
    try {
        const keyword = req.query.keyword;
        const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

        const tracks = await searchSpotifyTracks(keyword, cursor);
        res.status(StatusCodes.OK).success(tracks);
    } catch (err) {
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

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsNotFoundOrAuthError"
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

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsNotFoundOrAuthError"
    };
    */

    try {
        const recomsData = await receivedRecomsSong(req.params.recomsId, req.user.id);
        res.status(StatusCodes.OK).success(recomsData);
    } catch (err) {
        next(err);
    }
};

export const handleSearchRecomSong = async (req, res, next) => {
    /*
        #swagger.summary = '추천 기록 검색 API'

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

        #swagger.responses[404] = {
            $ref: "#/components/responses/RecommendationNotFoundError"
        };
    */

    try {
        const searchRecomsData = await searchRecomsSong(req.user.id, req.query.keyword);
        res.status(StatusCodes.OK).success(searchRecomsData);
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

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsNotFoundOrAuthError"
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

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsNotFoundOrAuthError"
    };
    */

    try {
        const status = await modifyLikeStatus(req.params.recomsId, req.user.id, req.body.isLiked);
        res.status(StatusCodes.OK).success(status);
    } catch (err) {
        next(err);
    }
};

export const handleViewReplies = async (req, res, next) => {
    /*
    #swagger.summary = '답장 조회 API'

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

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsNotFoundOrAuthError"
    };
    */

    try {
        const reply = await viewReplies(req.params.recomsId, req.query.type, req.user.id);
        res.status(StatusCodes.OK).success(reply);
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

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", example: "6ZGQHCOhbYCNgbOkc9PVjN" },
              isAnoymous: { type: "boolean", example: "true" },
              comment: { type: "string", example: "여름에 잘 어울리는 곡입니다. ~ " },
            },
          }
        }
      }
    };

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
};

export const handleAIComment = async (req, res, next) => {
    /*
    #swagger.summary = 'AI를 이용하여 코멘트 작성하기 API'

    #swagger.security = [{
        bearerAuth: []
    }]

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string", example: "좋은날" },
              artist: { type: "string", example: "아이유" },
              prompt: { type: "string", example: "존댓말로 가수를 강조하는 느낌으로 작성해줘" },
            },
          }
        }
      }
    };

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
};

export const handleCalendarRecomSong = async (req, res, next) => {
    /*
        #swagger.summary = '추천 기록 캘린더 조회 API'

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

        #swagger.responses[404] = {
            $ref: "#/components/responses/RecommendationNotFoundError"
        };
    */

    try {
        const calendarRecomsData = await calendarRecomsSong(
            req.user.id,
            req.query.year,
            req.query.month,
            req.query.status
        );
        res.status(StatusCodes.OK).success(calendarRecomsData);
    } catch (err) {
        next(err);
    }
};

export const handleSendReplies = async (req, res, next) => {
    /*
    #swagger.summary = '답장 전송 API'

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

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecomsNotFoundOrAuthError"
    };

    #swagger.responses[409] = {
        $ref: "#/components/responses/DuplicateReplyError"
    };
    */

    try {
        const reply = await sendReplies(req.params.recomsId, req.user.id, req.body.content);
        res.status(StatusCodes.OK).success(reply);
    } catch (err) {
        next(err);
    }
};
