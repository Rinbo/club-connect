-- CreateEnum
CREATE TYPE "TeamActivityType" AS ENUM ('COMPETITION', 'SOCIAL', 'TRAINING');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "TeamActivity" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "type" "TeamActivityType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingTime" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "weekDay" "WeekDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClubUserToTeamActivity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClubUserToTeamActivity_AB_unique" ON "_ClubUserToTeamActivity"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubUserToTeamActivity_B_index" ON "_ClubUserToTeamActivity"("B");

-- AddForeignKey
ALTER TABLE "TeamActivity" ADD CONSTRAINT "TeamActivity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingTime" ADD CONSTRAINT "TrainingTime_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubUserToTeamActivity" ADD CONSTRAINT "_ClubUserToTeamActivity_A_fkey" FOREIGN KEY ("A") REFERENCES "ClubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubUserToTeamActivity" ADD CONSTRAINT "_ClubUserToTeamActivity_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
