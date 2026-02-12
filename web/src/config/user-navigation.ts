import {
  ArrowDownLeft,
  BarChart3,
  Home,
  LucideIcon,
  ReceiptText,
  Tag,
  Users2,
} from "lucide-react";
import { paths } from "./paths";

export type NavItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: NavChildItem[];
};

export type NavChildItem = {
  key: string;
  title: string;
  path: string;
};

const home: NavItem = {
  key: "home",
  path: paths.app.home,
  icon: Home,
  title: "Beranda",
};

const transaction: NavItem = {
  key: "transaction",
  icon: ReceiptText,
  title: "Transaksi",
  children: [
    {
      key: "transaction-list",
      path: paths.app.transactions.index,
      title: "List transaksi",
    },
    {
      key: "transaction-create",
      path: paths.app.transactions.create,
      title: "Buat transaksi",
    },
  ],
};

const item: NavItem = {
  key: "item",
  path: paths.app.items,
  icon: Tag,
  title: "Item",
};

const customer: NavItem = {
  key: "customer",
  path: paths.app.customers,
  icon: Users2,
  title: "Pelanggan",
};

const expense: NavItem = {
  key: "expense",
  title: "Pengeluaran",
  icon: ArrowDownLeft,
  children: [
    {
      key: "expense-list",
      path: paths.app.expenses.index,
      title: "List pengeluaran",
    },
    {
      key: "expense-category",
      path: paths.app.expenses.category,
      title: "Kategori pengeluaran",
    },
  ],
};

const reportIncome: NavChildItem = {
  key: "report-income",
  path: paths.app.reports.income,
  title: "Pemasukan",
};

const reportExpense: NavChildItem = {
  key: "report-expense",
  path: paths.app.reports.expense,
  title: "Pengeluaran",
};

const report = (children: NavChildItem[]): NavItem => ({
  key: "report",
  title: "Laporan",
  icon: BarChart3,
  children,
});

type UserRole = "cashier" | "owner";

const navigationsByRole: Record<UserRole, NavItem[]> = {
  cashier: [home, transaction, item, customer, report([reportIncome])],
  owner: [
    home,
    transaction,
    item,
    customer,
    expense,
    report([reportExpense, reportIncome]),
  ],
};

export function getNavigationsByRole(role: UserRole): NavItem[] {
  return navigationsByRole[role];
}

export const cashierNavigations = navigationsByRole.cashier;
export const ownerNavigations = navigationsByRole.owner;
