import { WizardProvider, useWizard } from "@/contexts/WizardContext";
import { WizardProgress } from "@/components/routes/wizard/WizardProgress";
import { Step1BasicInfo } from "@/components/routes/wizard/Step1BasicInfo";
import { Step2TechnicalInfo } from "@/components/routes/wizard/Step2TechnicalInfo";
import { Step3EditorialContent } from "@/components/routes/wizard/Step3EditorialContent";
import { Step4Media } from "@/components/routes/wizard/Step4Media";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CreateRouteContent = () => {
  const { currentStep, wizardData, updateWizardData } = useWizard();
  const { routeId } = useParams<{ routeId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!routeId;

  useEffect(() => {
    if (isEditMode && routeId) {
      loadRouteData(routeId);
    }
  }, [routeId, isEditMode]);

  const loadRouteData = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock API call to load route data
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data - in production this would come from API
      const mockRouteData = {
        routeId: id,
        step1: {
          title: 'Caminho Português',
          localidade_pais: 'PT',
          categoria: 'premium' as const,
          modalidade: ['a_pe'],
          dificuldade_geral: 'media' as const,
          status: 'ativo' as const,
        },
        step2: {
          distancia_total: 245.5,
          elevacao_altimetria: 2340,
          tipo_terreno: 'mixed',
        },
        step3: {
          descricao: 'Historic pilgrimage route through Portugal...',
          historia_percurso: '',
          destaques_unicos: '',
          experiencia_cultural: '',
          desafios_esperados: '',
          certificacoes: '',
          relatos_equipe: '',
        },
        step4: {
          heroImage: null,
          gallery: [],
          gpxFile: null,
        },
      };

      // Prefill wizard data
      updateWizardData('routeId', mockRouteData.routeId);
      updateWizardData('step1', mockRouteData.step1);
      updateWizardData('step2', mockRouteData.step2);
      updateWizardData('step3', mockRouteData.step3);
      updateWizardData('step4', mockRouteData.step4);
    } catch (error) {
      console.error('Failed to load route data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading route data...</p>
        </div>
      </div>
    );

  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isEditMode ? 'Edit Route' : 'Create New Route'}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? 'Update route information across all steps'
            : 'Follow the 4-step wizard to create a complete route with all necessary information'}
        </p>
      </div>

      <WizardProgress currentStep={currentStep} totalSteps={4} />

      <div className="bg-card rounded-lg shadow-sm border p-8">
        {currentStep === 1 && <Step1BasicInfo />}
        {currentStep === 2 && <Step2TechnicalInfo />}
        {currentStep === 3 && <Step3EditorialContent />}
        {currentStep === 4 && <Step4Media />}
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
