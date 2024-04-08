/*
  Warnings:

  - You are about to drop the column `deliveryPartnerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Delivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminDeliveryPartner` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deliveryPartnerId` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_deliveryPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "_AdminDeliveryPartner" DROP CONSTRAINT "_AdminDeliveryPartner_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminDeliveryPartner" DROP CONSTRAINT "_AdminDeliveryPartner_B_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "orderId" INTEGER;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryPartnerId";

-- AlterTable
ALTER TABLE "Shipping" ADD COLUMN     "deliveryPartnerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Delivery";

-- DropTable
DROP TABLE "Recommendation";

-- DropTable
DROP TABLE "_AdminDeliveryPartner";

-- CreateTable
CREATE TABLE "_RecommendedProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToDeliveryPartner" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RecommendedProducts_AB_unique" ON "_RecommendedProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_RecommendedProducts_B_index" ON "_RecommendedProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToDeliveryPartner_AB_unique" ON "_AdminToDeliveryPartner"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToDeliveryPartner_B_index" ON "_AdminToDeliveryPartner"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToUser_AB_unique" ON "_AdminToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToUser_B_index" ON "_AdminToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_orderId_key" ON "Cart"("orderId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecommendedProducts" ADD CONSTRAINT "_RecommendedProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecommendedProducts" ADD CONSTRAINT "_RecommendedProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "SkinProfile"("profileId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToDeliveryPartner" ADD CONSTRAINT "_AdminToDeliveryPartner_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("adminId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToDeliveryPartner" ADD CONSTRAINT "_AdminToDeliveryPartner_B_fkey" FOREIGN KEY ("B") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToUser" ADD CONSTRAINT "_AdminToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("adminId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToUser" ADD CONSTRAINT "_AdminToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
