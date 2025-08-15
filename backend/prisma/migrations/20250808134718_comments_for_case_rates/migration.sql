/*
  Warnings:

  - You are about to drop the column `comment` on the `Case` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "comment",
ADD COLUMN     "commentEnabled" BOOLEAN;

-- AlterTable
ALTER TABLE "Rate360" ADD COLUMN     "globalCommentsEnabled" BOOLEAN NOT NULL DEFAULT false;
