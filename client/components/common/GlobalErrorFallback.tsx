"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

interface GlobalErrorFallbackProps {
  error?: Error | null;
  onReset?: () => void;
}

export function GlobalErrorFallback({
  error,
  onReset,
}: GlobalErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <div className="max-w-sm space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Try refreshing this view.
        </p>
        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-left font-mono text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {onReset && (
          <Button type="button" onClick={onReset}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href={ROUTES.DASHBOARD}>
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
