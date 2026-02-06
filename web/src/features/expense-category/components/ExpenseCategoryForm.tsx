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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";
import { ExpenseCategorySchema } from "../forms/expense-category-form";

type ExpenseCategoryFormProps = {
  isLoading?: boolean;
  onSubmit: (data: ExpenseCategorySchema) => void;
};

export const ExpenseCategoryForm = ({
  isLoading,
  onSubmit,
}: ExpenseCategoryFormProps) => {
  const form = useFormContext<ExpenseCategorySchema>();

  const disableSubmitButton =
    isLoading || !form.formState.isValid || !form.formState.isDirty;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nama Kategori</FieldLabel>
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan nama kategori"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
                  placeholder="Masukkan deskripsi kategori"
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
