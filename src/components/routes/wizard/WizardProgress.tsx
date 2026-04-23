import { Progress } from "@/components/ui/progress";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const WizardProgress = ({ currentStep, totalSteps }: WizardProgressProps) => {
  const allSteps = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Technical" },
    { number: 3, label: "Localities" },
    { number: 4, label: "Editorial" },
    { number: 5, label: "Media" },
  ];
  const steps = allSteps.slice(0, totalSteps);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center min-w-[100px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors border-2 ${
                    isActive || isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-muted border-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};