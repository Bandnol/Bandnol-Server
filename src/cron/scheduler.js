import { sendAIRecoms, sendUserRecoms } from "../services/recoms.service.js";
import {
    getRecomsWithNoReceiver,
    getUserList,
    getSenderToday,
    updateIsDeliveredToFalse,
} from "../repositories/recoms.repository.js";
import cron from "node-cron";
import { SchedulerError } from "../errors.js";

export const songScheduler = async () => {
    cron.schedule("* * * * *", async () => {
        try {
            let min = new Date().getMinutes();
            console.log(`running a task every minute: ${min}`);
            const recomsList = await getRecomsWithNoReceiver();
            console.log("recomsList: ", recomsList);
            const userList = await getUserList();
            console.log("userList: ", userList);
            let i = 0;

            for (let user of userList) {
                const isSent = await getSenderToday(user.id);

                // 노래를 보내지 않았을 경우
                if (!isSent) {
                    console.log("노래를 추천하지 않았습니다: ", user.id);
                    continue;
                }

                if (!recomsList[i]) {
                    // 보낼 추천 곡이 없는 경우 - AI 생성
                    console.log("AI로 노래를 생성합니다.");
                    await sendAIRecoms(user.id);
                    console.log("AI 노래 생성 완료!");
                } else if (user.id === recomsList.senderId) {
                    // 본인이 보낸 추천 곡을 추천 받았을 경우
                    console.log("본인이 보낸 추천 곡을 추천 받았습니다.");
                    i++;
                    if (!recomsList[i]) {
                        console.log("다음 리스트가 없습니다. AI로 노래를 생성합니다.");
                        await sendAIRecoms(user.id);
                        console.log("AI 노래 생성 완료!");
                    } else {
                        console.log(`다음 리스트가 있습니다. ${i}번째: `, recomsList[i]);
                        await sendUserRecoms();
                        console.log("receiver 등록 완료!: ", user.id);
                        i++;
                    }
                } else {
                    // 보낼 추천 곡이 있고 sender가 본인이 아닌 경우
                    console.log(`다음 리스트가 있습니다. ${i}번째: `, recomsList[i]);
                    await sendUserRecoms(recomsList[i].id, user.id);
                    console.log("receiver 등록 완료!");
                    i++;
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
                const updated = await updateIsDeliveredToFalse();
                console.log("업데이트 된 행의 개수: ", updated);
                console.log(new Date());
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
