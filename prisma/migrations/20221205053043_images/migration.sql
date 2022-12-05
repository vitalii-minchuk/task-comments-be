/*
  Warnings:

  - Added the required column `image_url` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
