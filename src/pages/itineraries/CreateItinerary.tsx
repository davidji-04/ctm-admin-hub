import { useState } from 'react';
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
import { toast } from 'sonner';

const CreateItinerary = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const steps = [
    { number: 1, title: 'Selecionar Cliente', description: 'Escolha o cliente para este roteiro' },
    { number: 2, title: 'Selecionar Percurso', description: 'Escolha o percurso premium base' },
    { number: 3, title: 'Detalhes do Roteiro', description: 'Configure os detalhes principais' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create itinerary
      toast.success('Roteiro premium criado com sucesso!');
      navigate('/itineraries');
    }
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selecionar Cliente</h3>
                <p className="text-muted-foreground">
                  Selecione o cliente para quem este roteiro será criado. O sistema
                  considerará as capacidades físicas e preferências do cliente.
                </p>
                {/* Add client selector component here */}
                <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                  Seletor de clientes será implementado aqui
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selecionar Percurso Premium</h3>
                <p className="text-muted-foreground">
                  Selecione o percurso premium base. Apenas percursos categorizados como
                  'Premium' podem ser usados para roteiros premium.
                </p>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-500">
                    <strong>RN-003:</strong> Roteiros premium só podem ser criados a partir
                    de percursos categorizados como 'Premium'. Se o percurso desejado é
                    'Free', duplique-o e altere a categoria primeiro.
                  </p>
                </div>
                {/* Add route selector component here */}
                <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                  Seletor de percursos premium será implementado aqui
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detalhes do Roteiro</h3>
                <p className="text-muted-foreground">
                  Configure os detalhes principais do roteiro, incluindo título, datas
                  e informações adicionais.
                </p>
                {/* Add details form here */}
                <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                  Formulário de detalhes será implementado aqui
                </div>
              </div>
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
