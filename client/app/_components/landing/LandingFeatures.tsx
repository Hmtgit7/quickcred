import { BarChart3, ClipboardCheck, FileUp, ShieldCheck, Users, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Lead command", body: "Track borrowers, documents, and eligibility signals from the first touch.", icon: Users },
  { title: "Sanction desk", body: "Review applications with clean status movement and decision context.", icon: ClipboardCheck },
  { title: "Disbursement control", body: "Move approved loans into payout queues with fewer handoff gaps.", icon: WalletCards },
  { title: "Collection focus", body: "Follow repayment history, outstanding value, and borrower dues.", icon: ShieldCheck },
  { title: "Document intake", body: "Keep required slips and borrower proof attached to the loan journey.", icon: FileUp },
  { title: "Portfolio analytics", body: "See disbursed value, repayment rate, active loans, and trends.", icon: BarChart3 },
];

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-primary">Platform</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            One workspace for every loan desk.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, body, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
