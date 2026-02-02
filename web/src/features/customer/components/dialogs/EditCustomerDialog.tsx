"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useEditCustomer } from "../../api/edit-customer";
import {
  EditCustomerSchema,
  useEditCustomerForm,
} from "../../forms/edit-customer";
import { CustomerForm } from "../CustomerForm";

export const EditCustomerDialog = () => {
  const {
    data: customer,
    isOpen,
    key,
    closeDialog,
    setIsOpen,
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
      },
    },
  });

  const onSubmit = (data: EditCustomerSchema) => {
    if (!customer?.id) {
      return;
    }

    mutate({ id: customer.id, data });
  };

  if (!isOpen || key !== DIALOG_KEY.customer.edit) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.customer.edit, false)}
      title={`Edit ${customer?.name}`}
    >
      <FormProvider {...form}>
        <CustomerForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
