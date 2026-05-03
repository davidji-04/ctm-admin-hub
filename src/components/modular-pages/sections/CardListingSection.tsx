import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { CardListingData, MediaItem } from '@/types/modular-page';
import { ImageUpload } from '@/components/routes/wizard/ImageUpload';

interface CardListingSectionProps {
  data: CardListingData;
  onChange: (data: CardListingData) => void;
  errors?: Record<string, string>;
}

export function CardListingSection({ data, onChange, errors = {} }: CardListingSectionProps) {
  const handleMediaUpdate = (field: keyof MediaItem, value: string) => {
    onChange({
      ...data,
      image: {
        ...data.image,
        [field]: value,
      },
    });
  };

  const MAX_DESCRIPTION_CHARS = 150;
  const charsRemaining = MAX_DESCRIPTION_CHARS - (data.shortDescription?.length || 0);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="text-lg">Secção 1: Card de Listagem</CardTitle>
        <CardDescription>
          Configure os dados para criar cards que redirecionam para esta página modular
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Card Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título do Card <span className="text-red-500">*</span>
          </label>
          <Input
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Ex: Guia de Trilhas"
            className={errors.cardTitle ? 'border-red-500' : ''}
          />
          {errors.cardTitle && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.cardTitle}
            </div>
          )}
        </div>

        {/* Card Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imagem do Card (Thumbnail) <span className="text-red-500">*</span>
          </label>

          <ImageUpload
            value={data.image?.url ? { url: data.image.url, id: `card-img-${Date.now()}` } : null}
            onChange={(file) => {
              if (file) {
                handleMediaUpdate('url', file.url);
              }
            }}
            label=""
            description=""
          />

          {errors.cardImage && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.cardImage}
            </div>
          )}

          <Input
            value={data.image?.alt || ''}
            onChange={(e) => handleMediaUpdate('alt', e.target.value)}
            placeholder="Texto alternativo (acessibilidade)"
            className="mt-2"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descrição Curta <span className="text-red-500">*</span>
            <span className="block text-xs font-normal text-gray-500 mt-1">
              Máximo {MAX_DESCRIPTION_CHARS} caracteres
            </span>
          </label>
          <Textarea
            value={data.shortDescription}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESCRIPTION_CHARS) {
                onChange({ ...data, shortDescription: e.target.value });
              }
            }}
            placeholder="Introdução breve do card que aparecerá nos listings..."
            maxLength={MAX_DESCRIPTION_CHARS}
            className={`min-h-[80px] ${errors.shortDescription ? 'border-red-500' : ''}`}
          />
          <div className="flex items-center justify-between mt-2">
            <div className={`text-xs ${charsRemaining < 10 ? 'text-orange-600' : 'text-gray-500'}`}>
              {charsRemaining} caracteres restantes
            </div>
            {errors.shortDescription && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.shortDescription}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
