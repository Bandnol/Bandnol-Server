-- AlterTable
ALTER TABLE "UserLikedArtist" ADD COLUMN     "inactive_at" TIMESTAMP(3),
ADD COLUMN     "inactive_status" BOOLEAN NOT NULL DEFAULT false;
