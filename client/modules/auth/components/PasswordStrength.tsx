import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

const RULES = [
  { id: "length", label: "8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "Special", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
] as const;

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const passed = RULES.filter((rule) => rule.test(password)).length;
  const tone = passed <= 2 ? "bg-destructive" : passed <= 3 ? "bg-chart-2" : "bg-chart-4";

  return (
    <div className="mt-3 space-y-3 rounded-lg bg-muted/25 p-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <span key={step} className={cn("h-1 flex-1 rounded-full", step <= passed ? tone : "bg-muted")} />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          const Icon = ok ? CheckCircle2 : XCircle;
          return (
            <li key={rule.id} className="flex items-center gap-1.5 text-xs">
              <Icon className={cn("h-3.5 w-3.5", ok ? "text-chart-4" : "text-muted-foreground")} />
              <span className={ok ? "text-foreground" : "text-muted-foreground"}>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
