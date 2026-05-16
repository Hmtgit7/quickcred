import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** Use "narrow" for single-column forms, "default" for most pages, "wide" for data-heavy views */
  size?: "narrow" | "default" | "wide" | "full";
}

const SIZE_MAP = {
  narrow: "max-w-2xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8",
        SIZE_MAP[size],
        className
      )}
    >
      {children}
    </div>
  );
}