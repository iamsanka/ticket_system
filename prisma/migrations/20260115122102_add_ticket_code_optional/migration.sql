-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "ticketSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "ticketCode" TEXT;
