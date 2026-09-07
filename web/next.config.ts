import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/transactions/create", destination: "/transactions", permanent: true },
      { source: "/transactions/drafts", destination: "/transactions", permanent: true },
      { source: "/expenses/categories", destination: "/expenses", permanent: true },
      { source: "/reports", destination: "/transactions", permanent: true },
      { source: "/reports/expense", destination: "/expenses", permanent: true },
      { source: "/reports/income", destination: "/transactions", permanent: true },
    ];
  },
};

export default nextConfig;
