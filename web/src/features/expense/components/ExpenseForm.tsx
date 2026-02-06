"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";
import { ExpenseFormSchema } from "../forms/expense-form";
import { useGetExpenseCategories } from "@/features/expense-category/api/get-expense-categories";
import { formatThousand } from "@/utils/currency";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type ExpenseFormProps = {
  isLoading?: boolean;
  onSubmit: (data: ExpenseFormSchema) => void;
};

export const ExpenseForm = ({ isLoading, onSubmit }: ExpenseFormProps) => {
  const form = useFormContext<ExpenseFormSchema>();
  const { data: categories, isPending: isCategoriesLoading } =
    useGetExpenseCategories({});

  const disableSubmitButton =
    isLoading || !form.formState.isValid || !form.formState.isDirty;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Kategori</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isCategoriesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="amount"
            render={({ field, fieldState }) => {
              const displayValue = formatThousand(field.value);

              return (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel>Nominal</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>Rp</InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      type="text"
                      placeholder="Masukkan nominal"
                      value={displayValue}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value ? Number(value) : 0);
                      }}
                    />
                  </InputGroup>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              );
            }}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Deskripsi (Opsional)</FieldLabel>
                <Textarea
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan deskripsi pengeluaran"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <Button disabled={disableSubmitButton} className="w-full" type="submit">
        {isLoading && <Spinner />}Simpan
      </Button>
    </form>
  );
};
