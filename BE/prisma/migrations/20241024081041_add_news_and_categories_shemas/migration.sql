/*
  Warnings:

  - You are about to drop the column `entityId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `documentId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentType` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "entityId",
DROP COLUMN "entityType",
ADD COLUMN     "documentId" TEXT NOT NULL,
ADD COLUMN     "documentType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
