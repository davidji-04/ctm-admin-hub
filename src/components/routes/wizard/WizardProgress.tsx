import { Progress } from "@/components/ui/progress";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const WizardProgress = ({ currentStep, totalSteps }: WizardProgressProps) => {
  const steps = [
    { number: 1, label: "Basic Information" },
    { number: 2, label: "Technical Info" },
    { number: 3, label: "Editorial Content" },
    { number: 4, label: "Media" },
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step.number === currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.number < currentStep
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm mt-2 font-medium ${
                  step.number === currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: step.number < currentStep ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
