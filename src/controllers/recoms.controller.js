import { StatusCodes } from "http-status-codes";
import { sentRecomsSong, receivedRecomsSong, searchSong } from "../services/recoms.service.js";
import { searchSpotifyTracks } from "../services/spotify.service.js";
import { MissingSearchQueryError } from "../errors.js";
import { RecommendationNotFoundError } from "../errors.js";


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
        $ref: "#/components/responses/Failed"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/Failed"
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
        $ref: "#/components/responses/Failed"
    };

    #swagger.responses[403] = {
        $ref: "#/components/responses/Failed"
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
    const { keyword } = req.query;
    const userId = req.user.userId; 

    // 1) 검색어 없으면
    if (!keyword || keyword.trim() === "") {
      throw new MissingSearchQueryError();
    }

    const results = await searchSong(userId, keyword);

    // 2) 결과가 없으면
    if (results.length === 0) {
      throw new RecommendationNotFoundError();
    }
    
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
