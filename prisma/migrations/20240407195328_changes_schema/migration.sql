/*
  Warnings:

  - The primary key for the `CartItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ItemId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `DeliveryPartner` table. All the data in the column will be lost.
  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryPartnerId` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryPartnerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productManagerId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DELIVERYPARTNER';

-- DropForeignKey
ALTER TABLE "DeliveryPartner" DROP CONSTRAINT "DeliveryPartner_user_id_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_pkey",
DROP COLUMN "ItemId",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "itemId" SERIAL NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY ("itemId");

-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "deliveryPartnerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DeliveryPartner" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD COLUMN     "deliveryPartnerId" INTEGER NOT NULL,
ADD COLUMN     "paymentId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productManagerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shipping" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OrderItems";

-- CreateTable
CREATE TABLE "OrderItem" (
    "itemId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "_DeliveryPartnerToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToProductManager" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminDeliveryPartner" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeliveryPartnerToUser_AB_unique" ON "_DeliveryPartnerToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DeliveryPartnerToUser_B_index" ON "_DeliveryPartnerToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToProductManager_AB_unique" ON "_AdminToProductManager"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToProductManager_B_index" ON "_AdminToProductManager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminDeliveryPartner_AB_unique" ON "_AdminDeliveryPartner"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminDeliveryPartner_B_index" ON "_AdminDeliveryPartner"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productManagerId_fkey" FOREIGN KEY ("productManagerId") REFERENCES "ProductManager"("productMangerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryPartnerToUser" ADD CONSTRAINT "_DeliveryPartnerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryPartnerToUser" ADD CONSTRAINT "_DeliveryPartnerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToProductManager" ADD CONSTRAINT "_AdminToProductManager_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("adminId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToProductManager" ADD CONSTRAINT "_AdminToProductManager_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductManager"("productMangerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminDeliveryPartner" ADD CONSTRAINT "_AdminDeliveryPartner_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("adminId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminDeliveryPartner" ADD CONSTRAINT "_AdminDeliveryPartner_B_fkey" FOREIGN KEY ("B") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE CASCADE ON UPDATE CASCADE;
