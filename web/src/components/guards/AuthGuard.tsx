"use client";

import { authClient } from "@/lib/auth";
import { PageLoader } from "../shared";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { paths } from "@/config/paths";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = authClient.useSession();

  // get current path, for redirect back after on login success
  const router = useRouter();
  const pathname = usePathname();

  if (isPending) {
    return <PageLoader />;
  }

  if (!data) {
    toast.error("Kamu belum login");
    router.replace(paths.auth.login.getPath(pathname));

    return null;
  }

  return children;
};
