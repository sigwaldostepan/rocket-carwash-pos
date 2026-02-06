import { Prisma } from 'generated/prisma/client';

export const EXPENSE_BASE_SELECT: Prisma.ExpenseSelect = {
  id: true,
  amount: true,
  createdAt: true,
  description: true,
};

export const EXPENSE_SELECT_WITH_CATEGORY: Prisma.ExpenseSelect = {
  ...EXPENSE_BASE_SELECT,
  expenseCategory: {
    select: {
      id: true,
      name: true,
    },
  },
};
