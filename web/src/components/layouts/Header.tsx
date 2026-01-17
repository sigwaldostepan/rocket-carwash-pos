"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth";
import { getInitialName } from "@/utils/get-initials-name";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AUTH_TOKEN_KEY } from "@/features/auth/constants";

type HeaderProps = {
  title: string | React.ReactNode;
};

export const Header = ({ title }: HeaderProps) => {
  const { data } = authClient.useSession();
  const initialName = getInitialName(data?.user.name ?? "");

  const handleLogout = () => {
    authClient.signOut();
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Separator className="h-4!" orientation="vertical" />
          {typeof title === "string" ? (
            <h1 className="text-base font-medium">{title}</h1>
          ) : (
            title
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initialName}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-2 p-2">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initialName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{data?.user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {data?.user.email}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {data?.user.role}
                  </p>
                </div>
              </div>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
