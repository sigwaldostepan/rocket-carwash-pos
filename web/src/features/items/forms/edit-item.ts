import z from "zod";
import { createItemSchema } from "./create-item";
import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const editItemSchema = createItemSchema.partial();

export type EditItemSchema = z.infer<typeof editItemSchema>;

type UseEditItemFormProps = UseFormProps<EditItemSchema>;

export const useEditItemForm = (props: UseEditItemFormProps) => {
  return useForm({
    resolver: zodResolver(editItemSchema),
    ...props,
  });
};
