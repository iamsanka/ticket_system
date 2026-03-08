-- CreateTable
CREATE TABLE "ManualRaffleConfig" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "firstCode" TEXT,
    "secondCode" TEXT,
    "thirdCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualRaffleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RandomRaffleConfig" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RandomRaffleConfig_pkey" PRIMARY KEY ("id")
);
