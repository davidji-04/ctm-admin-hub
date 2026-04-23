import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check } from 'lucide-react';

// ─── TIPOS ──────────────────────────────────────────────────────────────────

export type PublicationStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface ArticleSeoControls {
  // Estado e datas
  status: PublicationStatus;
  publishedAt: string;       // ISO date string
  // Controlos editoriais
  featured: boolean;
  featuredOrder: number | '';
  commentsActive: boolean;
  // SEO
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  indexing: 'index' | 'noindex';
}

interface ArticleSeoTabProps {
  data: ArticleSeoControls;
  onChange: (data: ArticleSeoControls) => void;
  // Para pré-visualizar as contagens de SEO
  articleTitle: string;
}

// ─── COMPONENTE: Toggle visual ───────────────────────────────────────────────

function Toggle({
  value,
  onChange,
  label,
  description,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => onChange(!value)}
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
          value ? 'bg-[#0e0e0e]' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
}

// ─── COMPONENTE: Contador de caracteres SEO ──────────────────────────────────

function SeoCounter({
  value,
  min,
  max,
  label,
}: {
  value: string;
  min: number;
  max: number;
  label: string;
}) {
  const len = value.length;
  const tooShort = len < min && len > 0;
  const tooLong = len > max;
  const good = len >= min && len <= max;

  return (
    <div className="flex items-center justify-end gap-2 text-xs">
      {len > 0 && good && <Check className="w-3 h-3 text-green-500" />}
      {(tooShort || tooLong) && <AlertCircle className="w-3 h-3 text-amber-500" />}
      <span
        className={`font-mono ${
          tooLong ? 'text-red-500' : tooShort ? 'text-amber-500' : good ? 'text-green-600' : 'text-gray-400'
        }`}
      >
        {len}/{max}
      </span>
      {tooShort && <span className="text-amber-500">mín. {min}</span>}
      {tooLong && <span className="text-red-500">máx. {max}</span>}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function ArticleSeoTab({
  data,
  onChange,
  articleTitle,
}: ArticleSeoTabProps) {
  const set = (field: keyof ArticleSeoControls, value: any) =>
    onChange({ ...data, [field]: value });

  const statusOptions: { value: PublicationStatus; label: string; color: string }[] = [
    { value: 'draft',     label: 'Rascunho',  color: 'bg-gray-200 text-gray-700 border-gray-300' },
    { value: 'scheduled', label: 'Agendado',  color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { value: 'published', label: 'Publicado', color: 'bg-green-100 text-green-800 border-green-400' },
    { value: 'archived',  label: 'Arquivado', color: 'bg-red-50 text-red-700 border-red-300' },
  ];

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════
          1. ESTADO E DATA DE PUBLICAÇÃO
      ══════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold uppercase tracking-widest text-gray-500">
            1. Estado e Publicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Estado da Publicação <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set('status', opt.value)}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all ${
                    data.status === opt.value
                      ? `${opt.color} border-current scale-[1.02] shadow-sm`
                      : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data de publicação */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">
              Data de Publicação{' '}
              {(data.status === 'published' || data.status === 'scheduled') && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <Input
              type="datetime-local"
              value={data.publishedAt}
              onChange={(e) => set('publishedAt', e.target.value)}
              className="max-w-xs"
            />
            {data.status === 'scheduled' && !data.publishedAt && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Define uma data para agendar a publicação.
              </p>
            )}
          </div>

        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          2. CONTROLOS EDITORIAIS
      ══════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold uppercase tracking-widest text-gray-500">
            2. Controlos Editoriais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <Toggle
            value={data.featured}
            onChange={(v) => set('featured', v)}
            label="Artigo em Destaque"
            description="Aparece na posição de hero na listagem do blog."
          />

          {/* Ordem de destaque — só visível se featured = true */}
          {data.featured && (
            <div className="space-y-1 pl-4 border-l-2 border-[#0e0e0e]">
              <label className="text-sm font-semibold">Ordem de Destaque</label>
              <Input
                type="number"
                min={1}
                placeholder="Ex: 1 (mais prioritário)"
                value={data.featuredOrder}
                onChange={(e) =>
                  set('featuredOrder', e.target.value ? Number(e.target.value) : '')
                }
                className="max-w-[180px]"
              />
              <p className="text-xs text-gray-400">
                Número mais baixo = mais prioritário.
              </p>
            </div>
          )}

          <Toggle
            value={data.commentsActive}
            onChange={(v) => set('commentsActive', v)}
            label="Comentários Ativos"
            description="Permite que os leitores comentem neste artigo."
          />

        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          3. SEO
      ══════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold uppercase tracking-widest text-gray-500">
            3. SEO e Visibilidade Google
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* SEO Title */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">
              SEO Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={articleTitle || 'Título para o Google (50–60 caracteres)'}
              value={data.seoTitle}
              onChange={(e) => set('seoTitle', e.target.value)}
            />
            <SeoCounter value={data.seoTitle} min={30} max={60} label="SEO Title" />
          </div>

          {/* Meta Description */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">
              Meta Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Descrição para o Google (120–160 caracteres)..."
              value={data.metaDescription}
              onChange={(e) => set('metaDescription', e.target.value)}
              className="w-full p-3 border rounded-md text-sm min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
            <SeoCounter
              value={data.metaDescription}
              min={120}
              max={160}
              label="Meta Description"
            />
          </div>

          {/* Pré-visualização SERP */}
          {(data.seoTitle || data.metaDescription) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Pré-visualização Google (SERP)
              </p>
              <p className="text-[#1a0dab] text-lg font-normal leading-tight hover:underline cursor-pointer">
                {data.seoTitle || articleTitle || 'Título do artigo'}
              </p>
              <p className="text-[#006621] text-sm">
                cheirodeterramolhada.pt/blog/{data.seoTitle ? data.seoTitle.toLowerCase().replace(/\s+/g, '-') : '...'}
              </p>
              <p className="text-[#545454] text-sm leading-snug">
                {data.metaDescription || 'A meta description aparecerá aqui...'}
              </p>
            </div>
          )}

          {/* Campos opcionais */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Campos Opcionais
            </p>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Canonical URL</label>
              <Input
                placeholder="https://... (apenas se for conteúdo duplicado noutro domínio)"
                value={data.canonicalUrl}
                onChange={(e) => set('canonicalUrl', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Open Graph Image</label>
              <Input
                placeholder="URL da imagem para partilha nas redes sociais (1200×630px ideal)"
                value={data.ogImageUrl}
                onChange={(e) => set('ogImageUrl', e.target.value)}
              />
            </div>
          </div>

          {/* Indexação */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Indexação pelo Google</label>
            <div className="flex gap-3">
              {(['index', 'noindex'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => set('indexing', opt)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold border transition-all ${
                    data.indexing === opt
                      ? opt === 'index'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {opt === 'index' ? '✓ Indexar' : '✗ Não Indexar'}
                </button>
              ))}
            </div>
            {data.indexing === 'noindex' && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Este artigo não será descoberto pelo Google.
              </p>
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}