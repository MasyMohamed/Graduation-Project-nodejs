/*
  Warnings:

  - Added the required column `category_image_url` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "category_image_url" TEXT NOT NULL;
