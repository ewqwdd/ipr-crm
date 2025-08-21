/*
  Warnings:

  - You are about to drop the column `approvedByUser` on the `UserRates` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Rate360Type" ADD VALUE 'Case';

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_mentorId_fkey";

-- AlterTable
ALTER TABLE "Rate360" ADD COLUMN     "authorId" INTEGER,
ALTER COLUMN "specId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserComments" ALTER COLUMN "competencyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserRates" DROP COLUMN "approvedByUser",
ADD COLUMN     "caseId" INTEGER,
ADD COLUMN     "comment" TEXT,
ALTER COLUMN "indicatorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseVariant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caseId" INTEGER NOT NULL,

    CONSTRAINT "CaseVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaseToRate360" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CaseToRate360_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CaseToRate360_B_index" ON "_CaseToRate360"("B");

-- AddForeignKey
ALTER TABLE "Rate360" ADD CONSTRAINT "Rate360_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRates" ADD CONSTRAINT "UserRates_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseVariant" ADD CONSTRAINT "CaseVariant_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToRate360" ADD CONSTRAINT "_CaseToRate360_A_fkey" FOREIGN KEY ("A") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToRate360" ADD CONSTRAINT "_CaseToRate360_B_fkey" FOREIGN KEY ("B") REFERENCES "Rate360"("id") ON DELETE CASCADE ON UPDATE CASCADE;
