import { WizardProvider, useWizard } from "@/contexts/WizardContext";
import { WizardProgress } from "@/components/routes/wizard/WizardProgress";
import { Step1BasicInfo } from "@/components/routes/wizard/Step1BasicInfo";
import { Step2TechnicalInfo } from "@/components/routes/wizard/Step2TechnicalInfo";

const CreateRouteContent = () => {
  const { currentStep } = useWizard();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Route</h1>
        <p className="text-muted-foreground">
          Follow the 4-step wizard to create a complete route with all necessary information
        </p>
      </div>

      <WizardProgress currentStep={currentStep} totalSteps={4} />

      <div className="bg-card rounded-lg shadow-sm border p-8">
        {currentStep === 1 && <Step1BasicInfo />}
        {currentStep === 2 && <Step2TechnicalInfo />}
        {currentStep === 3 && <div className="text-center text-muted-foreground">Step 3 - Coming Soon</div>}
        {currentStep === 4 && <div className="text-center text-muted-foreground">Step 4 - Coming Soon</div>}
      </div>
    </div>
  );
};

export const CreateRoute = () => {
  return (
    <WizardProvider>
      <CreateRouteContent />
    </WizardProvider>
  );
};
