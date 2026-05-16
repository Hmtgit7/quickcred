const steps = [
  ["Apply", "Borrower submits profile, amount, tenure, and documents."],
  ["Review", "Sales and sanction teams qualify the request with role clarity."],
  ["Disburse", "Approved loans move into a dedicated payout workspace."],
  ["Collect", "Teams monitor repayments, outstanding balances, and history."],
];

export function LandingWorkflow() {
  return (
    <section id="workflow" className="border-y border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              From first request to final repayment.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              QuickCred keeps each operating team inside the part of the lifecycle they own.
            </p>
          </div>
          <div className="grid gap-3">
            {steps.map(([title, body], index) => (
              <div key={title} className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-border bg-background p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
