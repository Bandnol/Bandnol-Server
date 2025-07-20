import { NoModifyDataError, NoUserError, InvalidDateTypeError, InvalidRecomsTimeError } from "../errors.js";
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
  const allowedFields = ["nickname", "ownId", "gender", "birth", "recomsTime", "bio"];

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
  
    // 시간 형식 검사: HHmm
  if (updates.recomsTime) {
    const timeRegex = /^([01]\d|2[0-3])[0-5]\d$/;
  if(!timeRegex.test(updates.recomsTime)) {
        throw new InvalidRecomsTimeError("추천 시간은 HHmm 형식이어야 합니다.");
      }
   }

  /// 날짜 형식 검사: YYYY-MM-DD
  if (updates.birth) {
    if (typeof updates.birth === "string") {
        const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthRegex.test(updates.birth)) {
            throw new InvalidDateTypeError("날짜 형식은 반드시 YYYY-MM-DD 형식이어야 합니다.");
        }

        const parsedDate = new Date(updates.birth);
        if (isNaN(parsedDate.getTime())) {
            throw new InvalidDateTypeError("올바른 birth 값이 아닙니다.");
        }

        updates.birth = parsedDate;
    } else if (updates.birth instanceof Date) {
        if (isNaN(updates.birth.getTime())) {
            throw new InvalidDateTypeError("올바른 birth 값이 아닙니다.");
        }
    } else {
        throw new InvalidDateTypeError("birth 값은 문자열(YYYY-MM-DD)이거나 Date여야 합니다.");
    }
  }

  const isModified = Object.keys(updates).length > 0;
  if (!isModified) {
    throw new NoModifyDataError("수정할 데이터가 없습니다.");
  }

  const updatedUser = await modifyUser(user.id, updates);

  return { userId: updatedUser.id };
};