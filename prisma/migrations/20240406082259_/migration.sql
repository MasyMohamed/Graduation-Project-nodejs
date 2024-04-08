/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Address` table. All the data in the column will be lost.
  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Cart` table. All the data in the column will be lost.
  - The primary key for the `CartItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CartItem` table. All the data in the column will be lost.
  - The primary key for the `Delivery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Delivery` table. All the data in the column will be lost.
  - The primary key for the `DeliveryPartner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DeliveryPartner` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OrderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderItems` table. All the data in the column will be lost.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Payment` table. All the data in the column will be lost.
  - The primary key for the `ProductManager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductManager` table. All the data in the column will be lost.
  - The primary key for the `Recommendation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Recommendation` table. All the data in the column will be lost.
  - The primary key for the `Shipping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Shipping` table. All the data in the column will be lost.
  - The primary key for the `SkinProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SkinProfile` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryPartner" DROP CONSTRAINT "DeliveryPartner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SkinProfile" DROP CONSTRAINT "SkinProfile_user_id_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "id",
ADD COLUMN     "addressId" SERIAL NOT NULL,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId");

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "id",
ADD COLUMN     "adminId" SERIAL NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId");

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "id",
ADD COLUMN     "cartId" SERIAL NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartId");

-- AlterTable
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "ItemId" SERIAL NOT NULL,
ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY ("ItemId");

-- AlterTable
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_pkey",
DROP COLUMN "id",
ADD COLUMN     "deliveryId" SERIAL NOT NULL,
ADD CONSTRAINT "Delivery_pkey" PRIMARY KEY ("deliveryId");

-- AlterTable
ALTER TABLE "DeliveryPartner" DROP CONSTRAINT "DeliveryPartner_pkey",
DROP COLUMN "id",
ADD COLUMN     "deliveryPartnerId" SERIAL NOT NULL,
ADD CONSTRAINT "DeliveryPartner_pkey" PRIMARY KEY ("deliveryPartnerId");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "id",
ADD COLUMN     "orderId" SERIAL NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId");

-- AlterTable
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_pkey",
DROP COLUMN "id",
ADD COLUMN     "ItemId" SERIAL NOT NULL,
ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("ItemId");

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
DROP COLUMN "id",
ADD COLUMN     "paymentId" SERIAL NOT NULL,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId");

-- AlterTable
ALTER TABLE "ProductManager" DROP CONSTRAINT "ProductManager_pkey",
DROP COLUMN "id",
ADD COLUMN     "productMangerId" SERIAL NOT NULL,
ADD CONSTRAINT "ProductManager_pkey" PRIMARY KEY ("productMangerId");

-- AlterTable
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_pkey",
DROP COLUMN "id",
ADD COLUMN     "recommendationId" SERIAL NOT NULL,
ADD CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("recommendationId");

-- AlterTable
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_pkey",
DROP COLUMN "id",
ADD COLUMN     "shippingId" SERIAL NOT NULL,
ADD CONSTRAINT "Shipping_pkey" PRIMARY KEY ("shippingId");

-- AlterTable
ALTER TABLE "SkinProfile" DROP CONSTRAINT "SkinProfile_pkey",
DROP COLUMN "id",
ADD COLUMN     "profileId" SERIAL NOT NULL,
ADD CONSTRAINT "SkinProfile_pkey" PRIMARY KEY ("profileId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinProfile" ADD CONSTRAINT "SkinProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeliveryPartner" ADD CONSTRAINT "DeliveryPartner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
