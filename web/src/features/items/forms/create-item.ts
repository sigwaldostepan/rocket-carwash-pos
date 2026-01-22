import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { z } from "zod";

export const createItemSchema = z.object({
  name: z
    .string({
      error: "Nama item harus berupa string",
    })
    .min(1, "Nama item gak boleh kosong")
    .max(200, "Nama item maksimal 200 karakter"),

  isRedeemable: z.boolean().default(false).nonoptional(),

  isGetPoint: z.boolean().default(false).nonoptional(),

  canBeComplimented: z.boolean().default(false).nonoptional(),

  price: z
    .number({
      error: "Harga item harus berupa angka",
    })
    .min(0, "Harga item gak boleh negatif")
    .max(1000000000, "Harga item maksimal 1.000.000.000"),
});

export type CreateItemSchema = z.infer<typeof createItemSchema>;

type UseCreateItemFormProps = Omit<
  UseFormProps<CreateItemSchema>,
  "defaultValues"
>;

export const useCreateItemForm = (props: UseCreateItemFormProps) => {
  return useForm({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      canBeComplimented: false,
      isGetPoint: false,
      isRedeemable: false,
      price: 0,
    },
    ...props,
  });
};
