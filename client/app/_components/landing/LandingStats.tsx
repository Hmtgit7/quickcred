const stats = [
  ["4", "specialized team workspaces"],
  ["12%", "standard annual interest"],
  ["₹5L", "maximum loan amount"],
  ["365", "day tenure support"],
];

export function LandingStats() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map(([value, label]) => (
          <div key={label} className="px-3 py-4">
            <p className="text-3xl font-semibold text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
