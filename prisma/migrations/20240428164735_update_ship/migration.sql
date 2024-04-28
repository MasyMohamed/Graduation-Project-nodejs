-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_deliveryPartnerId_fkey";

-- AlterTable
ALTER TABLE "Shipping" ALTER COLUMN "deliveryPartnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE SET NULL ON UPDATE CASCADE;
