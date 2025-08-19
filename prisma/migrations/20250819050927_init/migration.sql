-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MAN', 'WOMAN');

-- CreateEnum
CREATE TYPE "notice_type" AS ENUM ('RECOMS_RECEIVED', 'RECOMS_SENT', 'COMMENT_ARRIVED', 'NOT_RECOMS', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "user_liked_artist" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
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
    "updated_at" TIMESTAMP(3),
    "content" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recoms_song" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "artist_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
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
    "updated_at" TIMESTAMP(3),
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
    "updated_at" TIMESTAMP(3),
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
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_recoms_song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "nickname" VARCHAR(40),
    "password" TEXT NOT NULL,
    "birth" TIMESTAMP(3),
    "gender" "gender" DEFAULT 'MAN',
    "photo" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "inactive_at" TIMESTAMP(3),
    "inactive_status" BOOLEAN NOT NULL DEFAULT false,
    "background_img" TEXT,
    "own_id" TEXT,
    "recoms_time" TEXT NOT NULL DEFAULT '0900',
    "email" TEXT NOT NULL,
    "is_delivered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expo_push_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expo_push_token_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "announcement" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_announcement" (
    "id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "announcement_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_announcement_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "idx_notification_receiver_created_id" ON "notification"("receiver_id", "created_at" DESC, "id" DESC);

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
CREATE UNIQUE INDEX "expo_push_token_id_key" ON "expo_push_token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_sid_key" ON "session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_id_key" ON "notification_type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_user_id_key" ON "notification_type"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_id_key" ON "announcement"("id");

-- CreateIndex
CREATE INDEX "idx_announcement_created_id" ON "announcement"("created_at" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_announcement_id_key" ON "user_announcement"("id");

-- CreateIndex
CREATE INDEX "idx_uas_announcement_user" ON "user_announcement"("announcement_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_liked_artist" ADD CONSTRAINT "user_liked_artist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_liked_artist" ADD CONSTRAINT "user_liked_artist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "expo_push_token" ADD CONSTRAINT "expo_push_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_type" ADD CONSTRAINT "notification_type_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_announcement" ADD CONSTRAINT "user_announcement_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_announcement" ADD CONSTRAINT "user_announcement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
