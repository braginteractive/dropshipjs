/*
  Warnings:

  - Added the required column `shipping` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipping" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "tax" DECIMAL(65,30) NOT NULL;
