import { ArrowRight, BarChart3, CheckCircle2, IndianRupee } from "lucide-react";

const highlights = [
  "Role-based loan queues",
  "Borrower onboarding built in",
  "Live repayment visibility",
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_70%_75%,hsl(var(--primary))_0%,hsl(var(--primary)/0.35)_28%,hsl(168_48%_13%)_62%,hsl(170_52%_9%)_100%)] text-white lg:block">
      <div className="absolute inset-0 opacity-25" aria-hidden="true">
        <div className="absolute right-16 top-[-5rem] text-[24rem] font-semibold leading-none text-white/30">{"{"}</div>
        <div className="absolute right-[-2rem] top-16 text-[24rem] font-semibold leading-none text-white/25">{"}"}</div>
        <div className="absolute bottom-[-7rem] right-16 h-72 w-72 rotate-45 border-[3rem] border-white/10" />
      </div>

      <div className="relative z-10 flex min-h-screen max-w-3xl flex-col justify-center px-20">
        <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Lending operations, simplified
        </p>
        <h2 className="max-w-xl text-5xl font-semibold leading-tight tracking-normal">
          Move loans from lead to repayment without losing the thread.
        </h2>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
          QuickCred gives every team a focused workspace for faster approvals,
          cleaner handoffs, and confident collections.
        </p>

        <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
          <Metric icon={IndianRupee} label="Loan ceiling" value="₹5L" />
          <Metric icon={BarChart3} label="Annual rate" value="12%" />
        </div>

        <ul className="mt-10 space-y-3 text-sm text-white/85">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <ArrowRight className="h-4 w-4 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-white/70">{label}</p>
    </div>
  );
}
