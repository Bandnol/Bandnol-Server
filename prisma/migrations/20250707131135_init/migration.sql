-- CreateEnum
CREATE TYPE "SocialType" AS ENUM ('google', 'kakao');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('man', 'woman');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RECOMMEND_RECEIVED', 'REPLY_RECEIVED', 'POST_REACTION', 'COMMUNITY_REACTION', 'PERMISSION_UPDATE', 'RECOMMEND_NOT_SENT', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "social_type" "SocialType",
    "name" TEXT,
    "nickname" TEXT,
    "birth" TIMESTAMP(3),
    "gender" "Gender",
    "photo" TEXT,
    "bio" TEXT,
    "tag" TEXT,
    "qr_code" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "inactive_at" TIMESTAMP(3),
    "inactive_status" BOOLEAN DEFAULT false,
    "like_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLikedArtist" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "artist_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "UserLikedArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT,
    "description" TEXT,
    "updated_at" TIMESTAMP(3),
    "user_recommend_song_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sing" (
    "id" SERIAL NOT NULL,
    "song_id" INTEGER,

    CONSTRAINT "Sing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendSong" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "RecommendSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "type" "NotificationType",
    "reference_id" INTEGER NOT NULL,
    "receiver_id" INTEGER,
    "is_read" BOOLEAN,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationReply" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_recommend_song_id" INTEGER NOT NULL,
    "responder_id" INTEGER,

    CONSTRAINT "RecommendationReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecommendSong" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER,
    "recommend_song_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "is_anoymous" BOOLEAN,
    "is_using_AI" BOOLEAN,
    "receiver_id" INTEGER,

    CONSTRAINT "UserRecommendSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER,
    "following_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "media_urls" TEXT[],
    "like" INTEGER,
    "is_editied" BOOLEAN,
    "visibility" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_liked_artist_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "ArtistComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_recommend_song_id_fkey" FOREIGN KEY ("user_recommend_song_id") REFERENCES "UserRecommendSong"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationReply" ADD CONSTRAINT "RecommendationReply_user_recommend_song_id_fkey" FOREIGN KEY ("user_recommend_song_id") REFERENCES "UserRecommendSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationReply" ADD CONSTRAINT "RecommendationReply_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendSong" ADD CONSTRAINT "UserRecommendSong_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendSong" ADD CONSTRAINT "UserRecommendSong_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendSong" ADD CONSTRAINT "UserRecommendSong_recommend_song_id_fkey" FOREIGN KEY ("recommend_song_id") REFERENCES "RecommendSong"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistComment" ADD CONSTRAINT "ArtistComment_user_liked_artist_id_fkey" FOREIGN KEY ("user_liked_artist_id") REFERENCES "UserLikedArtist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistComment" ADD CONSTRAINT "ArtistComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
