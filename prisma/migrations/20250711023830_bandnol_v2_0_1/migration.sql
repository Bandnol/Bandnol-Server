-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "nickname" DROP NOT NULL,
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "birth" DROP NOT NULL,
ALTER COLUMN "own_id" DROP NOT NULL;
