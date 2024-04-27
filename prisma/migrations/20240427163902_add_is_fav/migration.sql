-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isCart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFavourite" BOOLEAN NOT NULL DEFAULT false;
