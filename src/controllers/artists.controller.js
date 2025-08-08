import { StatusCodes } from "http-status-codes";
import { viewRecomArtists, postLikedArtists, viewArtistsChannel } from "../services/artists.service.js";

export const handleViewRecomArtists = async (req, res, next) => {
    /*
    #swagger.summary = '추천 아티스트 채널 목록 조회하기';
    
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };
    
    #swagger.responses[400] = {
      description: "커서 오류, 아티스트나 노래 조회 오류, 쿼리 파라미터 오류",
      content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: false },
                            data: { type: "object", nullable: true },
                            error: {
                                type: "object",
                                properties: {
                                    code: { type: "string", example: "A1300" },
                                    message: { type: "string", example: "아티스트를 불러올 수 없습니다." },
                                },
                            },
                        },
                    },
                },
            },
      }

    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };
  */
    try {
        const list = await viewRecomArtists(req.query.sort, req.query.cursor);
        res.status(StatusCodes.OK).success(list);
    } catch (err) {
        next(err);
    }
};

export const handlePostLikedArtists = async (req, res, next) => {
    /*
    #swagger.summary = '아티스트 즐겨찾기 하기';

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
                        id: { type: "string" },
                        name: { type: "string" },
                        imgUrl: { type: "string" },
                    }
                }
            }
        }
    }
    
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };
    
    #swagger.responses[400] = {
      $ref: "#/components/responses/RequestBodyError"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };
  */
    try {
        const liked = await postLikedArtists(req.body, req.user.id);
        res.status(StatusCodes.OK).success(liked);
    } catch (err) {
        next(err);
    }
};

export const handleViewArtists = async (req, res, next) => {
    /*
    #swagger.summary = '아티스트 채널 조회하기';

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
  */
    try {
        const channel = await viewArtistsChannel(req.user.id, req.params.artistName);
        res.status(StatusCodes.OK).success(channel);
    } catch (err) {
        next(err);
    }
};