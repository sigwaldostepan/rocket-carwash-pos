import { AuthGuard } from "@/components/guards";
import { HomePageInner } from "../components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda",
};

export const HomePage = () => {
  return (
    <AuthGuard>
      <HomePageInner />
    </AuthGuard>
  );
};
