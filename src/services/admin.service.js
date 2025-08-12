import { RequestBodyError } from "../errors.js";
import { createAdminNotification } from "../repositories/admin.repository.js";
import { getAllowedAnnouncement, getExpoTokens } from "../repositories/users.repository.js";
import { sendPushNotification } from "../utils/expo.push.token.js";

export const adminSendNotifications = async (body) => {
    if (!body?.content || !body?.pushTitle || !body?.pushContent) {
        throw new RequestBodyError("유효하지 않은 request body 형식입니다.");
    }
    const content = body.content.trim();
    if (content.length > 1024) {
        throw new RequestBodyError("공지 내용은 1024자 이하로 입력해주세요.");
    }

    const notification = await createAdminNotification(content);
    const users = await getAllowedAnnouncement();

    const userIds = users.map((u) => u.userId);
    if (!userIds) {
        return notification;
    }

    const tokens = await getExpoTokens(userIds);
    const tokenList = tokens.map((t) => t.token);
    await sendPushNotification(tokenList, body.pushTitle, body.pushContent);
    return notification;
};
