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
    const prompt = `국내에서 실제로 활동 중인 인디 밴드 한 팀을 추천해줘.  
    조건: 
    - 밴드 이름은 반드시 한글로만 작성하고, 특수기호·영문·숫자는 쓰지 마.  
    - 이전에 추천했던 아티스트는 가급적 중복하지 마.  
    - 존재하지 않는 밴드를 만들어내지 말고, 실제로 앨범을 발매하거나 공연한 적이 있는 팀만 추천해.  
    출력 형식:  
    밴드이름/이 밴드 노래를 들어보길 추천하는 이유 (친근한 한 줄 코멘트)`;

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
