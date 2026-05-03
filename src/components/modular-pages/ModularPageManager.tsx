import React, { useState } from 'react';
import { ModularPage, ValidationErrors, validatePageForPublication, isPagePublishable } from '@/types/modular-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Save, Eye } from 'lucide-react';
import ModularPageEditor from './ModularPageEditor';
import { CardListingSection } from './sections/CardListingSection';
import { PageIdentitySection } from './sections/PageIdentitySection';
import { EcosystemLinksSection } from './sections/EcosystemLinksSection';

interface ModularPageManagerProps {
  page: ModularPage;
  onSave: (page: ModularPage) => void;
  isLoading?: boolean;
}

export default function ModularPageManager({ page, onSave, isLoading = false }: ModularPageManagerProps) {
  const [currentPage, setCurrentPage] = useState<ModularPage>(page);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleSave = () => {
    setValidationErrors({});
    onSave(currentPage);
  };

  const handleValidateForPublishing = () => {
    const errors = validatePageForPublication(currentPage);
    setValidationErrors(errors);

    if (isPagePublishable(currentPage)) {
      setCurrentPage({ ...currentPage, status: 'published' });
    }
  };

  const isValid = isPagePublishable(currentPage);

  return (
    <div className="space-y-8">
      {/* Publishing Status Alert */}
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erros de Validação</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              {Object.entries(validationErrors).map(([key, error]) => (
                <li key={key}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isValid && currentPage.status === 'published' && (
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Página Pronta para Publicar</AlertTitle>
          <AlertDescription className="text-green-700">
            Todos os campos obrigatórios foram preenchidos e a validação passou.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 sticky top-0 z-20 bg-white p-4 rounded-lg shadow-sm border">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Página'}
        </Button>

        <Button
          onClick={handleValidateForPublishing}
          disabled={isLoading}
          variant="outline"
          className="border-green-500 text-green-700 hover:bg-green-50"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Validar para Publicar
        </Button>

        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant="outline"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Ocultar' : 'Ver'} Pré-visualização
        </Button>
      </div>

      {/* Main Form */}
      <div className="space-y-8">
        {/* Secção 1: Card de Listagem */}
        <CardListingSection
          data={currentPage.cardListing}
          onChange={(cardListing) => setCurrentPage({ ...currentPage, cardListing })}
          errors={validationErrors as Record<string, string>}
        />

        {/* Secção 2: Identidade e SEO */}
        <PageIdentitySection
          page={currentPage}
          onChange={(updates) => setCurrentPage({ ...currentPage, ...updates })}
          errors={validationErrors as Record<string, string>}
        />

        {/* Secção 3: Page Builder */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-lg">Secção 3: O Construtor de Páginas</CardTitle>
            <CardDescription>
              {validationErrors.blocks ? (
                <span className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {validationErrors.blocks}
                </span>
              ) : (
                <span>
                  {currentPage.blocks.length} bloco{currentPage.blocks.length !== 1 ? 's' : ''} (Mínimo: 1)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModularPageEditor
              blocks={currentPage.blocks}
              onChange={(blocks) => setCurrentPage({ ...currentPage, blocks })}
            />
          </CardContent>
        </Card>

        {/* Secção 4: Ecosystem Links */}
        <EcosystemLinksSection
          relatedRouteIds={currentPage.relatedRouteIds || []}
          onChange={(relatedRouteIds) => setCurrentPage({ ...currentPage, relatedRouteIds })}
        />
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="border-t-2 pt-8">
          <h2 className="text-2xl font-bold mb-6">Pré-visualização</h2>
          <PreviewModularPage page={currentPage} />
        </div>
      )}

      {/* Save Button at Bottom */}
      <div className="flex gap-3 pt-6 border-t sticky bottom-0 bg-white p-4 rounded-lg shadow-sm">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Página'}
        </Button>

        {!isValid && (
          <Button
            onClick={handleValidateForPublishing}
            variant="outline"
            className="flex-1"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Verificar Validação
          </Button>
        )}
      </div>
    </div>
  );
}

// Preview Component
function PreviewModularPage({ page }: { page: ModularPage }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="p-8 space-y-8 bg-gray-50">
        {/* Hero Preview */}
        {page.blocks.find((b) => b.type === 'hero') && (
          <div className="relative w-full h-64 bg-gray-300 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold">{page.pageTitle}</h1>
              </div>
            </div>
          </div>
        )}

        {!page.blocks.find((b) => b.type === 'hero') && (
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.pageTitle}</h1>
            <p className="text-gray-600">{page.cardListing.shortDescription}</p>
          </div>
        )}

        {/* Content Preview */}
        <div className="bg-white p-8 rounded-lg space-y-6">
          {page.blocks.map((block, index) => (
            <div key={block.id} className="border-b pb-6 last:border-b-0">
              <p className="text-xs text-gray-500 font-semibold mb-2">Bloco {index + 1}: {block.type}</p>
              {block.type === 'text' && <div className="text-gray-700">Bloco de Texto</div>}
              {block.type === 'image' && (
                <img src={(block as any).media.url} alt="Pré-visualização" className="w-full h-40 object-cover rounded" />
              )}
              {block.type === 'hero' && (
                <div className="bg-gray-100 h-32 flex items-center justify-center rounded">
                  <div className="text-center">
                    <p className="font-bold">{(block as any).title}</p>
                    <p className="text-sm text-gray-600">{(block as any).subtitle}</p>
                  </div>
                </div>
              )}
              {block.type === 'accordion' && (
                <div className="space-y-2">
                  {(block as any).items.map((item: any, i: number) => (
                    <div key={i} className="border rounded p-3">
                      <p className="font-semibold text-sm">{item.question}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Card Preview */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img
            src={page.cardListing.image?.url}
            alt={page.cardListing.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-gray-900">{page.cardListing.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{page.cardListing.shortDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
