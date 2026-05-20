"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "./StepIndicator";
import { StepPersonalDetails } from "./StepPersonalDetails";
import { StepUploadSlip } from "./StepUploadSlip";
import { StepLoanConfig } from "./StepLoanConfig";
import { ROUTES } from "@/constants/routes";
import type { Document } from "@/types/document.types";

const STEPS = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Salary Slip" },
  { id: 3, label: "Loan Config" },
];

export function LoanApplyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDoc, setUploadedDoc] = useState<Document | null>(null);
  const router = useRouter();

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const goBack = () => {
    if (currentStep === 1) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {currentStep === 1 && <StepPersonalDetails onNext={goNext} />}

        {currentStep === 2 && (
          <StepUploadSlip
            onNext={(doc) => {
              setUploadedDoc(doc);
              goNext();
            }}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <StepLoanConfig
            onBack={goBack}
            salarySlipDocId={uploadedDoc?._id}
          />
        )}
      </CardContent>
    </Card>
  );
}