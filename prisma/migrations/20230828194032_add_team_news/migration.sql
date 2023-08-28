-- CreateTable
CREATE TABLE "TeamNews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "clubUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamNewsImageUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "teamNewsId" TEXT NOT NULL,

    CONSTRAINT "TeamNewsImageUrl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamNews" ADD CONSTRAINT "TeamNews_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamNews" ADD CONSTRAINT "TeamNews_clubUserId_fkey" FOREIGN KEY ("clubUserId") REFERENCES "ClubUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamNewsImageUrl" ADD CONSTRAINT "TeamNewsImageUrl_teamNewsId_fkey" FOREIGN KEY ("teamNewsId") REFERENCES "TeamNews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
