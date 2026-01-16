"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

type BaseProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  cancelButtonText?: string;
};

type ControlledProps = BaseProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: never;
};

type UncontrolledProps = BaseProps & {
  trigger?: React.ReactNode;
  open?: never;
  onOpenChange?: never;
};

type ResponsiveDialogProps = ControlledProps | UncontrolledProps;

export const ResponsiveDialog = ({
  children,
  open,
  onOpenChange,
  trigger,
  title,
  description,
  cancelButtonText,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {!!trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">
              {cancelButtonText ? cancelButtonText : "Batal"}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
