-- CreateEnum
CREATE TYPE "ExpenseCategoryStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "expense_category" ADD COLUMN     "status" "ExpenseCategoryStatus" NOT NULL DEFAULT 'active';
