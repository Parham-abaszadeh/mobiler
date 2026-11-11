import type React from "react";
import { AppShell } from "@/admin/components/app-shell";
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
