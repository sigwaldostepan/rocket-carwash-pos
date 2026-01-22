"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: {
    title: string;
    path: string;
  }[];
};

export const MainSidebarItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();

  const isActive = item.path?.includes(pathname);

  if (!item.children) {
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild>
          <Link
            href={item.path!}
            className={cn(
              "hover:bg-secondary/70! hover:text-secondary-foreground! transition-colors",
              isActive &&
                "bg-secondary text-secondary-foreground! hover:bg-secondary!",
            )}
          >
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // with submenu
  const isParentActive = item.children.some((i) => i.path?.includes(pathname));
  return (
    <Collapsible
      key={item.title}
      className="group"
      defaultOpen={isParentActive}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="hover:bg-secondary/70! hover:text-secondary-foreground! flex items-center justify-between rounded-md transition-colors">
            <span className="flex items-center gap-2">
              <item.icon size={16} />
              <span>{item.title}</span>
            </span>

            <ChevronRight
              size={16}
              className="transition-transform duration-200 group-data-[state=open]:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => {
              const isChildActive = child.path === pathname;
              return (
                <SidebarMenuSubItem key={child.path}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-secondary/70! hover:text-secondary-foreground! rounded-md transition-colors",
                      isChildActive &&
                        "bg-secondary text-secondary-foreground! hover:bg-secondary!",
                    )}
                  >
                    <Link href={child.path}>
                      <span className="text-sm">{child.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
