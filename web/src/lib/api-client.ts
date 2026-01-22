import { env } from "@/config/env";
import { AUTH_TOKEN_KEY } from "@/features/auth/constants";
import axios, { AxiosError } from "axios";

const baseURL = `${env.NEXT_PUBLIC_API_URL}/api`;

export const apiClient = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== undefined) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`;
  }

  return config;
});

type ApiErrorResponse = {
  code?: ErrorCodes;
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
};

export type ErrorCodes =
  // 4xx — Client errors
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "NOT_ACCEPTABLE"
  | "CONFLICT"
  | "GONE"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"

  // 5xx — Server errors
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "GATEWAY_TIMEOUT";

export const getApiErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    const code = data?.code;

    if (data?.errors?.length) {
      return data.errors[0].message;
    }

    let message = "";

    switch (code) {
      case "VALIDATION_ERROR":
        message = "Data yang dimasukkan tidak valid.";
        break;

      case "BAD_REQUEST":
        message = data?.message ?? "Permintaan tidak valid.";
        break;

      case "UNAUTHORIZED":
        message = "Sesi kamu sudah habis. Silakan login ulang.";
        break;

      case "FORBIDDEN":
        message = "Kamu tidak punya akses ke fitur ini.";
        break;

      case "NOT_FOUND":
        message = "Data yang dicari tidak ditemukan.";
        break;

      case "CONFLICT":
        message = "Data sudah ada atau terjadi konflik.";
        break;

      case "TOO_MANY_REQUESTS":
        message = "Terlalu banyak permintaan. Coba lagi nanti.";
        break;

      case "INTERNAL_SERVER_ERROR":
        message = "Terjadi kesalahan pada server.";
        break;

      default:
        message = data?.message ?? "Terjadi kesalahan.";
    }

    return message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Terjadi kesalahan";
};
