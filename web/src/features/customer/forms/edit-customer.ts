import { z } from "zod";
import { createCustomerSchema } from "./create-customer";
import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const editCustomerSchema = createCustomerSchema.partial();

export type EditCustomerSchema = z.infer<typeof editCustomerSchema>;

type UseEditCustomerFormProps = UseFormProps<EditCustomerSchema>;

export const useEditCustomerForm = ({
  defaultValues,
  ...props
}: UseEditCustomerFormProps) => {
  return useForm({
    defaultValues,
    resolver: zodResolver(editCustomerSchema),
    ...props,
  });
};
