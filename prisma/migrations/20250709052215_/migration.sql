/*
  Warnings:

  - You are about to drop the column `like_count` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `UserRecommendSong` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "like_count";

-- AlterTable
ALTER TABLE "UserRecommendSong" DROP COLUMN "category",
ADD COLUMN     "is_liked" BOOLEAN;
