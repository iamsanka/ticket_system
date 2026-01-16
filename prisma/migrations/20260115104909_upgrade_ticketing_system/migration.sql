/*
  Warnings:

  - You are about to drop the column `priceAdult` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `priceChild` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `adultQuantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `childQuantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `ticketUrl` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `adultLoungePrice` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adultStandardPrice` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childLoungePrice` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childStandardPrice` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tier` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('ADULT', 'CHILD');

-- CreateEnum
CREATE TYPE "TicketTier" AS ENUM ('LOUNGE', 'STANDARD');

-- DropIndex
DROP INDEX "Ticket_type_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "priceAdult",
DROP COLUMN "priceChild",
ADD COLUMN     "adultLoungePrice" INTEGER NOT NULL,
ADD COLUMN     "adultStandardPrice" INTEGER NOT NULL,
ADD COLUMN     "childLoungePrice" INTEGER NOT NULL,
ADD COLUMN     "childStandardPrice" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "adultQuantity",
DROP COLUMN "childQuantity",
DROP COLUMN "quantity",
DROP COLUMN "ticketUrl",
ADD COLUMN     "adultLounge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "adultStandard" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "childLounge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "childStandard" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "type",
ADD COLUMN     "category" "TicketCategory" NOT NULL,
ADD COLUMN     "tier" "TicketTier" NOT NULL;

-- CreateIndex
CREATE INDEX "Ticket_category_idx" ON "Ticket"("category");

-- CreateIndex
CREATE INDEX "Ticket_tier_idx" ON "Ticket"("tier");
