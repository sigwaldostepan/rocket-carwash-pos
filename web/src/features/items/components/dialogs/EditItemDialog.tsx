"use client";

import { ResponsiveDialog } from "@/components/shared";
import { useDialog, useDialogActions } from "@/stores/dialog";
import { Item } from "@/types/api/item";
import { FormProvider } from "react-hook-form";
import { EditItemSchema, useEditItemForm } from "../../forms/edit-item";
import { ItemForm } from "../ItemForm";
import { useEditItem } from "../../api/edit-item";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

export const EditItemDialog = () => {
  const { isOpen, mode, data: dialogData } = useDialog<Item>();
  const { closeDialog } = useDialogActions();

  const { mutate } = useEditItem({
    mutationConfig: {
      onSuccess: () => {
        closeDialog();
        form.reset();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
      },
    },
  });

  const form = useEditItemForm({
    values: {
      name: dialogData?.name,
      price: Number(dialogData?.price),
      isRedeemable: dialogData?.isRedeemable,
      isGetPoint: dialogData?.isGetPoint,
      canBeComplimented: dialogData?.canBeComplimented,
    },
  });

  const onSubmit = (data: EditItemSchema) => {
    mutate({
      id: dialogData?.id,
      data,
    });
  };

  if (!isOpen || mode !== "edit") {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={closeDialog}
      title="Edit item"
    >
      <FormProvider {...form}>
        <ItemForm onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
