"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { authClient } from "@/lib/auth";
import {
  ArrowDownLeft,
  BarChart3,
  Home,
  LucideIcon,
  ReceiptText,
  Tag,
  Users2,
} from "lucide-react";
import Image from "next/image";
import { MainSidebarItem } from "./MainSidebarItem";

type NavItem = {
  key: string;
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: {
    key: string;
    title: string;
    path: string;
  }[];
};

const cashierNavigations = [
  {
    key: "cashier-home",
    path: paths.app.home,
    icon: Home,
    title: "Beranda",
  },
  {
    key: "cashier-transaction",
    icon: ReceiptText,
    title: "Transaksi",
    children: [
      {
        key: "cashier-transaction-list",
        path: paths.app.transactions.index,
        title: "List transaksi",
      },
      {
        key: "cashier-transaction-create",
        path: paths.app.transactions.create,
        title: "Buat transaksi",
      },
    ],
  },
  {
    key: "cashier-item",
    path: paths.app.items,
    icon: Tag,
    title: "Item",
  },
  {
    key: "cashier-customer",
    path: paths.app.customers,
    icon: Users2,
    title: "Pelanggan",
  },
] satisfies NavItem[];

const ownerNavigations = [
  ...cashierNavigations,
  {
    key: "owner-expense",
    title: "Pengeluaran",
    icon: ArrowDownLeft,
    children: [],
  },
  {
    key: "owner-report",
    title: "Laporan",
    icon: BarChart3,
    children: [
      {
        key: "owner-report-expense",
        path: paths.app.reports.expense,
        title: "Pengeluaran",
      },
      {
        key: "owner-report-income",
        path: paths.app.reports.income,
        title: "Pemasukan",
      },
    ],
  },
] satisfies NavItem[];

export const MainSidebar = () => {
  const { data, isPending } = authClient.useSession();

  const role = data?.user.role;

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="pt-6">
        <div className="flex items-center gap-2">
          <div className="relative size-8 cursor-default">
            <Image
              src="/logo-rocket-carwash.svg"
              alt="logo-rocket-carwash"
              fill
              className="pointer-events-none"
            />
          </div>
          <span className="cursor-default font-bold">Rocket Carwash</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {isPending &&
              Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuSkeleton key={i} />
              ))}
            {!isPending && role === "cashier"
              ? cashierNavigations.map((nav) => (
                  <MainSidebarItem key={nav.key} item={nav} />
                ))
              : ownerNavigations.map((nav) => (
                  <MainSidebarItem key={nav.key} item={nav} />
                ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
