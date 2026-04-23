import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, AlertTriangle, CheckCircle2,
  FileText, Layers, Search, Eye, Upload, X,
  ChevronRight, ImageIcon, Play, ExternalLink,
  Calendar, User, Tag, Hash, Clock
} from 'lucide-react';

import ModularEditor from './ModularEditor';
import { mockAuthors, mockSeries, mockCategories, mockTags } from '@/data/mockBlog';


type Tab = 'identity' | 'editor' | 'seo';
type Status = 'draft' | 'scheduled' | 'published' | 'archived';

interface HeroMedia {
  url: string; alt: string; caption: string; credit: string; type: 'image' | 'video';
}
interface ArticleState {
  title: string; subtitle: string; slug: string; excerpt: string; intro: string;
  authorId: string; categoryIds: string[]; tagIds: string[]; seriesId: string;
  heroMedia: HeroMedia; thumbnailUrl: string; blocks: any[];
  status: Status; publishedAt: string; featured: boolean; featuredOrder: string;
  commentsActive: boolean; seoTitle: string; metaDescription: string;
  canonicalUrl: string; ogImageUrl: string; indexing: 'index' | 'noindex';
}

const INITIAL: ArticleState = {
  title: '', subtitle: '', slug: '', excerpt: '', intro: '',
  authorId: '', categoryIds: [], tagIds: [], seriesId: '',
  heroMedia: { url: '', alt: '', caption: '', credit: '', type: 'image' },
  thumbnailUrl: '', blocks: [],
  status: 'draft', publishedAt: '', featured: false, featuredOrder: '',
  commentsActive: true, seoTitle: '', metaDescription: '',
  canonicalUrl: '', ogImageUrl: '', indexing: 'index',
};

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

interface ValidationError { section: Tab; message: string; }
function validate(a: ArticleState): ValidationError[] {
  const e: ValidationError[] = [];
  if (!a.title.trim())            e.push({ section: 'identity', message: 'Título obrigatório' });
  if (!a.slug.trim())             e.push({ section: 'identity', message: 'Slug obrigatório' });
  if (!a.excerpt.trim())          e.push({ section: 'identity', message: 'Resumo obrigatório' });
  if (!a.heroMedia.url.trim())    e.push({ section: 'identity', message: 'Imagem de capa obrigatória' });
  if (!a.heroMedia.alt.trim())    e.push({ section: 'identity', message: 'Alt text da capa obrigatório' });
  if (!a.authorId)                e.push({ section: 'identity', message: 'Autor obrigatório' });
  if (a.categoryIds.length === 0) e.push({ section: 'identity', message: 'Mín. 1 categoria' });
  if (a.tagIds.length === 0)      e.push({ section: 'identity', message: 'Mín. 1 tag' });
  if (!a.seriesId)                e.push({ section: 'identity', message: 'Série editorial obrigatória' });
  if (a.blocks.length === 0)      e.push({ section: 'editor',   message: 'Mín. 1 bloco de conteúdo' });
  if (!a.seoTitle.trim())         e.push({ section: 'seo',      message: 'SEO Title obrigatório' });
  if (!a.metaDescription.trim())  e.push({ section: 'seo',      message: 'Meta Description obrigatória' });
  if ((a.status === 'published' || a.status === 'scheduled') && !a.publishedAt)
    e.push({ section: 'seo', message: 'Data de publicação obrigatória' });
  return e;
}

function HeroUploader({
  heroMedia,
  onChange,
}: {
  heroMedia: HeroMedia;
  onChange: (field: keyof HeroMedia, value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const applyUrl = (url: string) => {
    if (url.trim()) onChange('url', url.trim());
    setUrlInput('');
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
    const objectUrl = URL.createObjectURL(file);
    onChange('url', objectUrl);
    onChange('type', file.type.startsWith('video/') ? 'video' : 'image');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { handleFile(file); return; }
    const text = e.dataTransfer.getData('text/plain');
    if (text) onChange('url', text.trim());
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  if (heroMedia.url) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-stone-200 aspect-video bg-stone-100 group">
        {heroMedia.type === 'image'
          ? <img src={heroMedia.url} alt={heroMedia.alt} className="w-full h-full object-cover" />
          : <video src={heroMedia.url} className="w-full h-full object-cover" muted loop autoPlay />
        }
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/90 text-stone-800 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Substituir
          </button>
          <button
            type="button"
            onClick={() => onChange('url', '')}
            className="bg-red-500/90 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Remover
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl bg-stone-50 p-10 flex flex-col items-center gap-4 text-stone-400 cursor-pointer transition-all ${
        isDragging
          ? 'border-stone-900 bg-stone-100 scale-[1.01]'
          : 'border-stone-300 hover:border-stone-400 hover:bg-stone-100'
      }`}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}>
        <Upload className="w-6 h-6" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-600">
          {isDragging ? 'Soltar aqui' : 'Clique para escolher foto'}
        </p>
        <p className="text-xs text-stone-400 mt-1">ou arraste um ficheiro · JPG, PNG, WEBP, MP4</p>
      </div>

      <div
        className="w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all placeholder:text-stone-300"
            placeholder="Ou colar URL da imagem..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyUrl(urlInput); } }}
          />
          {urlInput && (
            <button
              type="button"
              onClick={() => applyUrl(urlInput)}
              className="px-3 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-700 transition-colors shrink-0"
            >
              OK
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

function PreviewModal({
  art,
  authors,
  series,
  categories,
  tags,
  onClose,
}: {
  art: ArticleState;
  authors: typeof mockAuthors;
  series: typeof mockSeries;
  categories: typeof mockCategories;
  tags: typeof mockTags;
  onClose: () => void;
}) {
  const author = authors.find(a => a.id === art.authorId);
  const serie  = series.find(s => s.id === art.seriesId);
  const cats   = categories.filter(c => art.categoryIds.includes(c.id));
  const tagList = tags.filter(t => art.tagIds.includes(t.id));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const wordCount = art.blocks
    .filter(b => b.type === 'text' || b.type === 'text_image')
    .reduce((acc, b) => acc + (b.content || '').split(/\s+/).filter(Boolean).length, 0)
    + (art.intro || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const statusMeta: Record<Status, { label: string; color: string }> = {
    draft:     { label: 'Rascunho',  color: 'bg-stone-100 text-stone-500 border-stone-200' },
    scheduled: { label: 'Agendado',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
    published: { label: 'Publicado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    archived:  { label: 'Arquivado', color: 'bg-red-50 text-red-600 border-red-200' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-stone-400">Pré-visualização</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusMeta[art.status].color}`}>
              {statusMeta[art.status].label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        <div className="flex-1">
          {art.heroMedia.url ? (
            <div className="relative w-full aspect-video bg-stone-900">
              {art.heroMedia.type === 'image'
                ? <img src={art.heroMedia.url} alt={art.heroMedia.alt} className="w-full h-full object-cover" />
                : <video src={art.heroMedia.url} className="w-full h-full object-cover" muted loop autoPlay />
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {(art.heroMedia.credit) && (
                <p className="absolute bottom-3 right-3 text-white/50 text-[10px]">© {art.heroMedia.credit}</p>
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-stone-100 flex items-center justify-center">
              <div className="text-center text-stone-300">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs">Sem imagem de capa</p>
              </div>
            </div>
          )}

          <div className="px-8 py-8 space-y-6">

            <div className="flex flex-wrap items-center gap-2">
              {serie && (
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
                  {serie.name}
                </span>
              )}
              {serie && cats.length > 0 && <span className="text-stone-300 text-xs">·</span>}
              {cats.map(c => (
                <span key={c.id} className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
                  {c.name}
                </span>
              ))}
            </div>

            {/* Título */}
            {art.title ? (
              <h1 className="font-serif text-3xl leading-tight text-stone-900 font-bold">
                {art.title}
              </h1>
            ) : (
              <h1 className="font-serif text-3xl leading-tight text-stone-300 italic">Sem título</h1>
            )}

            {/* Subtítulo */}
            {art.subtitle && (
              <p className="text-stone-500 text-lg leading-relaxed -mt-2 font-light">{art.subtitle}</p>
            )}

            {/* Meta: autor, data, tempo de leitura */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-stone-100 text-xs text-stone-400">
              {author && (
                <div className="flex items-center gap-2">
                  {(author as any).photo
                    ? <img src={(author as any).photo} alt={author.name} className="w-6 h-6 rounded-full object-cover" />
                    : <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500">{author.name.charAt(0)}</div>
                  }
                  <span className="font-semibold text-stone-600">{author.name}</span>
                </div>
              )}
              {art.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(art.publishedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
              {wordCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{readTime} min de leitura</span>
                </div>
              )}
            </div>

            {/* Introdução */}
            {art.intro && (
              <p className="text-stone-600 text-base leading-relaxed font-light border-l-2 border-stone-200 pl-4 italic">
                {art.intro}
              </p>
            )}

            {/* Excerto */}
            {art.excerpt && (
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Resumo (excerpt)</p>
                <p className="text-stone-600 text-sm leading-relaxed">{art.excerpt}</p>
              </div>
            )}

            {/* Blocos de conteúdo — preview simplificado */}
            {art.blocks.length > 0 ? (
              <div className="space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pb-2 border-b border-stone-100">
                  Corpo do artigo ({art.blocks.length} bloco{art.blocks.length !== 1 ? 's' : ''})
                </p>
                {art.blocks.map((block, i) => (
                  <div key={block.id || i}>
                    {block.type === 'text' && block.content && (
                      <p className="text-stone-700 text-base leading-relaxed font-serif whitespace-pre-wrap">{block.content}</p>
                    )}
                    {block.type === 'image' && block.media?.url && (
                      <div className="rounded-xl overflow-hidden border border-stone-100">
                        <img src={block.media.url} alt={block.media.alt || ''} className="w-full object-cover max-h-72" />
                        {block.media.caption && <p className="text-xs text-stone-400 text-center py-2 bg-stone-50">{block.media.caption}</p>}
                      </div>
                    )}
                    {block.type === 'quote' && block.text && (
                      <blockquote className="border-l-4 border-stone-900 pl-6 py-2">
                        <p className="font-serif text-xl text-stone-800 italic leading-relaxed">"{block.text}"</p>
                        {block.author && <footer className="text-xs text-stone-400 mt-2 font-semibold">— {block.author}</footer>}
                      </blockquote>
                    )}
                    {block.type === 'separator' && (
                      <div className="flex justify-center py-2"><div className="w-12 h-px bg-stone-300" /></div>
                    )}
                    {block.type === 'cta' && (block.text || block.buttonLabel) && (
                      <div className="bg-stone-900 text-white rounded-xl p-6 text-center space-y-3">
                        {block.text && <p className="font-semibold">{block.text}</p>}
                        {block.buttonLabel && (
                          <span className="inline-block bg-white text-stone-900 text-sm font-bold px-6 py-2 rounded-lg">
                            {block.buttonLabel}
                          </span>
                        )}
                      </div>
                    )}
                    {(block.type === 'gallery' || block.type === 'video' || block.type === 'text_image' || block.type === 'route_card' || block.type === 'related_articles') && (
                      <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 flex items-center gap-3 text-stone-400">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-500 capitalize">{block.type.replace('_', ' ')}</p>
                          <p className="text-[11px] text-stone-400">Bloco renderizado na página final</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center text-stone-300">
                <Layers className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Sem blocos de conteúdo ainda</p>
              </div>
            )}

            {/* Tags */}
            {tagList.length > 0 && (
              <div className="pt-6 border-t border-stone-100 flex flex-wrap gap-2">
                {tagList.map(t => (
                  <span key={t.id} className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-semibold">#{t.name}</span>
                ))}
              </div>
            )}

            {/* SEO preview */}
            {(art.seoTitle || art.metaDescription) && (
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-1.5 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Google SERP</p>
                <p className="text-[#1a0dab] text-base hover:underline cursor-pointer">{art.seoTitle || art.title}</p>
                <p className="text-[#006621] text-xs">cheirodeterramolhada.pt › blog › {art.slug || '...'}</p>
                <p className="text-[#545454] text-sm leading-relaxed">{art.metaDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-stone-400 mb-4 mt-8 first:mt-0 pb-2 border-b border-stone-100">
      {children}
    </p>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-stone-500">
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-stone-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

function Toggle({ value, onChange, label, desc }: {
  value: boolean; onChange: (v: boolean) => void; label: string; desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-100 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-semibold text-stone-800">{label}</p>
        {desc && <p className="text-xs text-stone-400 mt-0.5">{desc}</p>}
      </div>
      <div className={`w-10 h-[22px] rounded-full relative transition-all shrink-0 ml-4 ${value ? 'bg-stone-900' : 'bg-stone-300'}`}>
        <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
      </div>
    </button>
  );
}

function SeoBar({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length;
  const pct = Math.min((len / max) * 100, 105);
  const color = len === 0 ? 'bg-stone-200' : len < min ? 'bg-amber-400' : len <= max ? 'bg-emerald-500' : 'bg-red-500';
  const textColor = len > max ? 'text-red-500' : len >= min ? 'text-emerald-600' : 'text-stone-400';
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex-1 h-[3px] bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[11px] font-mono font-semibold tabular-nums ${textColor}`}>{len}/{max}</span>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all placeholder:text-stone-300";
const textareaCls = `${inputCls} resize-none`;

export default function CreateEditArticle() {
  const navigate = useNavigate();
  const [art, setArt] = useState<ArticleState>(INITIAL);
  const [tab, setTab] = useState<Tab>('identity');
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const set = (field: keyof ArticleState, value: any) =>
    setArt(prev => ({ ...prev, [field]: value }));

  const setHero = useCallback((field: keyof HeroMedia, value: string) => {
    setArt(prev => ({ ...prev, heroMedia: { ...prev.heroMedia, [field]: value } }));
  }, []);

  useEffect(() => {
    if (!slugLocked && art.title) set('slug', slugify(art.title));
  }, [art.title]);

  const errors = attempted ? validate(art) : [];
  const errCount = (s: Tab) => errors.filter(e => e.section === s).length;

  const handleSave = () => {
    setAttempted(true);
    const errs = validate(art);
    if (errs.length > 0) { setTab(errs[0].section); return; }
    console.log('Publicar:', art);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const statusMeta: Record<Status, { label: string; dot: string }> = {
    draft:     { label: 'Rascunho',  dot: 'bg-stone-400' },
    scheduled: { label: 'Agendado',  dot: 'bg-amber-400' },
    published: { label: 'Publicado', dot: 'bg-emerald-500' },
    archived:  { label: 'Arquivado', dot: 'bg-red-400' },
  };

  const navItems: { id: Tab; icon: React.ReactNode; label: string; sub: string }[] = [
    { id: 'identity', icon: <FileText className="w-4 h-4" />, label: 'Informação & Capa', sub: 'Título, hero, taxonomia' },
    { id: 'editor',   icon: <Layers className="w-4 h-4" />,   label: 'Editor Modular',   sub: 'Blocos de conteúdo' },
    { id: 'seo',      icon: <Search className="w-4 h-4" />,   label: 'SEO & Publicação', sub: 'Metadados, estado' },
  ];

  return (
    <>
      {/* PRÉ-VISUALIZAÇÃO */}
      {showPreview && (
        <PreviewModal
          art={art}
          authors={mockAuthors}
          series={mockSeries}
          categories={mockCategories}
          tags={mockTags}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden bg-[#f5f4f1]">

        {/* SIDEBAR FIXA */}
        <aside className="w-[260px] shrink-0 bg-[#395c38] flex flex-col sticky top-0 h-screen self-start select-none">
          <div className="px-5 pt-6 pb-4 border-b border-white/[0.07]">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-white/80 hover:text-white/80 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors mb-5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao painel
            </button>

            <h1 className="text-white font-serif text-[1.1rem] leading-snug line-clamp-2 min-h-[2.5rem]">
              {art.title || <span className="italic text-white/80">Nova História</span>}
            </h1>

            {art.slug && (
              <p className="text-white/40 text-[10px] font-mono mt-1.5 truncate">/blog/{art.slug}</p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusMeta[art.status].dot}`} />
              <span className="text-white/80 text-[11px] font-semibold tracking-wide">{statusMeta[art.status].label}</span>
              <span className="text-white/80 text-[11px] mx-1">·</span>
              <span className="text-white/80 text-[11px]">{art.blocks.length} bloco{art.blocks.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
            {navItems.map(item => {
              const count = errCount(item.id);
              const active = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-all ${
                    active ? 'bg-white/[0.09] text-white' : 'text-white/35 hover:text-white/65 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`shrink-0 ${active ? 'text-white' : 'text-white/25'}`}>{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold leading-tight">{item.label}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{item.sub}</p>
                  </div>
                  {count > 0 && (
                    <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3 h-3 text-white/25 shrink-0" />}
                </button>
              );
            })}
          </nav>

          <div className="px-4 py-3">
            {attempted && errors.length > 0 ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 space-y-1.5">
                <p className="text-red-400 text-[11px] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {errors.length} campos em falta
                </p>
                <ul className="space-y-0.5">
                  {errors.slice(0, 3).map((e, i) => (
                    <li key={i} className="text-red-300/60 text-[10px] truncate">· {e.message}</li>
                  ))}
                  {errors.length > 3 && <li className="text-red-300/40 text-[10px]">· +{errors.length - 3} outros...</li>}
                </ul>
              </div>
            ) : saved ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-emerald-300 text-[11px] font-semibold">Guardado com sucesso!</p>
              </div>
            ) : null}
          </div>

          <div className="px-4 pb-6 space-y-2">
            <button onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-white text-[#0e0e0e] font-bold text-[13px] py-3 rounded-xl hover:bg-stone-100 active:scale-[0.98] transition-all shadow-lg shadow-black/30"
            >
              <Save className="w-3.5 h-3.5" />
              {art.status === 'published' ? 'Publicar História' : 'Guardar Rascunho'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center gap-2 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-semibold text-[13px] py-2.5 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> Pré-visualizar
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            ÁREA SCROLLÁVEL
        ══════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-xl mx-auto px-5 sm:px-8 py-10 pb-32">

            {/* ─── IDENTIDADE ──────────────────────── */}
            {tab === 'identity' && (
              <div className="space-y-6">
                <div className="mb-8">
                  <h2 className="font-serif text-[2rem] text-stone-900 leading-tight">Informação & Capa</h2>
                  <p className="text-stone-400 text-sm mt-1">O que o leitor vê antes de clicar.</p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SectionLabel>Identificação</SectionLabel>
                  <div className="space-y-5">
                    <Field label="Título Principal" required>
                      <textarea rows={2} className={`${textareaCls} font-serif text-2xl leading-snug`}
                        placeholder="Ex: O Peso do Silêncio"
                        value={art.title} onChange={e => set('title', e.target.value)} />
                    </Field>
                    <Field label="Subtítulo / Lead">
                      <input className={inputCls} placeholder="Parágrafo curto de impacto... (opcional)"
                        value={art.subtitle} onChange={e => set('subtitle', e.target.value)} />
                    </Field>
                    <Field label="Slug (URL)" required hint="Auto-gerado pelo título. Edite para personalizar.">
                      <div className="flex items-stretch border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-stone-900/10 focus-within:border-stone-400 transition-all bg-stone-50">
                        <span className="px-3 py-3 text-stone-400 text-xs font-mono bg-stone-100 border-r border-stone-200 flex items-center">/blog/</span>
                        <input
                          className="flex-1 px-3 py-3 bg-stone-50 text-stone-700 font-mono text-sm focus:outline-none"
                          value={art.slug}
                          onChange={e => { setSlugLocked(true); set('slug', slugify(e.target.value)); }}
                        />
                      </div>
                    </Field>
                    <Field label="Resumo / Excerpt" required hint={`Para cards e listagens. ${art.excerpt.length}/200 caracteres.`}>
                      <textarea rows={3} maxLength={200} className={textareaCls}
                        placeholder="Texto curto que aparece nos cartões..."
                        value={art.excerpt} onChange={e => set('excerpt', e.target.value)} />
                    </Field>
                    <Field label="Introdução Curta">
                      <textarea rows={3} className={textareaCls}
                        placeholder="Parágrafo antes do corpo modular... (opcional)"
                        value={art.intro} onChange={e => set('intro', e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* MEDIA DE CAPA */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SectionLabel>Media de Capa</SectionLabel>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {(['image', 'video'] as const).map(t => (
                        <button key={t} type="button" onClick={() => setHero('type', t)}
                          className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all border-2 ${
                            art.heroMedia.type === t
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {t === 'image' ? '🖼 Imagem' : '🎬 Vídeo'}
                        </button>
                      ))}
                    </div>

                    {/* UPLOADER ISOLADO — não tem onBlur problemático */}
                    <HeroUploader heroMedia={art.heroMedia} onChange={setHero} />

                    {/* Alt text — input completamente independente do uploader */}
                    <Field label="Alt Text" required>
                      <input
                        className="w-full px-4 py-3 bg-red-50/40 border border-red-200 rounded-xl text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all placeholder:text-stone-300"
                        placeholder="Descrição acessível da imagem (obrigatório)"
                        value={art.heroMedia.alt}
                        onChange={e => setHero('alt', e.target.value)}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Legenda">
                        <input className={inputCls} placeholder="Legenda visível..."
                          value={art.heroMedia.caption} onChange={e => setHero('caption', e.target.value)} />
                      </Field>
                      <Field label="Crédito da Foto">
                        <input className={inputCls} placeholder="© Fotógrafo"
                          value={art.heroMedia.credit} onChange={e => setHero('credit', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Thumbnail Alternativa" hint="Opcional — usa a capa se estiver vazio.">
                      <input className={inputCls} placeholder="URL para cards e listagens..."
                        value={art.thumbnailUrl} onChange={e => set('thumbnailUrl', e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* ATRIBUIÇÃO */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SectionLabel>Atribuição & Taxonomia</SectionLabel>
                  <div className="space-y-6">

                    <Field label="Autor" required>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {mockAuthors.map(a => (
                          <button key={a.id} type="button" onClick={() => set('authorId', a.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                              art.authorId === a.id
                                ? 'border-stone-900 bg-stone-900 text-white'
                                : 'border-stone-200 bg-stone-50 hover:border-stone-300 text-stone-700'
                            }`}
                          >
                            {(a as any).photo
                              ? <img src={(a as any).photo} alt={a.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              : <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-xs font-bold shrink-0 text-stone-600">{a.name.charAt(0)}</div>
                            }
                            <span className="text-[13px] font-semibold truncate">{a.name}</span>
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Série Editorial" required hint="Apenas uma série por artigo.">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mockSeries.map(s => (
                          <button key={s.id} type="button" onClick={() => set('seriesId', s.id)}
                            className={`px-4 py-2 rounded-full text-[12px] font-bold border-2 transition-all ${
                              art.seriesId === s.id
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                            }`}
                          >{s.name}</button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Categorias" required hint={`${art.categoryIds.length} selecionada${art.categoryIds.length !== 1 ? 's' : ''} · mínimo 1`}>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mockCategories.map(c => {
                          const sel = art.categoryIds.includes(c.id);
                          return (
                            <button key={c.id} type="button"
                              onClick={() => set('categoryIds', sel ? art.categoryIds.filter(x => x !== c.id) : [...art.categoryIds, c.id])}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border-2 tracking-wide transition-all ${
                                sel ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-700'
                              }`}
                            >{sel && '✓ '}{c.name}</button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field label="Tags" required hint={`${art.tagIds.length} selecionada${art.tagIds.length !== 1 ? 's' : ''} · mínimo 1`}>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mockTags.map(t => {
                          const sel = art.tagIds.includes(t.id);
                          return (
                            <button key={t.id} type="button"
                              onClick={() => set('tagIds', sel ? art.tagIds.filter(x => x !== t.id) : [...art.tagIds, t.id])}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                                sel ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600'
                              }`}
                            >#{t.name}</button>
                          );
                        })}
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ─── EDITOR MODULAR ──────────────────── */}
            {tab === 'editor' && (
              <div className="space-y-6">
                <div className="mb-8">
                  <h2 className="font-serif text-[2rem] text-stone-900 leading-tight">Editor Modular</h2>
                  <p className="text-stone-400 text-sm mt-1">Construa a narrativa bloco a bloco.</p>
                </div>
                <ModularEditor blocks={art.blocks} onChange={b => set('blocks', b)} />
              </div>
            )}

            {/* ─── SEO & PUBLICAÇÃO ────────────────── */}
            {tab === 'seo' && (
              <div className="space-y-6">
                <div className="mb-8">
                  <h2 className="font-serif text-[2rem] text-stone-900 leading-tight">SEO & Publicação</h2>
                  <p className="text-stone-400 text-sm mt-1">Visibilidade, datas e controlos editoriais.</p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SectionLabel>Estado de Publicação</SectionLabel>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-2">
                      {(['draft','scheduled','published','archived'] as Status[]).map(s => {
                        const dots: Record<Status,string> = { draft:'bg-stone-400', scheduled:'bg-amber-400', published:'bg-emerald-500', archived:'bg-red-400' };
                        const labels: Record<Status,string> = { draft:'Rascunho', scheduled:'Agendado', published:'Publicado', archived:'Arquivado' };
                        return (
                          <button key={s} type="button" onClick={() => set('status', s)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                              art.status === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-stone-50 hover:border-stone-300 text-stone-600'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${dots[s]}`} />
                            <span className="text-[13px] font-bold">{labels[s]}</span>
                          </button>
                        );
                      })}
                    </div>
                    <Field label="Data de Publicação" required={art.status === 'published' || art.status === 'scheduled'}>
                      <input type="datetime-local" value={art.publishedAt}
                        onChange={e => set('publishedAt', e.target.value)}
                        className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all" />
                    </Field>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SectionLabel>Controlos Editoriais</SectionLabel>
                  <div className="space-y-3">
                    <Toggle value={art.featured} onChange={v => set('featured', v)}
                      label="Artigo em Destaque" desc="Aparece na posição hero da listagem do blog." />
                    {art.featured && (
                      <div className="pl-5 border-l-2 border-stone-300 ml-1">
                        <Field label="Ordem de Destaque" hint="Número mais baixo = mais prioritário.">
                          <input type="number" min={1} value={art.featuredOrder}
                            onChange={e => set('featuredOrder', e.target.value)}
                            placeholder="Ex: 1"
                            className="w-28 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all" />
                        </Field>
                      </div>
                    )}
                    <Toggle value={art.commentsActive} onChange={v => set('commentsActive', v)}
                      label="Comentários Ativos" desc="Permite que os leitores comentem neste artigo." />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SectionLabel>SEO & Visibilidade Google</SectionLabel>
                  <div className="space-y-5">
                    <Field label="SEO Title" required>
                      <input className={inputCls}
                        placeholder={art.title || 'Título para o Google (50–60 caracteres)'}
                        value={art.seoTitle} onChange={e => set('seoTitle', e.target.value)} />
                      <SeoBar value={art.seoTitle} min={30} max={60} />
                    </Field>
                    <Field label="Meta Description" required>
                      <textarea rows={3} className={textareaCls}
                        placeholder="Descrição para o Google (120–160 caracteres)..."
                        value={art.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
                      <SeoBar value={art.metaDescription} min={120} max={160} />
                    </Field>
                    {(art.seoTitle || art.metaDescription) && (
                      <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Pré-visualização Google</p>
                        <p className="text-[#1a0dab] text-base hover:underline cursor-pointer">{art.seoTitle || art.title}</p>
                        <p className="text-[#006621] text-xs">cheirodeterramolhada.pt › blog › {art.slug || '...'}</p>
                        <p className="text-[#545454] text-sm leading-relaxed">{art.metaDescription}</p>
                      </div>
                    )}
                    <div className="space-y-4 pt-3 border-t border-stone-100">
                      <Field label="Canonical URL" hint="Apenas se for conteúdo duplicado noutro domínio.">
                        <input className={inputCls} placeholder="https://..." value={art.canonicalUrl}
                          onChange={e => set('canonicalUrl', e.target.value)} />
                      </Field>
                      <Field label="Open Graph Image" hint="1200×630px ideal para partilha social.">
                        <input className={inputCls} placeholder="https://..." value={art.ogImageUrl}
                          onChange={e => set('ogImageUrl', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Indexação Google">
                      <div className="flex gap-2">
                        {(['index','noindex'] as const).map(opt => (
                          <button key={opt} type="button" onClick={() => set('indexing', opt)}
                            className={`px-5 py-2.5 rounded-xl text-[12px] font-bold border-2 transition-all ${
                              art.indexing === opt
                                ? opt === 'index' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {opt === 'index' ? '✓ Indexar' : '✗ Não Indexar'}
                          </button>
                        ))}
                      </div>
                      {art.indexing === 'noindex' && (
                        <p className="text-[11px] text-red-500 flex items-center gap-1.5 mt-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> Este artigo não será descoberto pelo Google.
                        </p>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}