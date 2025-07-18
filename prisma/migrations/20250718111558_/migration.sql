/*
  Warnings:

  - A unique constraint covering the columns `[user_recoms_song_id]` on the table `RecomsReply` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserRecomsSong" DROP CONSTRAINT "UserRecomsSong_receiver_id_fkey";

-- AlterTable
ALTER TABLE "UserRecomsSong" ALTER COLUMN "receiver_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecomsReply_user_recoms_song_id_key" ON "RecomsReply"("user_recoms_song_id");

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
