import axios from 'axios';
import qs from 'qs';

import { getSongInfoResponseDTO } from '../dtos/recoms.dto.js';
import { NotFoundSongError, TokenError, NotFoundKeywordError } from '../errors.js';


export async function searchItunesTracks(keyword, cursor = 15) {
  try {
    const itunesData = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: keyword,
        media: 'music',
        limit: cursor,
      },
    });

    console.log(itunesData.data.results);

    const result = itunesData.data.results.map((result) =>
      getSongInfoResponseDTO(result)
    );

    console.log(result);
    return result;
  } catch (err) {
    console.error("iTunes 트랙 검색 실패:", err.response?.data || err.message);

    if (err.response && err.response.status === 400) {
      throw new NotFoundKeywordError("검색어가 없거나 잘못된 요청입니다.");
    }

    throw new Error("iTunes 트랙 검색 중 알 수 없는 오류가 발생했습니다.");
  }
}

export async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Spotify 토큰 발급 실패:", err.response?.data || err.message);
    throw new Error("Spotify 토큰 발급 중 알 수 없는 오류가 발생했습니다.");
  }
}

export async function getSongInfo(trackId) {
  try {
    // 노래 아이디로 iTunes에서 아티스트 & 노래제목 불러오기
    const itunesData = await axios.get('https://itunes.apple.com/lookup', {
      params: {
        id: trackId,
      },
    });

    const track = itunesData.data.results?.[0];
    if (!track) throw new NotFoundSongError('곡 정보를 찾을 수 없습니다.');
    
    const result = getSongInfoResponseDTO(track);
    return result;

  } catch (err) {
    console.error("iTunes API 요청 실패:", err.response?.data || err.message);

    if (err.response && err.response.status === 400) {
      throw new NotFoundSongError("트랙 ID가 잘못되었거나 존재하지 않습니다.");
    }

    throw new Error("iTunes 요청 중 알 수 없는 오류가 발생했습니다.");
  }
}

export async function getArtistInfo(artistName) {
  try{
    const token = await getSpotifyToken();
    if (!token) {
      throw new TokenError("유효하지 않은 스포티파이 토큰입니다.");
    }
    console.log(artistName);
    const spotifyData = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
    params: {
      q: artistName,
      type: 'artist',
      limit: 1,
    },
  });

    return { 
      id: spotifyData.data.artists.items[0].id, 
      name: spotifyData.data.artists.items[0].name, 
      imgUrl: spotifyData.data.artists.items[0].images[0].url
    };
  }catch(err){
    console.error("Spotify API 요청 실패:", err.response?.data || err.message);

    if (err.response && err.response.status === 400) {
      throw new NotFoundSongError("트랙 ID가 잘못되었거나 존재하지 않습니다.");
    }

    throw new Error("Spotify 요청 중 알 수 없는 오류가 발생했습니다.");
  }
}