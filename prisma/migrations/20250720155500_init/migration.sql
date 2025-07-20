-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MAN', 'WOMAN');

-- CreateEnum
CREATE TYPE "SocialType" AS ENUM ('NAVER', 'KAKAO', 'GOOGLE');

-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('RECOMS_RECEIVED', 'RECOMS_SENT', 'COMMENT_ARRIVED', 'NOT_RECOMS', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "UserLikedArtist" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "artist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "inactive_at" TIMESTAMP(3),
    "inactive_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserLikedArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomsSong" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "artist_name" TEXT NOT NULL,
    "img_url" TEXT,
    "preview_url" TEXT,

    CONSTRAINT "RecomsSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reference_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "sender_id" TEXT,
    "type" "NoticeType" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomsReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_recoms_song_id" TEXT NOT NULL,
    "responder_id" TEXT NOT NULL,

    CONSTRAINT "RecomsReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecomsSong" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recoms_song_id" TEXT NOT NULL,
    "receiver_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_anoymous" BOOLEAN NOT NULL DEFAULT false,
    "is_liked" BOOLEAN,
    "comment" TEXT NOT NULL,

    CONSTRAINT "UserRecomsSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "social_type" "SocialType" NOT NULL,
    "nickname" VARCHAR(40),
    "birth" TIMESTAMP(3),
    "gender" "Gender" DEFAULT 'MAN',
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FcmToken" (
    "id" TEXT NOT NULL,
    "fcm_token" VARCHAR(512) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "UserLikedArtist_id_key" ON "UserLikedArtist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_id_key" ON "Inquiry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RecomsSong_id_key" ON "RecomsSong"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RecomsReply_id_key" ON "RecomsReply"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RecomsReply_user_recoms_song_id_key" ON "RecomsReply"("user_recoms_song_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecomsSong_id_key" ON "UserRecomsSong"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_own_id_key" ON "User"("own_id");

-- CreateIndex
CREATE INDEX "User_is_delivered_recoms_time_idx" ON "User"("is_delivered", "recoms_time");

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_id_key" ON "FcmToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_sid_key" ON "session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_id_key" ON "NotificationType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationType_user_id_key" ON "NotificationType"("user_id");

-- AddForeignKey
ALTER TABLE "UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomsReply" ADD CONSTRAINT "RecomsReply_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomsReply" ADD CONSTRAINT "RecomsReply_user_recoms_song_id_fkey" FOREIGN KEY ("user_recoms_song_id") REFERENCES "UserRecomsSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_recoms_song_id_fkey" FOREIGN KEY ("recoms_song_id") REFERENCES "RecomsSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationType" ADD CONSTRAINT "NotificationType_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
