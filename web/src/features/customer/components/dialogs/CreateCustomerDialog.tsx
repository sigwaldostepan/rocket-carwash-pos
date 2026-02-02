import { ResponsiveDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomerForm } from "../CustomerForm";
import {
  CreateCustomerSchema,
  useCreateCustomerForm,
} from "../../forms/create-customer";
import { FormProvider } from "react-hook-form";
import { useCreateCustomer } from "../../api/create-customer";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-client";

export const CreateCustomerDialog = () => {
  const form = useCreateCustomerForm({});
  const { isOpen, key, closeDialog, setIsOpen } = useDialog();

  const { mutate, isPending: isLoading } = useCreateCustomer({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Customer berhasil ditambahkan");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
        console.error(err);
      },
    },
  });

  const onSubmit = (data: CreateCustomerSchema) => {
    mutate(data);
  };

  if (!isOpen || key !== DIALOG_KEY.customer.create) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.customer.create, false)}
      title="Tambah Customer"
      description="Tambahkan customer baru"
    >
      <FormProvider {...form}>
        <CustomerForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
