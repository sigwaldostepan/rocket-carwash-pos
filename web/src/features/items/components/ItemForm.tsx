"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { formatThousand } from "@/utils/currency";
import { Controller, useFormContext } from "react-hook-form";
import { CreateItemSchema } from "../forms/create-item";

type ItemFormProps = {
  onSubmit: (data: CreateItemSchema) => void;
};

export const ItemForm = ({ onSubmit }: ItemFormProps) => {
  const form = useFormContext<CreateItemSchema>();

  const disableSubmitButton =
    !form.formState.isValid || !form.formState.isDirty;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.error}>
              <FieldLabel>Nama</FieldLabel>
              <Input placeholder="Masukkan nama item" {...field} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="price"
          render={({ field, fieldState }) => {
            const displayValue = formatThousand(field.value);

            return (
              <Field data-invalid={fieldState.error}>
                <FieldLabel>Harga</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>Rp</InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    type="text"
                    placeholder="Masukkan harga item"
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
        {/* loyalty related fields */}
        <div className="space-y-2">
          <Controller
            control={form.control}
            name="isRedeemable"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error} orientation="horizontal">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
                <FieldLabel htmlFor={field.name}>
                  Item bisa ditukar dengan 10 poin customer
                </FieldLabel>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="isGetPoint"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error} orientation="horizontal">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
                <FieldLabel htmlFor={field.name}>
                  Customer mendapatkan poin ketika beli item ini
                </FieldLabel>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="canBeComplimented"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error} orientation="horizontal">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
                <FieldLabel htmlFor={field.name}>
                  Item bisa dikomplimen
                </FieldLabel>
              </Field>
            )}
          />
        </div>

        <Button type="submit" disabled={disableSubmitButton}>
          Tambah item
        </Button>
      </FieldGroup>
    </form>
  );
};
