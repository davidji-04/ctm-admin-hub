import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Upload, Plus } from 'lucide-react';

// ─── TIPOS ──────────────────────────────────────────────────────────────────

export interface HeroMedia {
  url: string;
  alt: string;
  caption: string;
  credit: string;
  type: 'image' | 'video';
}

export interface ArticleIdentity {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  intro: string;
  authorId: string;
  categoryIds: string[];
  tagIds: string[];
  seriesId: string;
  heroMedia: HeroMedia;
  thumbnailUrl: string;
}

interface ArticleIdentityTabProps {
  data: ArticleIdentity;
  onChange: (data: ArticleIdentity) => void;
  // Alimentados pela vossa base de dados / mock
  availableAuthors: { id: string; name: string; photo?: string }[];
  availableCategories: { id: string; name: string }[];
  availableTags: { id: string; name: string }[];
  availableSeries: { id: string; name: string }[];
}

// ─── UTILITÁRIO: gerar slug a partir do título ───────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function ArticleIdentityTab({
  data,
  onChange,
  availableAuthors,
  availableCategories,
  availableTags,
  availableSeries,
}: ArticleIdentityTabProps) {

  // Auto-gerar slug quando o título muda (apenas se slug ainda não foi editado manualmente)
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);

  useEffect(() => {
    if (!slugManuallyEdited && data.title) {
      onChange({ ...data, slug: slugify(data.title) });
    }
  }, [data.title]);

  const set = (field: keyof ArticleIdentity, value: any) =>
    onChange({ ...data, [field]: value });

  const setHero = (field: keyof HeroMedia, value: string) =>
    onChange({ ...data, heroMedia: { ...data.heroMedia, [field]: value } });

  // ─── Helpers para multi-select de categorias e tags ──────────────────────

  const toggleId = (
    field: 'categoryIds' | 'tagIds',
    id: string
  ) => {
    const current = data[field];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    set(field, updated);
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════
          1. IDENTIFICAÇÃO PRINCIPAL
      ══════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold uppercase tracking-widest text-gray-500">
            1. Identificação do Artigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Título */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">
              Título Principal (H1) <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Ex: O Peso do Silêncio"
              value={data.title}
              onChange={(e) => set('title', e.target.value)}
              className="text-lg font-serif"
            />
          </div>

          {/* Subtítulo */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">Subtítulo / Lead</label>
            <Input
              placeholder="Um parágrafo curto de impacto... (opcional)"
              value={data.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 whitespace-nowrap">/blog/</span>
              <Input
                placeholder="o-peso-do-silencio"
                value={data.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  set('slug', slugify(e.target.value));
                }}
                className="font-mono text-sm"
              />
            </div>
            <p className="text-xs text-gray-400">
              Gerado automaticamente pelo título. Pode editar manualmente.
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">
              Resumo / Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Texto curto para listagens e cards. Máx. 200 caracteres."
              maxLength={200}
              value={data.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              className="w-full p-3 border rounded-md text-sm min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p className="text-xs text-gray-400 text-right">
              {data.excerpt.length}/200
            </p>
          </div>

          {/* Introdução curta */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">Introdução Curta</label>
            <textarea
              placeholder="Parágrafo introdutório antes do corpo modular... (opcional)"
              value={data.intro}
              onChange={(e) => set('intro', e.target.value)}
              className="w-full p-3 border rounded-md text-sm min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          2. MEDIA DE CAPA (HERO)
      ══════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold uppercase tracking-widest text-gray-500">
            2. Media de Capa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Tipo de media */}
          <div className="flex gap-3">
            {(['image', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setHero('type', t)}
                className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                  data.heroMedia.type === t
                    ? 'bg-[#0e0e0e] text-white border-[#0e0e0e]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {t === 'image' ? '🖼 Imagem' : '🎬 Vídeo'}
              </button>
            ))}
          </div>

          {/* Área de upload / URL */}
          {data.heroMedia.url ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
              {data.heroMedia.type === 'image' ? (
                <img
                  src={data.heroMedia.url}
                  alt={data.heroMedia.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={data.heroMedia.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              )}
              <button
                onClick={() => setHero('url', '')}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-400 gap-3 bg-gray-50">
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">
                Drag & Drop ou colar URL abaixo
              </span>
              <Input
                placeholder={
                  data.heroMedia.type === 'image'
                    ? 'URL da imagem...'
                    : 'URL do vídeo (MP4/WebM)...'
                }
                className="max-w-sm bg-white"
                onBlur={(e) => setHero('url', e.target.value)}
              />
            </div>
          )}

          {/* Metadados da media */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-3">
              <label className="text-sm font-semibold">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Descrição da imagem para acessibilidade (obrigatório)"
                value={data.heroMedia.alt}
                onChange={(e) => setHero('alt', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold">Legenda</label>
              <Input
                placeholder="Legenda visível na página (opcional)"
                value={data.heroMedia.caption}
                onChange={(e) => setHero('caption', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">Crédito da Foto</label>
              <Input
                placeholder="© Nome do fotógrafo"
                value={data.heroMedia.credit}
                onChange={(e) => setHero('credit', e.target.value)}
              />
            </div>
          </div>

          {/* Thumbnail separada */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            <label className="text-sm font-semibold">
              Imagem de Listagem / Thumbnail
              <span className="text-gray-400 font-normal ml-2">(opcional — usa a capa se vazio)</span>
            </label>
            <Input
              placeholder="URL alternativa para cards e listagens..."
              value={data.thumbnailUrl}
              onChange={(e) => set('thumbnailUrl', e.target.value)}
            />
          </div>

        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════
          3. ATRIBUIÇÃO E TAXONOMIA
      ══════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold uppercase tracking-widest text-gray-500">
            3. Atribuição e Taxonomia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Autor */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Autor <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableAuthors.map((author) => (
                <button
                  key={author.id}
                  onClick={() => set('authorId', author.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    data.authorId === author.id
                      ? 'border-[#0e0e0e] bg-[#0e0e0e] text-white'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  {author.photo ? (
                    <img
                      src={author.photo}
                      alt={author.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {author.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium truncate">{author.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Série Editorial */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Série Editorial <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-2">(apenas 1)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSeries.map((s) => (
                <button
                  key={s.id}
                  onClick={() => set('seriesId', s.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    data.seriesId === s.id
                      ? 'bg-[#0e0e0e] text-white border-[#0e0e0e]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Categorias <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-2">
                (mín. 1 — {data.categoryIds.length} selecionada{data.categoryIds.length !== 1 ? 's' : ''})
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const selected = data.categoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleId('categoryIds', cat.id)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                      selected
                        ? 'bg-[#0e0e0e] text-white border-[#0e0e0e]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Tags <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-2">
                (mín. 1 — {data.tagIds.length} selecionada{data.tagIds.length !== 1 ? 's' : ''})
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const selected = data.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleId('tagIds', tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      selected
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}