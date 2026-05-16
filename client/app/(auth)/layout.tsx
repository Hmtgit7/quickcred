import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/modules/auth/components/AuthBrandPanel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[34rem_1fr]">
      <section className="flex min-h-screen flex-col bg-card px-6 py-8 sm:px-10 lg:px-14">
        {children}
        <p className="mt-auto pt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} QuickCred. All rights reserved.
        </p>
      </section>
      <AuthBrandPanel />
    </main>
  );
}
