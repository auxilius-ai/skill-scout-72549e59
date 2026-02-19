import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-8">
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isComplete
                    ? "bg-step-complete text-success-foreground"
                    : isActive
                    ? "bg-step-active text-primary-foreground shadow-md"
                    : "bg-step-inactive text-muted-foreground"
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mt-[-18px] rounded transition-colors duration-300 ${
                  i < currentStep ? "bg-step-complete" : "bg-step-inactive"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
