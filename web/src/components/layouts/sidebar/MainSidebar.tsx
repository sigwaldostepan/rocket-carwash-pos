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
import { authClient } from "@/lib/auth";
import Image from "next/image";
import { MainSidebarItem } from "./MainSidebarItem";
import { getNavigationsByRole } from "@/config/user-navigation";

export const MainSidebar = () => {
  const { data, isPending } = authClient.useSession();

  const role = data?.user.role as "cashier" | "owner" | undefined;
  const navigations = role ? getNavigationsByRole(role) : [];

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
            {navigations.map((nav) => (
              <MainSidebarItem key={nav.key} item={nav} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
