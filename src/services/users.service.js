import { NoModifyDataError, NoUserError } from "../errors.js";
import {
    getUserById,
    getUserByOwnId,
    modifyUser
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

export const modifyUserInfo = async (userId, data) => {
     const allowedFields = ["nickname","ownId","gender","birth","recomsTime","bio"];

  const user = await getUserById(userId);
  if (!user) {
    throw new NoUserError("존재하지 않는 사용자 ID입니다.");
  }

  const updates = {};

  for (const field of allowedFields) {
    const value = data[field];
    if (value !== undefined && value !== "") {
      updates[field] = value;
    }
  }

  // 날짜 형식 변환
  if (updates.birth) {
    const parsedDate = new Date(updates.birth);
    if (!isNaN(parsedDate.getTime())) {
      updates.birth = parsedDate;
    } else {
      delete updates.birth;
    }
  }
  console.log("updates:", updates);

  const isModified = allowedFields.some(field => data[field] != undefined);
  if (!isModified) {
    throw new NoModifyDataError("수정할 데이터가 없습니다.");
  }

  const updatedUser = await modifyUser(user.id, updates);

  return { userId: updatedUser.id };
}