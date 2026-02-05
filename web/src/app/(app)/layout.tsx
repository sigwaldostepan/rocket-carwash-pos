import { MainSidebar } from "@/components/layouts/";
import { PageLoader } from "@/components/shared";
import { Suspense } from "react";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex h-full w-full">
        <MainSidebar />
        <div className="relative h-full min-w-0 flex-1">
          <main className="h-full w-full overflow-x-auto">{children}</main>
        </div>
      </div>
    </Suspense>
  );
};

export default AppLayout;
