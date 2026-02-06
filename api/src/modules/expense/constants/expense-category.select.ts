import { Prisma } from 'generated/prisma/client';

export const EXPENSE_CATEGORY_BASE_SELECT: Prisma.ExpenseCategorySelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
};

export const EXPENSE_CATEGORY_SELECT_WITH_EXPENSE_COUNT: Prisma.ExpenseCategorySelect = {
  ...EXPENSE_CATEGORY_BASE_SELECT,
  _count: {
    select: {
      expense: true,
    },
  },
};
