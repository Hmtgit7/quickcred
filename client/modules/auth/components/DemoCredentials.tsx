import { UserRoundCheck } from "lucide-react";

interface DemoCredentialsProps {
  onFill: (email: string, password: string) => void;
}

const DEMO_ROLES = [
  { label: "Admin", email: "admin@quickcred.com", password: "Admin@123" },
  { label: "Sales", email: "sales@quickcred.com", password: "Sales@123" },
  { label: "Sanction", email: "sanction@quickcred.com", password: "Sanction@123" },
  { label: "Disbursement", email: "disburse@quickcred.com", password: "Disburse@123" },
  { label: "Collection", email: "collection@quickcred.com", password: "Collect@123" },
  { label: "Borrower", email: "borrower@quickcred.com", password: "Borrow@123" },
] as const;

export function DemoCredentials({ onFill }: DemoCredentialsProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/25 p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
        <UserRoundCheck className="h-3.5 w-3.5" />
        Demo access
      </p>
      <div className="flex flex-wrap gap-2">
        {DEMO_ROLES.map(({ label, email, password }) => (
          <button
            key={label}
            type="button"
            onClick={() => onFill(email, password)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
