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
import { Controller, useFormContext } from "react-hook-form";
import { CreateCustomerSchema } from "../forms/create-customer";

type CustomerFormProps = {
  isLoading: boolean;
  onSubmit: (data: CreateCustomerSchema) => void;
};

export const CustomerForm = ({ isLoading, onSubmit }: CustomerFormProps) => {
  const form = useFormContext<CreateCustomerSchema>();

  const disableSubmitButton =
    isLoading || !form.formState.isValid || !form.formState.isDirty;

  return (
    <form
      className="space-y-4 px-4 md:px-0"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan nama customer"
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
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>No. Telp</FieldLabel>
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan no. telp customer"
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
