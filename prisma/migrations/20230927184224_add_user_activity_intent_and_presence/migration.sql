/*
  Warnings:

  - You are about to drop the `_ClubUserToTeamActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Intent" AS ENUM ('ACCEPTED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "_ClubUserToTeamActivity" DROP CONSTRAINT "_ClubUserToTeamActivity_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClubUserToTeamActivity" DROP CONSTRAINT "_ClubUserToTeamActivity_B_fkey";

-- AlterTable
ALTER TABLE "TeamActivity" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_ClubUserToTeamActivity";

-- CreateTable
CREATE TABLE "UserActivityPresence" (
    "clubUserId" TEXT NOT NULL,
    "teamActivityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserActivityIntent" (
    "intentType" "Intent" NOT NULL,
    "clubUserId" TEXT NOT NULL,
    "teamActivityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserActivityPresence_clubUserId_teamActivityId_key" ON "UserActivityPresence"("clubUserId", "teamActivityId");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivityIntent_clubUserId_teamActivityId_key" ON "UserActivityIntent"("clubUserId", "teamActivityId");

-- AddForeignKey
ALTER TABLE "UserActivityPresence" ADD CONSTRAINT "UserActivityPresence_clubUserId_fkey" FOREIGN KEY ("clubUserId") REFERENCES "ClubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityPresence" ADD CONSTRAINT "UserActivityPresence_teamActivityId_fkey" FOREIGN KEY ("teamActivityId") REFERENCES "TeamActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityIntent" ADD CONSTRAINT "UserActivityIntent_clubUserId_fkey" FOREIGN KEY ("clubUserId") REFERENCES "ClubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityIntent" ADD CONSTRAINT "UserActivityIntent_teamActivityId_fkey" FOREIGN KEY ("teamActivityId") REFERENCES "TeamActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
