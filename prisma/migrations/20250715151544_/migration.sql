/*
  Warnings:

  - The values [RECOMMEND_RECEIVED,RECOMMEND_SENT,RECOMMEND_UNREAD_TIMEOUT,RECOMMEND_READ_BY_OTHER] on the enum `NoticeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NoticeType_new" AS ENUM ('RECOMS_RECEIVED', 'RECOMS_SENT', 'COMMENT_ARRIVED', 'NOT_RECOMS', 'ANNOUNCEMENT');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NoticeType_new" USING ("type"::text::"NoticeType_new");
ALTER TYPE "NoticeType" RENAME TO "NoticeType_old";
ALTER TYPE "NoticeType_new" RENAME TO "NoticeType";
DROP TYPE "NoticeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "RecomsSong" ADD COLUMN     "preview_url" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gender" DROP NOT NULL;

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

-- AddForeignKey
ALTER TABLE "NotificationType" ADD CONSTRAINT "NotificationType_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
