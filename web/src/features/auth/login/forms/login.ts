import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email tidak boleh kosong")
    .email({ error: "Email invalid" })
    .max(255, "Email terlalu panjang"),
  password: z
    .string()
    .nonempty("Password tidak boleh kosong")
    .max(255, "Password terlalu panjang"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
