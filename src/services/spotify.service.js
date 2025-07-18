import axios from 'axios';
import qs from 'qs';

import { searchTracksResponseDTO, getSongInfoResponseDTO } from '../dtos/recoms.dto.js';
import { NotFoundSongError, TokenError, NotFoundKeywordError } from '../errors.js';

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

export async function searchSpotifyTracks(keyword, cursor = 0) {
  const token = await getSpotifyToken();
  if (!token) {
    throw new TokenError("유효하지 않은 스포티파이 토큰입니다.");
  }

  try {
    const res = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: keyword,
        type: 'track',
        offset: cursor,
        limit: 20,
      },
    });

    const result = res.data.tracks.items.map((track) =>
      searchTracksResponseDTO({
        id: track.id,
        artist: track.artists.map((a) => a.name).join(', '),
        album: track.album.name,
        albumImg: track.album.images?.[0]?.url || null,
      })
    );

    return result;
  } catch (err) {
    console.error("Spotify 트랙 검색 실패:", err.response?.data || err.message);

    if (err.response && err.response.status === 400) {
      throw new NotFoundKeywordError("검색어가 없거나 잘못된 요청입니다.");
    }

    throw new Error("Spotify 트랙 검색 중 알 수 없는 오류가 발생했습니다.");
  }
}

export async function getSongInfo(songId) {
  const token = await getSpotifyToken();
  if (!token) {
    throw new TokenError("유효하지 않은 스포티파이 토큰입니다.");
  }

  try {
    const res = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = getSongInfoResponseDTO(res.data);
    return result;

  } catch (err) {
    console.error("Spotify API 요청 실패:", err.response?.data || err.message);

    if (err.response && err.response.status === 400) {
      throw new NotFoundSongError("트랙 ID가 잘못되었거나 존재하지 않습니다.");
    }

    throw new Error("Spotify 요청 중 알 수 없는 오류가 발생했습니다.");
  }
}