import type { Metadata } from "next";
import { LandingCta } from "./_components/landing/LandingCta";
import { LandingFeatures } from "./_components/landing/LandingFeatures";
import { LandingHero } from "./_components/landing/LandingHero";
import { LandingNav } from "./_components/landing/LandingNav";
import { LandingStats } from "./_components/landing/LandingStats";
import { LandingWorkflow } from "./_components/landing/LandingWorkflow";

export const metadata: Metadata = {
  title: "QuickCred",
  description: "Loan operations that move from lead to repayment without the clutter.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingWorkflow />
      <LandingCta />
    </main>
  );
}
