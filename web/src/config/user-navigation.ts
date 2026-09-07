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
  path: string;
};

const home: NavItem = { key: "home", path: paths.app.home, icon: Home, title: "Beranda" };
const transaction: NavItem = { key: "transaction", path: paths.app.transactions, icon: ReceiptText, title: "Transaksi" };
const item: NavItem = { key: "item", path: paths.app.items, icon: Tag, title: "Item" };
const customer: NavItem = { key: "customer", path: paths.app.customers, icon: Users2, title: "Pelanggan" };
const expense: NavItem = { key: "expense", path: paths.app.expenses, icon: ArrowDownLeft, title: "Pengeluaran" };
const report: NavItem = { key: "report", path: paths.app.reports, icon: BarChart3, title: "Laporan" };

type UserRole = "cashier" | "owner";

const navigationsByRole: Record<UserRole, NavItem[]> = {
  cashier: [home, transaction, item, customer],
  owner: [home, transaction, item, customer, expense, report],
};

export function getNavigationsByRole(role: UserRole): NavItem[] {
  return navigationsByRole[role];
}

export const cashierNavigations = navigationsByRole.cashier;
export const ownerNavigations = navigationsByRole.owner;
