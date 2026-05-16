"use client";

import { useEffect } from "react";
import { GlobalErrorFallback } from "@/components/common/GlobalErrorFallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[DashboardRouteError]", error);
  }, [error]);

  return <GlobalErrorFallback error={error} onReset={reset} />;
}
