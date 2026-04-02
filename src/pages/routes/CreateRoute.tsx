import { WizardProvider, useWizard } from "@/contexts/WizardContext";
import { WizardProgress } from "@/components/routes/wizard/WizardProgress";
import { Step1BasicInfo } from "@/components/routes/wizard/Step1BasicInfo";
import { Step2TechnicalInfo } from "@/components/routes/wizard/Step2TechnicalInfo";
import { Step3Localities } from "@/components/routes/wizard/Step3Localities";
import { Step4EditorialContent } from "@/components/routes/wizard/Step4EditorialContent";
import { Step5Media } from "@/components/routes/wizard/Step5Media";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SHARED_MOCK_ROUTES } from "@/data/mockData";

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
      await new Promise((resolve) => setTimeout(resolve, 800));
 
      const found = SHARED_MOCK_ROUTES.find((r) => r.id.toString() === id);
 
      if (!found) {
        console.warn(`Route ${id} not found in mock data`);
        return;
      }
 
      updateWizardData('routeId', found.id.toString());
      updateWizardData('step1', {
        title: found.title,
        localidade_pais: found.country === 'Portugal' ? 'PT' : found.country,
        categoria: found.category as 'free' | 'premium',
        modalidade: found.modality === 'bike' ? ['bicicleta'] : ['a_pe'],
        dificuldade_geral:
          found.difficulty === 'easy'
            ? 'facil'
            : found.difficulty === 'hard'
              ? 'dificil'
              : ('media' as 'facil' | 'media' | 'dificil'),
        status:
          found.status === 'active'
            ? 'ativo'
            : found.status === 'draft'
              ? 'rascunho'
              : ('inativo' as 'ativo' | 'rascunho' | 'inativo'),
      });
      updateWizardData('step2', {
        distancia_total: Number.parseFloat(found.distance.replace(' km', '')) || 0,
        elevacao_altimetria: undefined,
        tipo_terreno: 'mixed',
      });
      updateWizardData('step3', {
        descricao: `Detalhes do percurso ${found.title}.`,
        historia_percurso: '',
        destaques_unicos: '',
        experiencia_cultural: '',
        desafios_esperados: '',
        certificacoes: '',
        relatos_equipe: '',
      });
      updateWizardData('step4', {
        heroImage: null,
        gallery: [],
        gpxFile: found.gpxUrl ?? null,
      });
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
            : 'Follow the 5-step wizard to create a complete route with all necessary information'}
        </p>
      </div>

      <WizardProgress currentStep={currentStep} totalSteps={5} />

      <div className="bg-card rounded-lg shadow-sm border p-8">
        {currentStep === 1 && <Step1BasicInfo />}
        {currentStep === 2 && <Step2TechnicalInfo />}
        {currentStep === 3 && <Step3Localities />}
        {currentStep === 4 && <Step4EditorialContent />}
        {currentStep === 5 && <Step5Media />}
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
