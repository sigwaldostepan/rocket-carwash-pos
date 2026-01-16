/*
  Warnings:

  - Made the column `code` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `point` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customer" ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL,
ALTER COLUMN "point" SET NOT NULL,
ALTER COLUMN "point" SET DEFAULT 0;
