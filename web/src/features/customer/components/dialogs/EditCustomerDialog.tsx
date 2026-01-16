"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { useDialog, useDialogActions } from "@/stores/dialog";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { toast } from "sonner";
import { useEditCustomer } from "../../api/edit-customer";
import {
  EditCustomerSchema,
  useEditCustomerForm,
} from "../../forms/edit-customer";
import { CustomerForm } from "../CustomerForm";
import { FormProvider } from "react-hook-form";

export const EditCustomerDialog = () => {
  const {
    data: customer,
    isOpen,
    mode,
  } = useDialog<CustomerWithTransactionCount>();

  const form = useEditCustomerForm({
    values: {
      name: customer?.name,
      phoneNumber: customer?.phoneNumber,
    },
  });

  const { mutate, isPending: isLoading } = useEditCustomer({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Customer berhasil diedit");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
        console.error(err);
      },
    },
  });

  const { closeDialog } = useDialogActions();

  const onSubmit = (data: EditCustomerSchema) => {
    if (!customer?.id) {
      return;
    }

    mutate({ id: customer.id, data });
  };

  if (!isOpen || mode !== "edit") {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={closeDialog}
      title={`Edit ${customer?.name}`}
    >
      <FormProvider {...form}>
        <CustomerForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
