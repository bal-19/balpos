-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER_CREATED', 'ORDER_READY', 'LOW_STOCK');

-- AlterTable
ALTER TABLE "store_settings" ADD COLUMN     "receiptFooterNote" TEXT;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_outletId_isRead_createdAt_idx" ON "notifications"("outletId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "order_items_orderId_kitchenStatus_idx" ON "order_items"("orderId", "kitchenStatus");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
