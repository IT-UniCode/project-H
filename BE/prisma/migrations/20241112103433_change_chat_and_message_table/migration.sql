/*
  Warnings:

  - Added the required column `firstUserName` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondUserName` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "firstUserName" TEXT NOT NULL,
ADD COLUMN     "secondUserName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "unread" BOOLEAN NOT NULL DEFAULT true;
