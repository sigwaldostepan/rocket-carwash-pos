-- AlterTable
ALTER TABLE "transaction" RENAME COLUMN "transTotal" TO "total";
ALTER TABLE "transaction" ADD COLUMN "subtotal" DECIMAL NOT NULL DEFAULT 0;
