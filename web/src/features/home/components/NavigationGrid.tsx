"use client";

import { paths } from "@/config/paths";
import { authClient } from "@/lib/auth";
import {
  ArrowDownLeft,
  BarChart3,
  PlusCircle,
  ReceiptText,
  Tag,
  Users2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { NavigationGridCard } from "./NavigationGridCard";

type NavigationItem = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
};

/**
 * Cashier Dashboard Grid
 *
 * Navigation items for cashier role, focusing on daily operations:
 * - Transaction processing
 * - Customer management
 * - Item/service management
 */
const cashierNavigations: NavigationItem[] = [
  {
    key: "create-transaction",
    title: "Buat Transaksi Baru",
    description: "Proses transaksi baru.",
    icon: PlusCircle,
    path: paths.app.transactions,
  },
  {
    key: "transaction-list",
    title: "Riwayat Transaksi",
    description: "Lihat daftar transaksi.",
    icon: ReceiptText,
    path: paths.app.transactions,
  },
  {
    key: "items",
    title: "Kelola Item",
    description: "Lihat layanan cuci mobil & produk lain.",
    icon: Tag,
    path: paths.app.items,
  },
  {
    key: "customers",
    title: "Data Pelanggan",
    description: "List pelanggan.",
    icon: Users2,
    path: paths.app.customers,
  },
];

/**
 * Owner Dashboard Grid
 *
 * Navigation items for owner role, includes all cashier menus plus:
 * - Financial reports
 * - Expense tracking
 * - Business analytics
 */
export const ownerNavigations: NavigationItem[] = [
  ...cashierNavigations,
  {
    key: "expense-entry",
    title: "Catat Pengeluaran",
    description: "Input transaksi pengeluaran harian.",
    icon: ArrowDownLeft,
    path: paths.app.expenses,
  },
  {
    key: "report",
    title: "Laporan",
    description: "Rekap omzet, profit, dan pengeluaran.",
    icon: BarChart3,
    path: paths.app.reports,
  },
];

export const NavigationGrid = () => {
  const { data } = authClient.useSession();
  const userRole = data?.user?.role as "owner" | "cashier" | undefined;

  if (!userRole) {
    return null;
  }

  const menus = userRole === "cashier" ? cashierNavigations : ownerNavigations;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {menus.map((item) => (
        <Link href={item.path} key={item.key} className="block h-full">
          <NavigationGridCard item={item} />
        </Link>
      ))}
    </div>
  );
};
