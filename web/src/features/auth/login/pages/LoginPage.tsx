import { Metadata } from "next";
import { LoginForm } from "../components/LoginForm";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Login",
};

export const LoginPage = async () => {
  await connection();

  return (
    <main className="bg-background flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
};
