"use client";

import { Container, PageShell } from "@/components/layouts";
import { authClient } from "@/lib/auth";
import { NavigationGrid } from "./NavigationGrid";

export const HomePageInner = () => {
  const { data } = authClient.useSession();

  const cashierWelcomeText =
    "Proses transaksi, atur pelanggan, dan item dalam satu tempat.";
  const ownerWelcomeText =
    "Kelola pelanggan, transaksi, pengeluaran, dan cek laporan dalam satu tempat.";

  return (
    <PageShell title="Beranda">
      <Container>
        {/* welcoming section */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Hi, {data?.user?.name}</h3>
          <p className="text-muted-foreground text-sm">
            {data?.user.role === "cashier"
              ? cashierWelcomeText
              : ownerWelcomeText}
          </p>
        </div>

        {/* navigation grid */}
        <div className="mt-8">
          <NavigationGrid />
        </div>
      </Container>
    </PageShell>
  );
};
