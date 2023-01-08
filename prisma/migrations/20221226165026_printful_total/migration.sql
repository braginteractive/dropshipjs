/*
  Warnings:

  - Added the required column `printfulTotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `printfulId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "printfulTotal" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "printfulId" SET NOT NULL;
