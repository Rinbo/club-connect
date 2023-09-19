/*
  Warnings:

  - You are about to drop the `_ClubUserToTeamActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClubUserToTeamActivity" DROP CONSTRAINT "_ClubUserToTeamActivity_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClubUserToTeamActivity" DROP CONSTRAINT "_ClubUserToTeamActivity_B_fkey";

-- DropTable
DROP TABLE "_ClubUserToTeamActivity";

-- CreateTable
CREATE TABLE "_ClubUserToTeamActivityPresence" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClubUserToTeamActivityIntention" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClubUserToTeamActivityPresence_AB_unique" ON "_ClubUserToTeamActivityPresence"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubUserToTeamActivityPresence_B_index" ON "_ClubUserToTeamActivityPresence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClubUserToTeamActivityIntention_AB_unique" ON "_ClubUserToTeamActivityIntention"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubUserToTeamActivityIntention_B_index" ON "_ClubUserToTeamActivityIntention"("B");

-- AddForeignKey
ALTER TABLE "_ClubUserToTeamActivityPresence" ADD CONSTRAINT "_ClubUserToTeamActivityPresence_A_fkey" FOREIGN KEY ("A") REFERENCES "ClubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubUserToTeamActivityPresence" ADD CONSTRAINT "_ClubUserToTeamActivityPresence_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubUserToTeamActivityIntention" ADD CONSTRAINT "_ClubUserToTeamActivityIntention_A_fkey" FOREIGN KEY ("A") REFERENCES "ClubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubUserToTeamActivityIntention" ADD CONSTRAINT "_ClubUserToTeamActivityIntention_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
