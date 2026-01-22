"use client";

import { ResponsiveDialog } from "@/components/shared";
import { useDialog, useDialogActions } from "@/stores/dialog";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useCreateItem } from "../../api/create-item";
import { CreateItemSchema, useCreateItemForm } from "../../forms/create-item";
import { ItemForm } from "../ItemForm";

export const CreateItemDialog = () => {
  const { isOpen, mode } = useDialog();
  const { closeDialog } = useDialogActions();

  const form = useCreateItemForm({});
  const { mutate } = useCreateItem({
    mutationConfig: {
      onSuccess: () => {
        closeDialog();

        form.reset();
        toast.success("Item berhasil ditambahkan");
      },
    },
  });

  const onSubmit = (data: CreateItemSchema) => {
    mutate(data);
  };

  if (!isOpen || mode !== "create") {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={closeDialog}
      title="Tambah Item"
      description="Tambahkan item baru"
    >
      <FormProvider {...form}>
        <ItemForm onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
