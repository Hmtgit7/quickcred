"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";

function ThemeAttributeSync() {
  useEffect(() => {
    const sync = () => {
      const isDark = document.documentElement.classList.contains("dark");
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="quickcred-theme"
    >
      <ThemeAttributeSync />
      {children}
    </NextThemesProvider>
  );
}
