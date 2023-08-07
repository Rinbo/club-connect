/*
  Warnings:

  - You are about to drop the `ClubNewsImageUrls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClubNewsImageUrls" DROP CONSTRAINT "ClubNewsImageUrls_clubNewsId_fkey";

-- DropTable
DROP TABLE "ClubNewsImageUrls";

-- CreateTable
CREATE TABLE "ClubNewsImageUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clubNewsId" TEXT NOT NULL,

    CONSTRAINT "ClubNewsImageUrl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClubNewsImageUrl" ADD CONSTRAINT "ClubNewsImageUrl_clubNewsId_fkey" FOREIGN KEY ("clubNewsId") REFERENCES "ClubNews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
