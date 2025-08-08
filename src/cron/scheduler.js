import { sendAIRecoms, sendUserRecoms } from "../services/recoms.service.js";
import { updateIsDeliveredToFalse } from "../repositories/recoms.repository.js";
import { deleteUserLikedArtists } from "../repositories/artists.repository.js";
import cron from "node-cron";
import { SchedulerError } from "../errors.js";
import redisClient from "../utils/redis.js";

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
                    //console.log("노래를 추천하지 않았습니다: ", user.id);
                    continue;
                }

                const recoms = recomsList.find((r) => r.senderId !== user);
                if (recoms) {
                    // 보낼 추천 곡이 있는 경우 - 추천 곡 리스트에서 곡을 반환
                    await sendUserRecoms(recoms.id, user);
                    //console.log("receiver 등록 완료!");
                } else {
                    // 보낼 추천 곡이 없는 경우 - AI 생성
                    //console.log("AI로 노래를 생성합니다.");
                    await sendAIRecoms(user);
                    //console.log("AI 노래 생성 완료!");
                }

                // 알림 보내기 (구현 필요)
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
                        const result = await redisClient.sAdd("user:isDeliveredFalse", id);
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
