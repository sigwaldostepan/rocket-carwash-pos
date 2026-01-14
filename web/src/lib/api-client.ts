import { env } from "@/config/env";
import axios from "axios";

const baseURL = `${env.NEXT_PUBLIC_API_URL}/api`;

export const apiClient = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
