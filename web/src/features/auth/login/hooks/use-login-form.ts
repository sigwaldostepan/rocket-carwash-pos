"use client";

import { paths } from "@/config/paths";
import { authClient, getAuthErrorMessage } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm, UseFormProps } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_TOKEN_KEY } from "../../constants";
import { loginSchema, type LoginSchema } from "../forms/login";

export type UseLoginFormProps = UseFormProps<LoginSchema>;

export const useLoginForm = (props?: UseLoginFormProps) => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    ...props,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    const { error, data: response } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      const message = getAuthErrorMessage(error?.code ?? "");

      setIsLoading(false);
      toast.error(message);

      return;
    }

    if (response) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);

      setIsLoading(false);

      toast.success("Login berhasil", {
        description: `Selamat datang kembali, ${response?.user.name}`,
      });

      const redirectTo = !!searchParams.get("redirectTo")
        ? searchParams.get("redirectTo")!
        : paths.app.home;

      router.replace(redirectTo);
    }
  };

  React.useEffect(() => {
    form.setFocus("email");
  }, [form]);

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
