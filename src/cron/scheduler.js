import { sendAIRecoms, sendUserRecoms } from "../services/recoms.service.js";
import { updateIsDeliveredToFalse, getIsReadFalse } from "../repositories/recoms.repository.js";
import { deleteUserLikedArtists } from "../repositories/artists.repository.js";
import { createNotifications, getAllowedNotifications, getExpoTokens } from "../repositories/users.repository.js";
import cron from "node-cron";
import { SchedulerError } from "../errors.js";
import redisClient from "../utils/redis.js";
import { sendPushNotification } from "../utils/expo.push.token.js";

export const songScheduler = async () => {
    cron.schedule("* * * * *", async () => {
        try {
            let recomsList = [];
            let keys = await redisClient.keys("*userRecomsSong*");
            //console.log(keys);

            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = await redisClient.get(key);
                    recomsList.push(JSON.parse(value));
                }
            }
            //console.log("recomsList: ", recomsList);

            let userList = await redisClient.sMembers("user:isDeliveredFalse");
            //console.log("userList: ", userList);

            for (let user of userList) {
                let isSent = await redisClient.get(`userRecomsSongData:user:${user}`);

                // 노래를 보내지 않았을 경우
                if (!isSent) {
                    continue;
                }

                let result;
                const recoms = recomsList.find((r) => r.senderId !== user);
                //console.log("recoms: ", recoms);
                if (recoms) {
                    // 보낼 추천 곡이 있는 경우 - 추천 곡 리스트에서 곡을 반환
                    result = await sendUserRecoms(recoms.id, user, recoms.senderId);
                    const idx = recomsList.findIndex((r) => r.id === recoms.id);
                    if (idx !== -1) {
                        recomsList.splice(idx, 1);
                    }
                    //console.log("receiver 등록 완료!");
                } else {
                    // 보낼 추천 곡이 없는 경우 - AI 생성
                    //console.log("AI로 노래를 생성합니다.");
                    result = await sendAIRecoms(user);
                    //console.log("AI 노래 생성 완료!");
                }

                // 푸시 알림 보내기
                const senderNotification = await getAllowedNotifications(result.senderId);
                console.log(senderNotification);
                if (senderNotification?.recomsSent) {
                    let tokens = await getExpoTokens(result.senderId);
                    let body = `내가 추천한 곡이 ${result.receiver.nickname} 님에게 전달됐어요.`;

                    await sendPushNotification(tokens, "추천곡이 전달됐어요!", body, {
                        link: "bandnol://music-recommend/sendRecommend",
                    });

                    // 알림 센터에 저장(link 정해지면 수정 필요)
                    let notification = createNotifications(
                        result.senderId,
                        result.receiverId,
                        "RECOMS_SENT",
                        "bandnol://music-recommend/sendRecommend"
                    );
                    console.log(notification);
                }

                const receiverNotification = await getAllowedNotifications(result.receiverId);
                console.log(receiverNotification);
                if (receiverNotification?.recomsReceived) {
                    let tokens = await getExpoTokens(result.receiverId);

                    await sendPushNotification(tokens, "띵동~ 오늘의 추천곡이 도착했어요!", `지금 바로 확인해보세요.`, {
                        link: "bandnol://music-recommend/receiveRecommend",
                    });

                    // link 정해지면 수정 필요
                    let notification = createNotifications(
                        result.receiverId,
                        null,
                        "RECOMS_RECEIVED",
                        "bandnol://music-recommend/receiveRecommend"
                    );
                    console.log(notification);
                }
            }
        } catch (err) {
            console.error(`songScheduler error: ${err}`);
            throw new SchedulerError("songScheduler - 추천 곡 자동 발신 과정에서 에러가 발생했습니다.");
        }
    });
};

export const resetIsDeliveredScheduler = async () => {
    cron.schedule(
        "0 0 * * *",
        async () => {
            try {
                await redisClient.del("user:isDeliveredFalse");

                const userIds = await updateIsDeliveredToFalse();

                if (userIds.length > 0) {
                    for (const id of userIds) {
                        await redisClient.sAdd("user:isDeliveredFalse", id);
                    }
                }
            } catch (err) {
                console.error(`resetIsDeliveredScheduler error: ${err}`);
                throw new SchedulerError(
                    "resetIsDeliveredScheduler - isDelivered 초기화 과정에서 에러가 발생했습니다."
                );
            }
        },
        {
            timezone: "Asia/Seoul",
        }
    );
};

export const deleteUserLikedArtistScheduler = async () => {
    // 자정마다 비활성화된지 7일이 지난 userLikedArtist 데이터를 삭제
    cron.schedule(
        "0 0 * * *",
        async () => {
            try {
                const deleted = await deleteUserLikedArtists();
                console.log("삭제된 행의 개수: ", deleted);
                console.log(new Date());
            } catch (err) {
                console.error(`deleteUserLikedArtistScheduler error: ${err}`);
                throw new SchedulerError("deleteUserLikedArtistScheduler - 데이터 삭제 과정에서 에러가 발생했습니다.");
            }
        },
        {
            timezone: "Asia/Seoul",
        }
    );
};

export const notReadScheduler = async () => {
    // receiver가 지정된지 3-4시간이 지나도 isRead가 false일 경우 알림을 발송
    cron.schedule(
        "0 * * * *",
        async () => {
            try {
                const isReadFalse = await getIsReadFalse();
                if (!isReadFalse?.length) return;

                const users = isReadFalse.map((item) => item.receiverId);

                const allowedNotifications = await getAllowedNotifications(users);
                const allowedMap = new Map(allowedNotifications.map((r) => [r.userId, r]));

                const isReadFalseMap = new Map();
                for (const item of isReadFalse) {
                    isReadFalseMap.set(item.receiverId, item);
                }

                for (const [userId, item] of isReadFalseMap.entries()) {
                    const allowed = allowedMap.get(userId);
                    if (!allowed || !allowed.notRecoms) continue;

                    const senderName = item?.sender?.nickname;
                    const title = "오늘의 추천곡을 확인해주세요.";
                    const body = `${senderName} 님이 애타게 기다리고 있어요 ㅜ.ㅜ`;
                    const link = "bandnol://music-recommend/receiveRecommend";

                    const tokens = await getExpoTokens(userId);
                    if (!tokens || tokens.length === 0) continue;

                    try {
                        await sendPushNotification(tokens, title, body, { link: link });
                    } catch (e) {
                        console.error(`[notReadScheduler] push fail user=${userId}`, e);
                        continue;
                    }

                    // 알림 테이블에 저장 - 링크 추후 수정 필요
                    try {
                        await createNotifications(userId, item?.sender?.id, "NOT_RECOMS", link);
                    } catch (e) {
                        console.error(`[notReadScheduler] createNotifications fail user=${userId}`, e);
                    }
                }
            } catch (err) {
                console.error(`[notReadScheduler] error: ${err?.message || err}`);
                throw new SchedulerError("notReadScheduler - 알림 발송 과정에서 에러가 발생했습니다.");
            }
        },
        {
            timezone: "Asia/Seoul",
        }
    );
};
