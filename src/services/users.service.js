import {
    NoModifyDataError,
    NoUserError,
    InvalidDateTypeError,
    InvalidRecomsTimeError,
    CursorError,
    AuthError,
    NotFoundOwnIdError,
    RequestBodyError,
    NotFoundNotificationError,
    DuplicateRecomsError,
    DuplicateUserError,
} from "../errors.js";
import {
    getUserById,
    getUserByOwnId,
    modifyUser,
    getNotification,
    createExpoToken,
    updateNotificationSetting,
    createUserAnnouncement,
    updateNotification,
    createUser,
    getUserByEmail,
    modifyUserStatus,
} from "../repositories/users.repository.js";
import { notificationResponseDTO, getMyPageResponseDTO, isConfirmedResponseDTO } from "../dtos/users.dto.js";
import { Prisma } from "@prisma/client";
import { extractS3KeyFromUrl, deleteFromS3ByKey } from "../utils/s3.js";
import redisClient from "../utils/redis.js";
import bcrypt from "bcryptjs";
import { generateRefreshToken, generateToken } from "../utils/token.js";

export const userSignup = async (user) => {
    // 빈 항목 존재하는지 검사
    if(!user.ownId ||!user.password ||!user.nickname ||!user.email || !user.gender || !user.birth ){
        throw new RequestBodyError("비어있는 항목이 존재합니다.");
    }

    // Birth 형식 검사
    if (typeof user.birth === "string") {
        const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthRegex.test(user.birth)) {
            throw new InvalidDateTypeError("날짜 형식은 반드시 YYYY-MM-DD 형식이어야 합니다.");
        }

        const parsedDate = new Date(user.birth);
        if (isNaN(parsedDate.getTime())) {
            throw new InvalidDateTypeError("올바른 birth 값이 아닙니다.");
        }

        user.birth = parsedDate;
    } else if (user.birth instanceof Date) {
        if (isNaN(user.birth.getTime())) {
            throw new InvalidDateTypeError("올바른 birth 값이 아닙니다.");
        }
    } else {
        throw new InvalidDateTypeError("birth 값은 문자열(YYYY-MM-DD)이거나 Date여야 합니다.");
    }

    // 가장 사용자를 나타낼 수 있는 것들로 이미 가입된 사용자인지 확인
    const existUser = await getUserByEmail(user.email);
    if(existUser){
        if(existUser.inactiveStatus == false){
            throw new DuplicateUserError("이미 가입된 사용자입니다.");
        }

        
    }

    // 10 (Salt rounds) : 해시를 생성할 때 내부적으로 2^10 번 연산을 반복
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await createUser({ ...user, password: hashedPassword });

    return newUser;
}

export const userLogin = async (ownId, password) => {
    let user = await getUserByOwnId(ownId);
    let isActive = false;

    if(!user){
        throw new NoUserError("사용자 정보가 없습니다. 회원가입 후 이용해주세요.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AuthError("잘못된 비밀번호입니다.");
    }

    if(user.inactiveStatus==true){
        user = await modifyUserStatus(user.id, false);
        isActive = true;
    }

    const token = generateToken({id: user.id});
    const refreshToken = generateRefreshToken({id: user.id});

    await redisClient.set(`accessToken:user:${user.id}`, token, { EX: 7 * 24 * 60 * 60 });
    await redisClient.set(`refreshToken:user:${user.id}`, refreshToken, { EX: 30 * 24 * 60 * 60 });

    return { user, token, refreshToken, isActive}
}

export const checkOwnId = async (userOwnId) => {
    const userData = await getUserByOwnId(userOwnId);
    if (userData) {
        console.log("아이디 중복 / 사용 불가");
        return false;
    }
    console.log("아이디 중복 아님 / 사용 가능")
    return true;
};

export const modifyUserInfo = async (userId, data) => {
    const allowedFields = ["nickname", "email", "password", "gender", "birth", "recomsTime", "bio"];

    const user = await getUserById(userId);
    if (!user) {
        throw new NoUserError("존재하지 않는 사용자 ID입니다.");
    }

    const updates = {};
    
    if ('password' in data && data.password !== "") {
        updates.password = await bcrypt.hash(data.password, 10);
    }

    for (const field of allowedFields) {
    const value = data[field];
    if (value !== undefined && value !== "") {
        updates[field] = value;
    }
}

    // 시간 형식 검사: HHmm
    if (updates.recomsTime) {
        const timeRegex = /^([01]\d|2[0-3])[0-5]\d$/;
        if (!timeRegex.test(updates.recomsTime)) {
            throw new InvalidRecomsTimeError("추천 시간은 HHmm 형식이어야 합니다.");
        }
    }

    /// 날짜 형식 검사: YYYY-MM-DD
    if (updates.birth !== undefined && 'birth' in updates ) {
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
        } else {
            delete updates.birth; 
        }
    }

    const isModified = Object.keys(updates).length > 0;
    if (!isModified) {
        throw new NoModifyDataError("수정할 데이터가 없습니다.");
    }

    const updatedUser = await modifyUser(user.id, updates);

    return { userId: updatedUser.id };
};

export const viewNotification = async (userId, cursor) => {
    let decoded = null;
    if (cursor) {
        try {
            decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
        } catch (err) {
            throw new CursorError("커서가 잘못되었습니다.");
        }
    }

    const limit = 20;
    let data = await getNotification(userId, decoded, limit);
    if (!data) {
        throw new AuthError("접근 권한이 없습니다. 본인의 토큰이 아닙니다.");
    }
    let hasNext = false;
    let nextCursor = null;
    if (data.length > limit) {
        hasNext = true;
        data = data.slice(0, limit);
        const nextCursorData = {
            createdAt: data[limit - 1].createdAt,
            id: data[limit - 1].id,
        };
        nextCursor = Buffer.from(JSON.stringify(nextCursorData)).toString("base64");
    }
    return notificationResponseDTO(data, hasNext, nextCursor);
};

export const viewMyPage = async (userId, ownId) => {
    const user = await getUserById(userId);
    const other = await getUserByOwnId(ownId);

    if (!other) {
        throw new NotFoundOwnIdError("존재하지 않는 사용자입니다.");
    }

    if (user.ownId === other.ownId) {
        return getMyPageResponseDTO(user);
    } else {
        return getMyPageResponseDTO(other);
    }
};

export const modifyMypage = async (userId, data) => {
    const allowedFields = ["photo", "backgroundImg"];

    const user = await getUserById(userId);
    if (!user) {
        throw new NoUserError("존재하지 않는 사용자 ID입니다.");
    }

    const normalize = (key, val) => {
        if (key === "photo" || key === "backgroundImg") return val === "" ? null : val;
        return val;
    };

    const updates = {};

    for (const field of allowedFields) {
        const value = normalize(field, data[field]);
        if (value !== undefined && value !== "") {
            updates[field] = value;
        }
    }

    const isValidUrl = (u) => {
        try {
            const url = new URL(u);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    };

    for (const key of ["photo", "backgroundImg"]) {
        if (updates[key] !== undefined && updates[key] !== null) {
            if (typeof updates[key] !== "string" || !isValidUrl(updates[key])) {
                throw new InvalidDateTypeError(`${key}는 http(s) URL 또는 null이어야 합니다.`);
            }
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new NoModifyDataError("수정할 데이터가 없습니다.");
    }

    const deleteKeys = [];

    for (const key of deleteKeys) {
        try {
            await deleteFromS3ByKey(key);
        } catch (e) {
            console.error("[S3:delete failed]", {
                key,
                msg: e?.message,
                code: e?.Code || e?.name,
                http: e?.$metadata?.httpStatusCode,
            });
        }
    }

    if ("photo" in updates) {
        const oldKey = extractS3KeyFromUrl(user.photo);

        if (updates.photo === null && oldKey) deleteKeys.push(oldKey);

        if (typeof updates.photo === "string" && updates.photo !== user.photo && oldKey) {
            deleteKeys.push(oldKey);
        }
    }

    if ("backgroundImg" in updates) {
        const oldKey = extractS3KeyFromUrl(user.backgroundImg);

        if (updates.backgroundImg === null && oldKey) deleteKeys.push(oldKey);
        if (typeof updates.backgroundImg === "string" && updates.backgroundImg !== user.backgroundImg && oldKey) {
            deleteKeys.push(oldKey);
        }
    }

    const updated = await modifyUser(user.id, updates);

    for (const key of deleteKeys) {
        try {
            await deleteFromS3ByKey(key);
        } catch (e) {
            console.error("[S3:delete failed]", {
                key,
                msg: e?.message,
                code: e?.Code || e?.name,
                http: e?.$metadata?.httpStatusCode,
            });
        }
    }

    return updated;
};

export const saveExpoToken = async (userId, token) => {
    if (!token) {
        throw new RequestBodyError("잘못된 Request body 형식입니다.");
    }
    const created = await createExpoToken(userId, token);
    return created;
};

export const setNotification = async (userId, body) => {
    const allowedKeys = ["recomsSent", "recomsReceived", "commentArrived", "notRecoms", "announcement"];

    for (const key in body) {
        if (!allowedKeys.includes(key) || typeof body[key] !== "boolean") {
            throw new RequestBodyError("유효하지 않은 request body 형식입니다.");
        }
    }
    const updated = await updateNotificationSetting(userId, body);
    return updated;
};

export const modifyNotification = async (userId, notificationId, body) => {
    if (
        !body?.type ||
        !["RECOMS_RECEIVED", "RECOMS_SENT", "COMMENT_ARRIVED", "NOT_RECOMS", "ANNOUNCEMENT"].includes(body?.type)
    ) {
        throw new RequestBodyError("유효하지 않은 request body 형식입니다.");
    }

    try {
        const updated =
            body.type === "ANNOUNCEMENT"
                ? await createUserAnnouncement(userId, notificationId)
                : await updateNotification(userId, notificationId);

        return isConfirmedResponseDTO(notificationId, updated);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                throw new NotFoundNotificationError("알림 ID가 잘못되었거나 이미 읽음 처리된 알림입니다.");
            }
        }

        throw err;
    }
};
