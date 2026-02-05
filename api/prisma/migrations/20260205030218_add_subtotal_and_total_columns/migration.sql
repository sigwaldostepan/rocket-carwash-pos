-- AlterTable
ALTER TABLE "transaction" RENAME COLUMN "transTotal" TO "total",
ADD COLUMN     "subtotal" DECIMAL NOT NULL DEFAULT 0;
