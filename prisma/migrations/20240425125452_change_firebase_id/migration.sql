/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_firebaseId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_firebaseId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_firebaseId_fkey";

-- DropForeignKey
ALTER TABLE "SkinProfile" DROP CONSTRAINT "SkinProfile_firebaseId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_firebaseId_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToUser" DROP CONSTRAINT "_AdminToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_DeliveryPartnerToUser" DROP CONSTRAINT "_DeliveryPartnerToUser_B_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "firebaseId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "firebaseId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "firebaseId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SkinProfile" ALTER COLUMN "firebaseId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "firebaseId" DROP DEFAULT,
ALTER COLUMN "firebaseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("firebaseId");
DROP SEQUENCE "User_firebaseId_seq";

-- AlterTable
ALTER TABLE "UserFavorite" ALTER COLUMN "firebaseId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_AdminToUser" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_DeliveryPartnerToUser" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_firebaseId_fkey" FOREIGN KEY ("firebaseId") REFERENCES "User"("firebaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinProfile" ADD CONSTRAINT "SkinProfile_firebaseId_fkey" FOREIGN KEY ("firebaseId") REFERENCES "User"("firebaseId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_firebaseId_fkey" FOREIGN KEY ("firebaseId") REFERENCES "User"("firebaseId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_firebaseId_fkey" FOREIGN KEY ("firebaseId") REFERENCES "User"("firebaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_firebaseId_fkey" FOREIGN KEY ("firebaseId") REFERENCES "User"("firebaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryPartnerToUser" ADD CONSTRAINT "_DeliveryPartnerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("firebaseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToUser" ADD CONSTRAINT "_AdminToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("firebaseId") ON DELETE CASCADE ON UPDATE CASCADE;
