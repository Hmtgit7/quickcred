import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes";
import { ProductPreview } from "./ProductPreview";

const trustPoints = ["Role-based work queues", "Borrower-ready journeys", "Live portfolio clarity"];

export function LandingHero() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden border-b border-border bg-background pt-28">
      <ProductPreview />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 mx-auto flex min-h-[calc(92vh-7rem)] max-w-7xl flex-col justify-center px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Built for fast loan operations
          </p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            {APP_NAME}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Move every loan from application to collection through one focused operating system for sales, sanction, disbursement, and recovery teams.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5 text-sm">
              <Link href={ROUTES.LOGIN}>
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-5 text-sm">
              <a href="#features">See platform</a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {trustPoints.map((point) => (
              <span key={point} className="rounded-lg border border-border bg-card/80 px-3 py-1">
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
