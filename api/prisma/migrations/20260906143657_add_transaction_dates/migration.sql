-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "draftedAt" TIMESTAMPTZ(6),
ADD COLUMN     "paidAt" TIMESTAMPTZ(6);
