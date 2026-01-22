import { env } from "@/config/env";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { AUTH_TOKEN_KEY } from "@/features/auth/constants";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  basePath: "/api/auth",
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);

        return token ?? undefined;
      },
    },
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["cashier", "owner"],
          input: false,
        },
      },
    }),
  ],
});

type ErrorTypes = Partial<
  Record<keyof typeof authClient.$ERROR_CODES, { id: string }>
>;

const errorCodes = {
  INVALID_EMAIL_OR_PASSWORD: { id: "Email atau password salah" },
  EMAIL_NOT_VERIFIED: { id: "Email belum terverifikasi" },
  USER_NOT_FOUND: { id: "Akun tidak ditemukan" },
  SESSION_EXPIRED: { id: "Session habis, coba login lagi" },
  USER_ALREADY_EXISTS: { id: "Akun sudah terdaftar" },
  INVALID_PASSWORD: { id: "Password tidak valid" },
  INVALID_EMAIL: { id: "Email tidak valid" },
  PASSWORD_TOO_SHORT: { id: "Password terlalu pendek" },
  PASSWORD_TOO_LONG: { id: "Password terlalu panjang" },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: { id: "Akun sudah terdaftar" },
} satisfies ErrorTypes;

export const getAuthErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes].id;
  }

  return "Terjadi kesalahan, coba lagi";
};
