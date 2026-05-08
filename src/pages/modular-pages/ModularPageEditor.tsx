import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModularPage } from '@/types/modular-page';
import { mockModularPages } from '@/data/mockModularPages';
import ModularPageManager from '@/components/modular-pages/ModularPageManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const createEmptyPage = (): ModularPage => ({
  id: `page-${Date.now()}`,
  slug: '',
  pageTitle: '',
  status: 'draft' as const,
  cardListing: {
    title: '',
    image: { url: '', alt: '' },
    shortDescription: '',
  },
  seo: {
    title: '',
    metaDescription: '',
  },
  blocks: [],
  relatedRouteIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const getInitialPage = (currentPageId?: string): ModularPage => {
  if (currentPageId === 'new') {
    return createEmptyPage();
  }

  const existingPage = mockModularPages.find((p) => p.id === currentPageId);
  return existingPage ? { ...existingPage } : createEmptyPage();
};

export default function ModularPageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState<ModularPage>(() => getInitialPage(pageId));

  useEffect(() => {
    setPage(getInitialPage(pageId));
  }, [pageId]);

  const handleSave = (updatedPage: ModularPage) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPage({ ...updatedPage, updatedAt: new Date().toISOString() });
      setIsLoading(false);
      // Show success message and optionally redirect
      alert('Página salva com sucesso!');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/modular-pages')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageId === 'new' ? 'Criar Nova Página' : 'Editar Página'}
          </h1>
        </div>

        {/* Editor */}
        <ModularPageManager
          page={page}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
