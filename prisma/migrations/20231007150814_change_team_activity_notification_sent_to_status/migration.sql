/*
  Warnings:

  - You are about to drop the column `notificationSent` on the `TeamActivity` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('NOT_SENT', 'PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "TeamActivity" DROP COLUMN "notificationSent",
ADD COLUMN     "notificationStatus" "NotificationStatus" NOT NULL DEFAULT 'NOT_SENT';
