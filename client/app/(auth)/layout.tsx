import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Centered content */}
      <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Bottom footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} QuickCred. All rights reserved.
        </p>
      </footer>
    </div>
  );
}