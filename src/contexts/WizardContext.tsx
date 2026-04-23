import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WizardData {
  routeId?: string;
  step1?: {
    title: string;
    localidade_pais: string;
    categoria: 'free' | 'premium';
    modalidade: string[];
    dificuldade_geral: 'facil' | 'media' | 'dificil';
    status: 'rascunho' | 'ativo' | 'inativo';
  };
  step2?: {
    distancia_total?: number;
    elevacao_altimetria?: number;
    tipo_terreno: string;
    altura_max_veiculo?: number;
  };
  step3?: {
    descricao: string;
    historia_percurso?: string;
    destaques_unicos?: string;
    experiencia_cultural?: string;
    desafios_esperados?: string;
    certificacoes?: string;
    relatos_equipe?: string;
    gpxFile?: {
      id: string;
      url: string;
      name: string;
      metadata?: {
        waypoints: number;
        distance?: number;
        elevation?: number;
      };
    } | null;
  };
  step4?: {
    mediaPrincipalUrl?: string;
    publicTitle: string;
    publicLead: string;
    introSectionTitle: string;
    introDescription: string;
    visualHighlightImageUrl?: string;
    impactText?: string;
    quickHighlights: Array<{
      icon: 'compass' | 'moose' | 'mountain' | 'map-pin' | 'alert' | 'info';
      label: string;
      value: string;
    }>;
    nationalMapImageUrl?: string;
    technicalDistanceKm?: number;
    technicalAltimetryM?: number;
    technicalDuration?: string;
    technicalDifficulty?: 'facil' | 'moderado' | 'dificil';
    routeGpxUrl?: string;
    itinerary: Array<{
      dayTitle: string;
      startPoint: string;
      endPoint: string;
      stageDistanceKm?: number;
      stageNotes?: string;
    }>;
    recommendedSeason?: string;
    accommodationAndSupply?: string;
    arrivalLogistics?: string;
    curiosities: Array<{
      imageUrl?: string;
      title: string;
      text: string;
    }>;
    etiquetteRules: Array<{
      icon: 'compass' | 'moose' | 'mountain' | 'map-pin' | 'alert' | 'info';
      title: string;
      description: string;
    }>;
    seasonalAlertEnabled: boolean;
    seasonalAlertTitle?: string;
    seasonalAlertMessage?: string;
    lifestyleGalleryUrls: string[];
    prepManualPdfUrl?: string;
    equipmentChecklistPdfUrl?: string;
    essentialEquipment: string[];
    calendarPrices: Array<{
      startDate: string;
      endDate: string;
      status: 'disponivel' | 'ultimas-vagas' | 'esgotado';
      pricePerPerson: number;
      includes?: string;
    }>;
    extras: Array<{
      thumbnailUrl?: string;
      name: string;
      additionalPrice: number;
    }>;
    leadEmail: string;
  };
}

interface WizardContextType {
  wizardData: WizardData;
  updateWizardData: (step: keyof WizardData, data: any) => void;
  resetWizard: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateWizardData = (step: keyof WizardData, data: any) => {
    setWizardData(prev => ({ ...prev, [step]: data }));
  };

  const resetWizard = () => {
    setWizardData({});
    setCurrentStep(1);
  };

  return (
    <WizardContext.Provider value={{ wizardData, updateWizardData, resetWizard, currentStep, setCurrentStep }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
};
