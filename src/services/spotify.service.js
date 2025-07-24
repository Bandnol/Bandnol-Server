import axios from "axios";
import qs from "qs";

import { getSongInfoResponseDTO } from "../dtos/recoms.dto.js";
import { NotFoundSongError, TokenError, NotFoundKeywordError } from "../errors.js";

export async function searchItunesTracks(keyword, cursor = 15) {
    try {
        const itunesData = await axios.get("https://itunes.apple.com/search", {
            params: {
                term: keyword,
                media: "music",
                limit: cursor,
            },
        });

        console.log(itunesData.data.results);

        const result = itunesData.data.results.map((result) => getSongInfoResponseDTO(result));

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
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            qs.stringify({ grant_type: "client_credentials" }),
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded",
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
        const itunesData = await axios.get("https://itunes.apple.com/lookup", {
            params: {
                id: trackId,
            },
        });

        const track = itunesData.data.results?.[0];
        if (!track) throw new NotFoundSongError("곡 정보를 찾을 수 없습니다.");

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
    try {
        const token = await getSpotifyToken();
        if (!token) {
            throw new TokenError("유효하지 않은 스포티파이 토큰입니다.");
        }
        console.log(artistName);
        const spotifyData = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`,
            },

            params: {
                q: artistName,
                type: "artist",
                limit: 1,
            },
        });

        return {
            id: spotifyData.data.artists.items[0].id,
            name: spotifyData.data.artists.items[0].name,
            imgUrl: spotifyData.data.artists.items[0].images[0].url,
        };
    } catch (err) {
        console.error("Spotify API 요청 실패:", err.response?.data || err.message);

        if (err.response && err.response.status === 400) {
            throw new NotFoundSongError("트랙 ID가 잘못되었거나 존재하지 않습니다.");
        }

        throw new Error("Spotify 요청 중 알 수 없는 오류가 발생했습니다.");
    }
}

export async function getSongInfoBySearch(artist) {
    try {
        // 아티스트 이름으로 iTunes에서 아티스트 & 노래 정보 불러오기
        const itunesData = await axios.get("https://itunes.apple.com/search", {
            params: {
                media: "music",
                term: artist,
                attribute: "artistTerm",
                country: "KR",
                lang: "ko_kr",
            },
        });

        let results = itunesData.data.results || [];
        // 정보가 없으면 backup 데이터 반환
        if (results.length === 0) {
            return {
                id: "1750866318",
                title: "파도",
                artist: "고고학",
                album: "VOL.04 - EP",
                albumImg:
                    "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f7/02/52/f7025226-a5ed-0c06-92da-ac185ceecaa8/8800242664761.jpg/100x100bb.jpg",
                previewUrl:
                    "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/78/50/da/7850daec-e772-81da-8295-acb01153563f/mzaf_7649718482759982762.plus.aac.p.m4a",
                comment: "꼭 들어주세요 ...",
            };
        }

        // 트랙을 랜덤으로 선택
        const i = Math.floor(Math.random() * results.length);
        const track = results[i];
        const result = getSongInfoResponseDTO(track);
        return result;
    } catch (err) {
        // 기본 정보 던져주기
        console.error("iTunes API 요청 실패:", err.response?.data || err.message);

        if (err.response && err.response.status === 400) {
            throw new NotFoundSongError("트랙 ID가 잘못되었거나 존재하지 않습니다.");
        }

        throw new Error("iTunes 요청 중 알 수 없는 오류가 발생했습니다.");
    }
}
