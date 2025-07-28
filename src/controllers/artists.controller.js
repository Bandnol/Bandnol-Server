import { StatusCodes } from "http-status-codes";
import { viewRecomArtists } from "../services/artists.service.js";
import { searchItunesTracks } from "../services/spotify.service.js";
import { NotFoundKeywordError } from "../errors.js";
import { genAIComment } from "../services/gemini.service.js";

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
