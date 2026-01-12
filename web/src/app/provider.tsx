"use client";

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
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </SidebarProvider>
    </QueryClientProvider>
  );
};
