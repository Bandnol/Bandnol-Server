/*
  Warnings:

  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FcmToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecomsReply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecomsSong` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLikedArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRecomsSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MAN', 'WOMAN');

-- CreateEnum
CREATE TYPE "social_type" AS ENUM ('NAVER', 'KAKAO', 'GOOGLE');

-- CreateEnum
CREATE TYPE "notice_type" AS ENUM ('RECOMS_RECEIVED', 'RECOMS_SENT', 'COMMENT_ARRIVED', 'NOT_RECOMS', 'ANNOUNCEMENT');

-- DropForeignKey
ALTER TABLE "FcmToken" DROP CONSTRAINT "FcmToken_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "NotificationType" DROP CONSTRAINT "NotificationType_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RecomsReply" DROP CONSTRAINT "RecomsReply_responder_id_fkey";

-- DropForeignKey
ALTER TABLE "RecomsReply" DROP CONSTRAINT "RecomsReply_user_recoms_song_id_fkey";

-- DropForeignKey
ALTER TABLE "Sing" DROP CONSTRAINT "Sing_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "Sing" DROP CONSTRAINT "Sing_recoms_song_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLikedArtist" DROP CONSTRAINT "UserLikedArtist_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLikedArtist" DROP CONSTRAINT "UserLikedArtist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRecomsSong" DROP CONSTRAINT "UserRecomsSong_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRecomsSong" DROP CONSTRAINT "UserRecomsSong_recoms_song_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRecomsSong" DROP CONSTRAINT "UserRecomsSong_sender_id_fkey";

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "FcmToken";

-- DropTable
DROP TABLE "Inquiry";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "NotificationType";

-- DropTable
DROP TABLE "RecomsReply";

-- DropTable
DROP TABLE "RecomsSong";

-- DropTable
DROP TABLE "Sing";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserLikedArtist";

-- DropTable
DROP TABLE "UserRecomsSong";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "NoticeType";

-- DropEnum
DROP TYPE "SocialType";

-- CreateTable
CREATE TABLE "user_liked_artist" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "artist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "inactive_at" TIMESTAMP(3),
    "inactive_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_liked_artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recoms_song" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "artist_name" TEXT NOT NULL,
    "img_url" TEXT,
    "preview_url" TEXT,

    CONSTRAINT "recoms_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sing" (
    "id" TEXT NOT NULL,
    "recoms_song_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,

    CONSTRAINT "sing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "img_url" TEXT,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "sender_id" TEXT,
    "type" "notice_type" NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recoms_reply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_recoms_song_id" TEXT NOT NULL,
    "responder_id" TEXT NOT NULL,

    CONSTRAINT "recoms_reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_recoms_song" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recoms_song_id" TEXT NOT NULL,
    "receiver_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_anoymous" BOOLEAN NOT NULL DEFAULT false,
    "is_liked" BOOLEAN,
    "comment" TEXT NOT NULL,

    CONSTRAINT "user_recoms_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "social_type" "social_type" NOT NULL,
    "nickname" VARCHAR(40),
    "birth" TIMESTAMP(3),
    "gender" "gender" DEFAULT 'MAN',
    "photo" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "inactive_at" TIMESTAMP(3),
    "inactive_status" BOOLEAN NOT NULL DEFAULT false,
    "background_img" TEXT,
    "own_id" TEXT,
    "recoms_time" TEXT NOT NULL DEFAULT '0900',
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_delivered" BOOLEAN NOT NULL DEFAULT false,
    "refresh_token" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fcm_token" (
    "id" TEXT NOT NULL,
    "fcm_token" VARCHAR(512) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fcm_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_type" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recoms_received" BOOLEAN NOT NULL DEFAULT true,
    "recoms_sent" BOOLEAN NOT NULL DEFAULT true,
    "comment_arrived" BOOLEAN NOT NULL DEFAULT true,
    "not_recoms" BOOLEAN NOT NULL DEFAULT true,
    "announcement" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "notification_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_liked_artist_id_key" ON "user_liked_artist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_id_key" ON "inquiry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recoms_song_id_key" ON "recoms_song"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sing_id_key" ON "sing"("id");

-- CreateIndex
CREATE UNIQUE INDEX "artist_id_key" ON "artist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_id_key" ON "notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recoms_reply_id_key" ON "recoms_reply"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recoms_reply_user_recoms_song_id_key" ON "recoms_reply"("user_recoms_song_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_recoms_song_id_key" ON "user_recoms_song"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_own_id_key" ON "user"("own_id");

-- CreateIndex
CREATE INDEX "user_is_delivered_recoms_time_idx" ON "user"("is_delivered", "recoms_time");

-- CreateIndex
CREATE UNIQUE INDEX "fcm_token_id_key" ON "fcm_token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_id_key" ON "notification_type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_user_id_key" ON "notification_type"("user_id");

-- AddForeignKey
ALTER TABLE "user_liked_artist" ADD CONSTRAINT "user_liked_artist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_liked_artist" ADD CONSTRAINT "user_liked_artist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sing" ADD CONSTRAINT "sing_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sing" ADD CONSTRAINT "sing_recoms_song_id_fkey" FOREIGN KEY ("recoms_song_id") REFERENCES "recoms_song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recoms_reply" ADD CONSTRAINT "recoms_reply_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recoms_reply" ADD CONSTRAINT "recoms_reply_user_recoms_song_id_fkey" FOREIGN KEY ("user_recoms_song_id") REFERENCES "user_recoms_song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_recoms_song" ADD CONSTRAINT "user_recoms_song_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_recoms_song" ADD CONSTRAINT "user_recoms_song_recoms_song_id_fkey" FOREIGN KEY ("recoms_song_id") REFERENCES "recoms_song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_recoms_song" ADD CONSTRAINT "user_recoms_song_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fcm_token" ADD CONSTRAINT "fcm_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_type" ADD CONSTRAINT "notification_type_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
