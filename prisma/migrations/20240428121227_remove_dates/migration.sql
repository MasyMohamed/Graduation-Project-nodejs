/*
  Warnings:

  - You are about to drop the column `actualDate` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `estimateDate` on the `Shipping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "actualDate",
DROP COLUMN "estimateDate";
