import { StatusCodes } from "http-status-codes";
import {
    sentRecomsSong,
    receivedRecomsSong,
    searchRecomsSong,
    viewComment,
    modifyLikeStatus,
    addRecoms,
    viewReplies,
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

export const handleSearchRecomSong = async (req, res, next) => {

    /*
        #swagger.summary = '추천 기록 검색 API'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.parameters['keyword'] = {
            in: 'query',
            name: 'keyword',
            required: true,
            schema: { type: 'string', example: 'Blueming' },
            description: '검색어(곡 제목 또는 아티스트명)'
        }

        #swagger.responses[200] = {
            description: '검색 성공 응답',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean', example: true },
                            data: {
                                type: 'object',
                                properties: {
                                    send: {
                                        type: 'array',
                                        description: '내가 발신한 곡 리스트',
                                        items: { $ref: '#/components/schemas/RecomsSongItem' }
                                    },
                                    receive: {
                                        type: 'array',
                                        description: '내가 수신한 곡 리스트',
                                        items: {
                                            allOf: [
                                                { $ref: '#/components/schemas/RecomsSongItem' },
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        senderNickname: { type: 'string', example: 'noshel' }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            error: { type: 'object', nullable: true, example: null }
                        }
                    }
                }
            }
        }

        #swagger.responses[400] = {
            description: '검색어 미입력',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean', example: false },
                            data: { type: 'string', nullable: true, example: null },
                            error: {
                                type: 'object',
                                properties: {
                                    code: { type: 'string', example: 'RS1300' },
                                    message: { type: 'string', example: '검색어를 입력하세요.' }
                                }
                            }
                        }
                    }
                }
            }
        }

        #swagger.responses[404] = {
            description: '검색 결과 없음',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean', example: false },
                            data: { type: 'string', nullable: true, example: null },
                            error: {
                                type: 'object',
                                properties: {
                                    code: { type: 'string', example: 'RS1301' },
                                    message: { type: 'string', example: '검색 결과가 없습니다.' }
                                }
                            }
                        }
                    }
                }
            }
        }
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

    #swagger.responses[403] = {
        $ref: "#/components/responses/UserMismatchError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/RecommendationNotFoundError"
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
};
