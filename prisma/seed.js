// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.userRecomsSong.createMany({
        data: [
            {
                senderId: "ec676673-04a0-4cf8-9133-93d52aef45ea",
                recomsSongId: "1440857781", // 실제 존재하는 곡 ID로 바꿔주세요
                isAnoymous: false,
                comment: "temp 레코드 1",
            },
            {
                senderId: "43ca623c-e19a-4cc4-a4ca-aa5a66749756",
                recomsSongId: "1568111757", // 실제 존재하는 곡 ID로 바꿔주세요
                isAnoymous: false,
                comment: "temp 레코드 2",
            },
        ],
    });

    console.log("✅ 두 개의 userRecomsSong 레코드가 삽입되었습니다.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
