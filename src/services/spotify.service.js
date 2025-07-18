import axios from 'axios';
import qs from 'qs';

import { searchTracksResponseDTO } from '../dtos/recoms.dto.js';
import { NotFoundKeywordError } from '../errors.js';

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
    console.error('Error fetching Spotify token:', error.response?.data || error.message);
    throw new Error('Spotify token fetch failed');
  }
}

// 추천할 노래 검색 (추천 수신할 때)
export async function searchSpotifyTracks(keyword, cursor) {

  const token = await getSpotifyToken();

  const res = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: keyword,
      type: 'track',
      offset: cursor,
      limit: 20
    },
  });

    const result = res.data.tracks.items.map((track) =>
        searchTracksResponseDTO({
            id: track.id,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            albumImg: track.album.images?.[0]?.url || null
        })
    );

  return result;
}