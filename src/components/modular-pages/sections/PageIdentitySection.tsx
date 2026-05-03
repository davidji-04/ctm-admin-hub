import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle} from 'lucide-react';
import { ModularPage, PublicationStatus, SEOData, MediaItem } from '@/types/modular-page';
import { ImageUpload } from '@/components/routes/wizard/ImageUpload';

interface PageIdentitySectionProps {
  page: ModularPage;
  onChange: (updates: Partial<ModularPage>) => void;
  errors?: Record<string, string>;
  onSlugGenerate?: (title: string) => string;
}

export function PageIdentitySection({
  page,
  onChange,
  errors = {},
  onSlugGenerate,
}: PageIdentitySectionProps) {
  const generateSlugFromTitle = (title: string): string => {
    if (onSlugGenerate) return onSlugGenerate(title);
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    const newSlug = generateSlugFromTitle(title);
    onChange({
      pageTitle: title,
      slug: newSlug,
    });
  };

  const handleSeoUpdate = (field: keyof SEOData, value: string) => {
    onChange({
      seo: {
        ...page.seo,
        [field]: value,
      },
    });
  };

  const handleOgImageUpdate = (field: keyof MediaItem, value: string) => {
    const ogImage = page.seo.ogImage || { url: '', alt: '' };
    onChange({
      seo: {
        ...page.seo,
        ogImage: {
          ...ogImage,
          [field]: value,
        },
      },
    });
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="text-lg">Secção 2: Identidade da Página e SEO</CardTitle>
        <CardDescription>
          Configure os dados essenciais e otimização para motores de busca
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título Principal da Página <span className="text-red-500">*</span>
          </label>
          <Input
            value={page.pageTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex: Guia Completo das Melhores Trilhas"
            className={errors.pageTitle ? 'border-red-500' : ''}
          />
          {errors.pageTitle && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.pageTitle}
            </div>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slug (URL) <span className="text-red-500">*</span>
            <span className="block text-xs font-normal text-gray-500 mt-1">Auto-gerado, mas editável</span>
          </label>
          <Input
            value={page.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            placeholder="guia-completo-trilhas"
            className={errors.slug ? 'border-red-500' : ''}
          />
          {errors.slug && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.slug}
            </div>
          )}
        </div>

        {/* Publication Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado de Publicação
          </label>
          <Select value={page.status} onValueChange={(value) => onChange({ status: value as PublicationStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SEO Block */}
        <div className="border-t pt-6 space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            Bloco SEO
          </h4>

          {/* SEO Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SEO Title <span className="text-red-500">*</span>
              <span className="block text-xs font-normal text-gray-500 mt-1">Recomendado: 50-60 caracteres</span>
            </label>
            <Input
              value={page.seo.title}
              onChange={(e) => handleSeoUpdate('title', e.target.value)}
              placeholder="SEO Title | Slogan - Website"
              maxLength={60}
              className={errors.seoTitle ? 'border-red-500' : ''}
            />
            <div className="text-xs text-gray-500 mt-1">{page.seo.title.length} caracteres</div>
            {errors.seoTitle && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.seoTitle}
              </div>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Description <span className="text-red-500">*</span>
              <span className="block text-xs font-normal text-gray-500 mt-1">Recomendado: 150-160 caracteres</span>
            </label>
            <Textarea
              value={page.seo.metaDescription}
              onChange={(e) => handleSeoUpdate('metaDescription', e.target.value)}
              placeholder="Descrição meta que aparece nos resultados de busca..."
              maxLength={160}
              className={`min-h-[80px] ${errors.metaDescription ? 'border-red-500' : ''}`}
            />
            <div className="text-xs text-gray-500 mt-1">{page.seo.metaDescription.length} caracteres</div>
            {errors.metaDescription && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.metaDescription}
              </div>
            )}
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagem de Partilha (OG Image)
              <span className="block text-xs font-normal text-gray-500 mt-1">
                Opcional - Fallback automático para a imagem do card
              </span>
            </label>

            <ImageUpload
              value={page.seo.ogImage?.url ? { url: page.seo.ogImage.url, id: `og-${Date.now()}` } : null}
              onChange={(file) => {
                if (file) {
                  handleOgImageUpdate('url', file.url);
                }
              }}
              label=""
              description=""
            />

            <Input
              value={page.seo.ogImage?.alt || ''}
              onChange={(e) => handleOgImageUpdate('alt', e.target.value)}
              placeholder="Descrição da imagem"
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
