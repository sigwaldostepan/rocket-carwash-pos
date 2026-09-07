"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavItem } from "@/config/user-navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MainSidebarItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          href={item.path}
          className={cn(
            "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground transition-colors",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent",
          )}
        >
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
