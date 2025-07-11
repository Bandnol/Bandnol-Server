import { StatusCodes } from "http-status-codes";
import { searchSpotifyTracks } from "../services/spotify.service.js";

export const handleAllTracks = async (req, res, next)=>{

  /*
    #swagger.summary = 'Spotify API 이용하여 추천할 노래 검색하기';
    #swagger.responses[200] = {
      $ref: "#/components/responses/Success"
    };
  */

  const keyword = req.query.keyword;
  const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

  const tracks = await searchSpotifyTracks(keyword, cursor); 
  res.status(StatusCodes.OK).success(tracks)
}
