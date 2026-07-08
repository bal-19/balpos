-- CreateEnum
CREATE TYPE "KitchenItemStatus" AS ENUM ('NEW', 'PREPARING', 'READY');

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_cashierId_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "kitchenStatus" "KitchenItemStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "cashierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paymentUrl" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
