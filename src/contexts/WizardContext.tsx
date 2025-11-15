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
  };
  step4?: {
    heroImage: { id: string; url: string } | null;
    gallery: Array<{ id: string; url: string }>;
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
