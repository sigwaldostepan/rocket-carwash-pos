import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "./provider";
import { env } from "@/config/env";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rocket Carwash",
    default: "Rocket Carwash — Sistem POS & Manajemen Cuci Kendaraan",
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  description:
    "Aplikasi POS dan sistem manajemen operasional untuk bisnis cuci mobil & motor. Kelola transaksi, pelanggan, item, laporan, dan pengeluaran dalam satu platform.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: "Rocket Carwash",
    title: "Rocket Carwash — Sistem POS & Manajemen Cuci Kendaraan",
    description:
      "Aplikasi POS dan sistem manajemen operasional untuk bisnis cuci mobil & motor. Kelola transaksi, pelanggan, item, laporan, dan pengeluaran dalam satu platform.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Rocket Carwash - Sistem Manajemen dan POS",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Rocket Carwash - Sistem Manajemen dan POS",
    description:
      "Aplikasi POS dan sistem manajemen operasional untuk bisnis cuci mobil & motor. Kelola transaksi, pelanggan, item, laporan, dan pengeluaran dalam satu platform.",
    images: ["/og-image.webp"],
  },

  // Additional metadata
  keywords: [
    "carwash",
    "cuci mobil",
    "sistem manajemen",
    "POS",
    "point of sale",
    "rocket carwash",
  ],
  authors: [{ name: "Rocket Carwash" }],
  creator: "Rocket Carwash",

  // Robots metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
