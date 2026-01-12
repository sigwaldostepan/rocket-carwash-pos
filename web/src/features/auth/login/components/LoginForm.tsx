"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useLoginForm } from "../hooks/use-login-form";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { form, isLoading, handleSubmit } = useLoginForm({
    mode: "onBlur",
  });

  const isFormDisabled = isLoading || !form.formState.isValid;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <span className="relative size-8">
                <Image
                  src="/logo-rocket-carwash.svg"
                  alt="logo-rocket-carwash"
                  fill
                />
              </span>
            </div>
            <h1 className="text-xl font-bold">Rocket Carwash</h1>
            <FieldDescription>Login kembali ke akun kamu</FieldDescription>
          </div>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="m@example.com"
                  required
                  {...field}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={isFormDisabled}>
              {isLoading && <Spinner />}
              Login
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};
