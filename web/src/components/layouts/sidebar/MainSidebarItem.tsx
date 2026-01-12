import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

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
  if (!item.children) {
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild>
          <Link href={item.path!}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // with submenu
  return (
    <Collapsible key={item.title} className='group'>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className='peer flex items-center justify-between'>
            <span className='flex items-center gap-2'>
              <item.icon size={16} />
              <span>{item.title}</span>
            </span>

            <ChevronRight
              size={16}
              className='transition-transform duration-200 peer-data-[state=open]:rotate-90'
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => (
              <SidebarMenuSubItem key={child.path}>
                <SidebarMenuButton asChild>
                  <Link href={child.path}>
                    <span className='text-sm'>{child.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
