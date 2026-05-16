const stages = ["Sales", "Sanction", "Disburse", "Collect"];
const rows = [
  ["Aarav Mehta", "Applied", "₹2,40,000"],
  ["Nisha Rao", "Sanctioned", "₹1,85,000"],
  ["Kabir Singh", "Disbursed", "₹3,20,000"],
];

export function ProductPreview() {
  return (
    <div className="absolute inset-y-20 right-[-12rem] hidden w-[58rem] rotate-[-3deg] opacity-45 lg:block">
      <div className="rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex h-12 items-center gap-2 border-b border-border px-4">
          <span className="h-3 w-3 rounded-full bg-chart-5" />
          <span className="h-3 w-3 rounded-full bg-chart-2" />
          <span className="h-3 w-3 rounded-full bg-chart-4" />
        </div>
        <div className="grid grid-cols-[13rem_1fr]">
          <aside className="space-y-2 border-r border-border p-4">
            <div className="mb-5 h-8 w-32 rounded-md bg-primary/20" />
            {stages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-3 rounded-lg bg-muted/70 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{stage}</span>
              </div>
            ))}
          </aside>
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-3 gap-3">
              {["Portfolio", "Due Today", "Approval"].map((label) => (
                <div key={label} className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <div className="mt-3 h-7 w-24 rounded-md bg-primary/20" />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border bg-background">
              {rows.map(([name, status, amount]) => (
                <div key={name} className="grid grid-cols-3 border-b border-border px-4 py-4 text-sm last:border-b-0">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{status}</span>
                  <span className="text-right font-semibold">{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
