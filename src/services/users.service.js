import {
    getUserByOwnId
} from "../repositories/users.repository.js";

export const checkOwnId = async (userOwnId) => {
    const userData = await getUserByOwnId(userOwnId);
    if(userData){
        console.log("아이디 중복 / 사용 불가");
        return false;
    }
    console.log("아이디 중복 아님 / 사용 가능");
    return true;
}