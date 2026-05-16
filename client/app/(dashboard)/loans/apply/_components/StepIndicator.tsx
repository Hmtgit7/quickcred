import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: number;
    label: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <nav aria-label="Application steps" className="mb-8">
            <ol className="flex items-center gap-0">
                {steps.map((step, idx) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isLast = idx === steps.length - 1;

                    return (
                        <li key={step.id} className="flex flex-1 items-center last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                                        isCompleted
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : isCurrent
                                                ? "border-primary text-primary bg-background"
                                                : "border-border text-muted-foreground bg-background"
                                    )}
                                    aria-current={isCurrent ? "step" : undefined}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <span>{step.id}</span>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-xs font-medium whitespace-nowrap",
                                        isCurrent ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors",
                                        isCompleted ? "bg-primary" : "bg-border"
                                    )}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}