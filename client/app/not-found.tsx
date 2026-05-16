import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tabular-nums text-foreground">404</h1>
        <h2 className="text-lg font-semibold text-foreground">Page not found</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Button asChild>
        <Link href={ROUTES.DASHBOARD}>Back to Dashboard</Link>
      </Button>
    </div>
  );
}
