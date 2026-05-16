"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SliderWithInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    formatDisplay?: (v: number) => string;
    suffix?: string;
    disabled?: boolean;
    className?: string;
}

export function SliderWithInput({
    label,
    value,
    onChange,
    min,
    max,
    step,
    formatDisplay,
    suffix,
    disabled,
    className,
}: SliderWithInputProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseFloat(e.target.value.replace(/,/g, ""));
        if (isNaN(raw)) return;
        const clamped = Math.min(max, Math.max(min, raw));
        onChange(clamped);
    };

    const displayValue = formatDisplay ? formatDisplay(value) : String(value);

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="flex items-center gap-1">
                    <Input
                        type="text"
                        value={displayValue}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className="h-8 w-28 text-right text-sm font-semibold tabular-nums"
                        aria-label={label}
                    />
                    {suffix && (
                        <span className="text-xs text-muted-foreground shrink-0">{suffix}</span>
                    )}
                </div>
            </div>

            <Slider
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className="w-full"
                aria-label={label}
            />

            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatDisplay ? formatDisplay(min) : min}</span>
                <span>{formatDisplay ? formatDisplay(max) : max}</span>
            </div>
        </div>
    );
}