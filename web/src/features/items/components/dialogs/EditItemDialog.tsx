"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { Item } from "@/types/api/item";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useEditItem } from "../../api/edit-item";
import { EditItemSchema, useEditItemForm } from "../../forms/edit-item";
import { ItemForm } from "../ItemForm";

export const EditItemDialog = () => {
  const { isOpen, key, data: dialogData, closeDialog } = useDialog<Item>();

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

  if (!isOpen || key !== DIALOG_KEY.item.edit) {
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
