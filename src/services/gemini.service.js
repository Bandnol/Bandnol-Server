// gemini.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserById } from "../repositories/users.repository.js";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-latest" });

export const genAIComment = async (data, userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new NoUserError("사용자를 찾을 수 없습니다. 로그인 후 이용부탁드립니다.");
    }

    const title = data.title;
    const artist = data.artist;
    const requirement = data?.prompt;

    const prompt = requirement?.trim()
        ? `${artist}의 ${title} 노래를 추천하고 싶어. 왜 추천하고 싶은지 이에 대한 코멘트를 간단하게 작성해줘.\n
      다음 요구사항을 반영해서 작성해줘. ${requirement}.`
        : `${artist}의 ${title} 노래를 추천하고 싶어. 왜 추천하고 싶은지 이에 대한 코멘트를 간단하게 작성해줘`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return text;
    } catch (err) {
        console.error("Gemini API 요청 실패:", err.response?.data || err.message);
        throw new Error("Gemini 요청 중 알 수 없는 오류가 발생했습니다.");
    }
};

export const genAIAutoRecoms = async () => {
    const prompt = `국내 인디 밴드 하나를 추천해줘(한글 이름만 반환, 특수기호 제외).
    자꾸 새소년만 추천하지 말고 다른 아티스트들도 추천해줬으면 좋겠어.
    그리고 이 그룹의 노래를 왜 추천하는지 친근하게 한 줄 이내로 코멘트를 작성해줘.
    밴드 이름과 코멘트는 '/' 기호로 분리해줘`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`gemini 전체 텍스트: ${text}`);

        let [artist, comment] = text.split("/");
        artist = artist.trim();
        comment = comment.trim();
        return { artist, comment };
    } catch (err) {
        console.error("Gemini API 요청 실패:", err.response?.data || err.message);
        throw new Error("Gemini 요청 중 알 수 없는 오류가 발생했습니다.");
    }
};
