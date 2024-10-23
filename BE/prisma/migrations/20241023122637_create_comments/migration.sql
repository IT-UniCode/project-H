/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "createdAt",
ALTER COLUMN "entityId" SET DATA TYPE TEXT;
