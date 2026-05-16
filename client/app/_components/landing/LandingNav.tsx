import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes";

export function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.HOME} className="flex items-center gap-2" aria-label={APP_NAME}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Platform</a>
          <a href="#workflow" className="transition-colors hover:text-foreground">Workflow</a>
          <a href="#security" className="transition-colors hover:text-foreground">Controls</a>
        </div>

        <Button asChild size="lg" className="h-10 px-4">
          <Link href={ROUTES.LOGIN}>Get started</Link>
        </Button>
      </nav>
    </header>
  );
}
