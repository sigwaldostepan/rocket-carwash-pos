"use client";

import { TouchProvider } from "@/components/ui/hybrid-tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    ...queryConfig,
  },
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient!}>
      <SidebarProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            descriptionClassName: "text-muted-foreground!",
          }}
        />
        <TouchProvider>{children}</TouchProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          position="left"
          buttonPosition="bottom-left"
        />
      </SidebarProvider>
    </QueryClientProvider>
  );
};
