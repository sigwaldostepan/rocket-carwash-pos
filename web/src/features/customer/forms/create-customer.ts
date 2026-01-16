import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().nonempty("Nama customer tidak boleh kosong"),
  phoneNumber: z.string().nonempty("Nomor telepon tidak boleh kosong"),
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;

type UseCreateCustomerFormsProps = Omit<
  UseFormProps<CreateCustomerSchema>,
  "defaultValues"
>;

export const useCreateCustomerForm = (props: UseCreateCustomerFormsProps) => {
  return useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
    resolver: zodResolver(createCustomerSchema),
    ...props,
  });
};
