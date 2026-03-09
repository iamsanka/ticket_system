/*
  Warnings:

  - You are about to drop the `RandomRaffleConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RandomRaffleConfig";

-- CreateTable
CREATE TABLE "RandomRaffleResult" (
    "id" TEXT NOT NULL,
    "eventName" TEXT,
    "firstTicket" TEXT NOT NULL,
    "firstName" TEXT,
    "firstEmail" TEXT,
    "firstContact" TEXT,
    "secondTicket" TEXT NOT NULL,
    "secondName" TEXT,
    "secondEmail" TEXT,
    "secondContact" TEXT,
    "thirdTicket" TEXT NOT NULL,
    "thirdName" TEXT,
    "thirdEmail" TEXT,
    "thirdContact" TEXT,
    "usedDateRange" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RandomRaffleResult_pkey" PRIMARY KEY ("id")
);
