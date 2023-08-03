-- CreateTable
CREATE TABLE "ClubNews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "clubId" TEXT NOT NULL,
    "clubUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubNewsImageUrls" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clubNewsId" TEXT NOT NULL,

    CONSTRAINT "ClubNewsImageUrls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClubNews" ADD CONSTRAINT "ClubNews_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubNews" ADD CONSTRAINT "ClubNews_clubUserId_fkey" FOREIGN KEY ("clubUserId") REFERENCES "ClubUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubNewsImageUrls" ADD CONSTRAINT "ClubNewsImageUrls_clubNewsId_fkey" FOREIGN KEY ("clubNewsId") REFERENCES "ClubNews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
