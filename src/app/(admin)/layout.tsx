import type React from "react";
import type { Metadata } from "next";
import "@/admin/globals.css";
import { AppProviders } from "@/admin/components/providers";

export const metadata: Metadata = {
  title: "پنل مدیریت | موبایلر",
  description: "پنل مدیریت فروشگاه موبایلر (اعتباریار)",
  robots: { index: false, follow: false },
};

// این Root Layout جدا از فروشگاه است تا CSS پنل روی فروشگاه اثر نگذارد.
export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
