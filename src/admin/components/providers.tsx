"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale, messages } from "@/admin/lib/i18n";

type SettingsContextValue = {
  locale: Locale; setLocale: (locale: Locale) => void;
  theme: "dark" | "light"; setTheme: (theme: "dark" | "light") => void;
  t: (key: keyof typeof messages.fa) => string;
};
const SettingsContext = createContext<SettingsContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fa");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const savedLocale = localStorage.getItem("credit-yar-locale");
    const savedTheme = localStorage.getItem("credit-yar-theme");
    if (savedLocale === "fa" || savedLocale === "en") setLocale(savedLocale);
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    setReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.dataset.locale = locale;
    document.documentElement.dataset.theme = theme;
    if (ready) {
      localStorage.setItem("credit-yar-locale", locale);
      localStorage.setItem("credit-yar-theme", theme);
    }
  }, [locale, theme, ready]);
  const value = useMemo(() => ({
    locale, setLocale, theme, setTheme,
    t: (key: keyof typeof messages.fa) => messages[locale][key],
  }), [locale, theme]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useAppSettings must be used inside AppProviders");
  return context;
}
