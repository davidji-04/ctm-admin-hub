import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ClientSelector } from '@/components/itineraries/ClientSelector';
import { RouteSelector } from '@/components/itineraries/RouteSelector';
import { ItineraryDetailsForm } from '@/components/itineraries/ItineraryDetailsForm';
import { toast } from 'sonner';
import { SHARED_MOCK_CLIENTS, SHARED_MOCK_ROUTE_OPTIONS } from '@/data/mockData';

 const getClientName = (id?: string) => {
    if (!id) return undefined;
    return SHARED_MOCK_CLIENTS.find((c) => c.id === id)?.name;
  };
  
  const getRouteName = (id?: string) => {
    if (!id) return undefined;
    return SHARED_MOCK_ROUTE_OPTIONS.find((r) => r.id === id)?.name;
  };

const CreateItinerary = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState<string>();
  const [selectedRouteId, setSelectedRouteId] = useState<string>();
  const detailsFormRef = useRef<HTMLFormElement>(null);
  const totalSteps = 3;


  const steps = [
    { number: 1, title: 'Selecionar Cliente', description: 'Escolha o cliente para este roteiro' },
    { number: 2, title: 'Selecionar Percurso', description: 'Escolha o percurso premium base' },
    { number: 3, title: 'Detalhes do Roteiro', description: 'Configure os detalhes principais' },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedClientId) {
      toast.error('Por favor, selecione um cliente');
      return;
    }
    if (currentStep === 2 && !selectedRouteId) {
      toast.error('Por favor, selecione um percurso premium');
      return;
    }
    if (currentStep === 3) {
      // Trigger form submission
      const submitButton = document.getElementById('details-form-submit');
      submitButton?.click();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleDetailsSubmit = (data: any) => {
    console.log('Creating itinerary:', {
      clientId: selectedClientId,
      routeId: selectedRouteId,
      ...data,
    });
    toast.success('Roteiro premium criado com sucesso!');
    navigate('/itineraries');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/itineraries');
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/itineraries')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Criar Roteiro Premium</h1>
          <p className="text-muted-foreground mt-1">
            Assistente de criação de roteiro personalizado
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Passo {currentStep} de {totalSteps}</CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% concluído
              </div>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep > step.number
                        ? 'bg-primary border-primary text-primary-foreground'
                        : currentStep === step.number
                        ? 'border-primary text-primary'
                        : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-colors ${
                      currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[400px] py-8">
            {currentStep === 1 && (
              <ClientSelector
                selectedClientId={selectedClientId}
                onClientSelect={setSelectedClientId}
              />
            )}

            {currentStep === 2 && (
              <RouteSelector
                selectedRouteId={selectedRouteId}
                onRouteSelect={setSelectedRouteId}
              />
            )}

            {currentStep === 3 && (
              <>
                <ItineraryDetailsForm
                  clientName={getClientName(selectedClientId)}
                  routeName={getRouteName(selectedRouteId)}
                  onSubmit={handleDetailsSubmit}
                />
                <button id="details-form-submit" type="submit" className="hidden" />
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Criar Roteiro
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateItinerary;
