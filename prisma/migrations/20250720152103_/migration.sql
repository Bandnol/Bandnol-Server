/*
  Warnings:

  - The values [RECOMMEND_RECEIVED,RECOMMEND_SENT,RECOMMEND_UNREAD_TIMEOUT,RECOMMEND_READ_BY_OTHER] on the enum `NoticeType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[user_recoms_song_id]` on the table `RecomsReply` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NoticeType_new" AS ENUM ('RECOMS_RECEIVED', 'RECOMS_SENT', 'COMMENT_ARRIVED', 'NOT_RECOMS', 'ANNOUNCEMENT');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NoticeType_new" USING ("type"::text::"NoticeType_new");
ALTER TYPE "NoticeType" RENAME TO "NoticeType_old";
ALTER TYPE "NoticeType_new" RENAME TO "NoticeType";
DROP TYPE "NoticeType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "UserRecomsSong" DROP CONSTRAINT "UserRecomsSong_receiver_id_fkey";

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RecomsSong" ADD COLUMN     "preview_url" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_delivered" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "recoms_time" SET DEFAULT '0900',
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserLikedArtist" ADD COLUMN     "inactive_at" TIMESTAMP(3),
ADD COLUMN     "inactive_status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserRecomsSong" ALTER COLUMN "receiver_id" DROP NOT NULL,
ALTER COLUMN "is_liked" DROP NOT NULL,
ALTER COLUMN "is_liked" DROP DEFAULT;

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "data" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "NotificationType" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recoms_received" BOOLEAN NOT NULL DEFAULT true,
    "recoms_sent" BOOLEAN NOT NULL DEFAULT true,
    "comment_arrived" BOOLEAN NOT NULL DEFAULT true,
    "not_recoms" BOOLEAN NOT NULL DEFAULT true,
    "announcement" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_id_key" ON "NotificationType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_user_id_key" ON "NotificationType"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "RecomsReply_user_recoms_song_id_key" ON "RecomsReply"("user_recoms_song_id");

-- CreateIndex
CREATE INDEX "User_is_delivered_recoms_time_idx" ON "User"("is_delivered", "recoms_time");

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationType" ADD CONSTRAINT "NotificationType_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
