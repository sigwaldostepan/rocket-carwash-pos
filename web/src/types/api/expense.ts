export type Expense = {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type ExpenseCategoryWithExpenseCount = ExpenseCategory & {
  expenseCount: number;
};

export type ExpenseWithCategory = Expense & {
  expenseCategory: {
    id: string;
    name: string;
  };
};
