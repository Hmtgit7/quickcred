import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingCta() {
  return (
    <section id="security" className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-normal sm:text-4xl">
          Start with the workspace your team already needs.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Give each role a focused dashboard, keep movement visible, and turn loan operations into a cleaner daily rhythm.
        </p>
        <Button asChild size="lg" className="mt-8 h-11 px-5">
          <Link href={ROUTES.LOGIN}>
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
