/*
  Warnings:

  - The values [man,woman] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [google,kakao] on the enum `SocialType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Inquiry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `Inquiry` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `background_image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `nickname` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - The primary key for the `UserLikedArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ArtistComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecommendSong` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecommendationReply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRecommendSong` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[own_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `UserLikedArtist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Inquiry` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Inquiry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Inquiry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Inquiry` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `content` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `receiver_id` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `own_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `social_type` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nickname` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inactive_status` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `artist_name` to the `UserLikedArtist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `UserLikedArtist` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `UserLikedArtist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `UserLikedArtist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artist_id` on table `UserLikedArtist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `UserLikedArtist` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('RECOMMEND_RECEIVED', 'RECOMMEND_SENT', 'RECOMMEND_UNREAD_TIMEOUT', 'RECOMMEND_READ_BY_OTHER', 'ANNOUNCEMENT');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MAN', 'WOMAN');
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SocialType_new" AS ENUM ('NAVER', 'KAKAO', 'GOOGLE');
ALTER TABLE "User" ALTER COLUMN "social_type" TYPE "SocialType_new" USING ("social_type"::text::"SocialType_new");
ALTER TYPE "SocialType" RENAME TO "SocialType_old";
ALTER TYPE "SocialType_new" RENAME TO "SocialType";
DROP TYPE "SocialType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ArtistComment" DROP CONSTRAINT "ArtistComment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ArtistComment" DROP CONSTRAINT "ArtistComment_user_liked_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_user_recommend_song_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_following_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RecommendationReply" DROP CONSTRAINT "RecommendationReply_responder_id_fkey";

-- DropForeignKey
ALTER TABLE "RecommendationReply" DROP CONSTRAINT "RecommendationReply_user_recommend_song_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLikedArtist" DROP CONSTRAINT "UserLikedArtist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendSong" DROP CONSTRAINT "UserRecommendSong_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendSong" DROP CONSTRAINT "UserRecommendSong_recommend_song_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendSong" DROP CONSTRAINT "UserRecommendSong_sender_id_fkey";

-- AlterTable
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_pkey",
DROP COLUMN "description",
ADD COLUMN     "content" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ADD CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Inquiry_id_seq";

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
DROP COLUMN "description",
DROP COLUMN "is_read",
DROP COLUMN "title",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "sender_id" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "NoticeType" NOT NULL,
ALTER COLUMN "reference_id" SET DATA TYPE TEXT,
ALTER COLUMN "receiver_id" SET NOT NULL,
ALTER COLUMN "receiver_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Notification_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "background_image",
DROP COLUMN "name",
DROP COLUMN "qr_code",
DROP COLUMN "tag",
ADD COLUMN     "background_img" TEXT,
ADD COLUMN     "own_id" TEXT NOT NULL,
ADD COLUMN     "recoms_time" TEXT NOT NULL DEFAULT '09:00',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "social_type" SET NOT NULL,
ALTER COLUMN "nickname" SET NOT NULL,
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "birth" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "gender" SET DEFAULT 'MAN',
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "inactive_status" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserLikedArtist" DROP CONSTRAINT "UserLikedArtist_pkey",
ADD COLUMN     "artist_name" TEXT NOT NULL,
ADD COLUMN     "img_url" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "artist_id" SET NOT NULL,
ALTER COLUMN "artist_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserLikedArtist_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserLikedArtist_id_seq";

-- DropTable
DROP TABLE "ArtistComment";

-- DropTable
DROP TABLE "Bookmark";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Follow";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "RecommendSong";

-- DropTable
DROP TABLE "RecommendationReply";

-- DropTable
DROP TABLE "Sing";

-- DropTable
DROP TABLE "UserRecommendSong";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateTable
CREATE TABLE "RecomsSong" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "artist_name" TEXT NOT NULL,
    "img_url" TEXT,

    CONSTRAINT "RecomsSong_pkey" PRIMARY KEY ("id")
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
    "receiver_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_anoymous" BOOLEAN NOT NULL DEFAULT false,
    "is_liked" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,

    CONSTRAINT "UserRecomsSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FcmToken" (
    "id" TEXT NOT NULL,
    "fcm_token" VARCHAR(512) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecomsSong_id_key" ON "RecomsSong"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RecomsReply_id_key" ON "RecomsReply"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecomsSong_id_key" ON "UserRecomsSong"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_id_key" ON "FcmToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_id_key" ON "Inquiry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_own_id_key" ON "User"("own_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikedArtist_id_key" ON "UserLikedArtist"("id");

-- AddForeignKey
ALTER TABLE "UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomsReply" ADD CONSTRAINT "RecomsReply_user_recoms_song_id_fkey" FOREIGN KEY ("user_recoms_song_id") REFERENCES "UserRecomsSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomsReply" ADD CONSTRAINT "RecomsReply_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_recoms_song_id_fkey" FOREIGN KEY ("recoms_song_id") REFERENCES "RecomsSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecomsSong" ADD CONSTRAINT "UserRecomsSong_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
