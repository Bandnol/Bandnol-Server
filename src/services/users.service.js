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
} from "../repositories/users.repository.js";
import { notificationResponseDTO, getMyPageResponseDTO, isConfirmedResponseDTO } from "../dtos/users.dto.js";
import { Prisma } from "@prisma/client";

export const checkOwnId = async (userOwnId) => {
    const userData = await getUserByOwnId(userOwnId);
    if (userData) {
        console.log("아이디 중복 / 사용 불가");
        return false;
    }
    console.log("아이디 중복 아님 / 사용 가능");
    return true;
};

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
        if (!timeRegex.test(updates.recomsTime)) {
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
    try {
        if (!["RECOMS_RECEIVED", "RECOMS_SENT", "COMMENT_ARRIVED", "NOT_RECOMS", "ANNOUNCEMENT"].includes(body?.type)) {
            throw new RequestBodyError("유효하지 않은 request body 형식입니다.");
        }

        let updated;
        if (body.type === "ANNOUNCEMENT") {
            updated = await createUserAnnouncement(userId, notificationId);
        } else {
            updated = await updateNotification(userId, notificationId);
        }

        return isConfirmedResponseDTO(notificationId, updated);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
                case "P2025":
                    throw new NotFoundNotificationError("알림 ID가 잘못되었거나 이미 읽음 처리된 알림입니다.");
            }
        }
    }
};
