import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export type Step = {
  id: number;
  name: string;
  status: "complete" | "current" | "upcoming";
};

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                  step.status === "complete" && "bg-primary text-white",
                  step.status === "current" && "bg-primary-100 text-primary border-2 border-primary-300",
                  step.status === "upcoming" && "bg-gray-200 text-gray-400"
                )}
              >
                {step.status === "complete" ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <span 
                className={cn(
                  "text-sm font-medium mt-2",
                  step.status === "complete" && "text-primary",
                  step.status === "current" && "text-primary",
                  step.status === "upcoming" && "text-gray-400"
                )}
              >
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-200 mx-2 w-full min-w-[3rem]">
                  <div 
                    className={cn(
                      "h-full bg-primary-500",
                      currentStep > index + 1 ? "w-full" : "w-0"
                    )}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
