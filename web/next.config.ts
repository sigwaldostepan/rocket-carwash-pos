import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/transactions/create", destination: "/transactions", permanent: true },
      { source: "/transactions/drafts", destination: "/transactions", permanent: true },
      { source: "/expenses/categories", destination: "/expenses", permanent: true },
      { source: "/reports/expense", destination: "/reports", permanent: true },
      { source: "/reports/income", destination: "/reports", permanent: true },
    ];
  },
};

export default nextConfig;
