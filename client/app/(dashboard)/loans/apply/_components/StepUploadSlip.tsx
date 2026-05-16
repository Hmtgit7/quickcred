"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/forms/FileUpload";
import { useUploadDocument } from "@/modules/documents/hooks/useUploadDocument";
import type { Document } from "@/types/document.types";

interface StepUploadSlipProps {
  onNext: (document: Document) => void;
  onBack: () => void;
}

export function StepUploadSlip({ onNext, onBack }: StepUploadSlipProps) {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: upload, isPending } = useUploadDocument();

  const handleSubmit = () => {
    if (!file) return;
    upload(file, { onSuccess: (doc) => onNext(doc) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Upload Salary Slip</h3>
        <p className="text-xs text-muted-foreground">
          Upload your latest salary slip to verify your income. Accepted: PDF, JPG, PNG · Max 5 MB.
        </p>
      </div>

      <FileUpload
        value={file}
        onChange={setFile}
        disabled={isPending}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={handleSubmit}
          disabled={!file || isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Uploading…" : "Upload & Continue"}
        </Button>
      </div>
    </div>
  );
}