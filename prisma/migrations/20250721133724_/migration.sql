/*
  Warnings:

  - You are about to drop the column `artist_name` on the `UserLikedArtist` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `UserLikedArtist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserLikedArtist" DROP COLUMN "artist_name",
DROP COLUMN "img_url";

-- CreateTable
CREATE TABLE "Sing" (
    "id" TEXT NOT NULL,
    "recoms_song_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,

    CONSTRAINT "Sing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "img_url" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sing_id_key" ON "Sing"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_id_key" ON "Artist"("id");

-- AddForeignKey
ALTER TABLE "UserLikedArtist" ADD CONSTRAINT "UserLikedArtist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sing" ADD CONSTRAINT "Sing_recoms_song_id_fkey" FOREIGN KEY ("recoms_song_id") REFERENCES "RecomsSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sing" ADD CONSTRAINT "Sing_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
