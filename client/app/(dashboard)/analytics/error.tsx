"use client";

import { useEffect } from "react";
import { GlobalErrorFallback } from "@/components/common/GlobalErrorFallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnalyticsError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[AnalyticsRouteError]", error);
  }, [error]);

  return <GlobalErrorFallback error={error} onReset={reset} />;
}
