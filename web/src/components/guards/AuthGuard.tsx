"use client";

import { authClient, AuthRole } from "@/lib/auth";
import { PageLoader } from "../shared";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { paths } from "@/config/paths";

type AuthGuardProps = {
  children: React.ReactNode;
  roles?: AuthRole[];
};

export const AuthGuard = ({ children, roles }: AuthGuardProps) => {
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

  if (roles && !roles.includes(data.user?.role)) {
    toast.error("Kamu tidak memiliki akses");
    router.replace(paths.app.home);

    return null;
  }

  return children;
};
