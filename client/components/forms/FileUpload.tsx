"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FILE_UPLOAD_CONSTANTS } from "@/constants/app.constants";

interface FileUploadProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    disabled?: boolean;
    error?: string;
}

export function FileUpload({ value, onChange, disabled, error }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const validate = (file: File): string | null => {
        if (!FILE_UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.type as never)) {
            return `Only PDF, JPG, and PNG files are allowed.`;
        }
        if (file.size > FILE_UPLOAD_CONSTANTS.MAX_SIZE_BYTES) {
            return `File must be under ${FILE_UPLOAD_CONSTANTS.MAX_SIZE_LABEL}.`;
        }
        return null;
    };

    const handleFile = useCallback(
        (file: File | null) => {
            setLocalError(null);
            if (!file) { onChange(null); return; }
            const err = validate(file);
            if (err) { setLocalError(err); return; }
            onChange(file);
        },
        [onChange]
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const file = e.dataTransfer.files[0] ?? null;
            handleFile(file);
        },
        [disabled, handleFile]
    );

    const displayError = error ?? localError;

    if (value) {
        return (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{value.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(value.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleFile(null)}
                        disabled={disabled}
                        aria-label="Remove file"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label="Upload file — click or drag and drop"
                className={cn(
                    "relative rounded-xl border-2 border-dashed transition-colors cursor-pointer",
                    "flex flex-col items-center justify-center py-10 px-6 text-center",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/30",
                    disabled && "pointer-events-none opacity-60",
                    displayError && "border-destructive/60"
                )}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
            >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG · Max {FILE_UPLOAD_CONSTANTS.MAX_SIZE_LABEL}
                </p>

                <input
                    ref={inputRef}
                    type="file"
                    accept={FILE_UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS}
                    className="sr-only"
                    disabled={disabled}
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    aria-hidden="true"
                />
            </div>

            {displayError && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {displayError}
                </p>
            )}
        </div>
    );
}