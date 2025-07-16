import { StatusCodes } from "http-status-codes";
import { sentRecomsSong, receivedRecomsSong, searchSong } from "../services/recoms.service.js";
import { searchSpotifyTracks } from "../services/spotify.service.js";

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
    try {
        const { keyword } = req.query;
        const userId = req.user.userId;
        const results = await searchSong(userId, keyword);

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
