import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockModularPages } from '@/data/mockModularPages';
import { PageBlock, BlockText, BlockImage, BlockGallery, BlockVideo, BlockTextImage, BlockAccordion, BlockCTA, BlockHero, BlockRouteCard } from '@/types/modular-page';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ModularPageView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());

  const page = mockModularPages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
          <p className="text-gray-600 mb-4">A página que procura não existe.</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Voltar à página inicial
          </button>
        </div>
      </div>
    );
  }

  const renderBlock = (block: PageBlock) => {
    switch (block.type) {
      case 'hero':
        return <RenderBlockHero block={block as BlockHero} />;
      case 'text':
        return <RenderBlockText block={block as BlockText} />;
      case 'image':
        return <RenderBlockImage block={block as BlockImage} />;
      case 'gallery':
        return <RenderBlockGallery block={block as BlockGallery} />;
      case 'video':
        return <RenderBlockVideo block={block as BlockVideo} />;
      case 'text_image':
        return <RenderBlockTextImage block={block as BlockTextImage} />;
      case 'separator':
        return <div className="my-8 border-t border-gray-200" />;
      case 'cta':
        return <RenderBlockCTA block={block as BlockCTA} />;
      case 'accordion':
        return (
          <RenderBlockAccordion
            block={block as BlockAccordion}
            expanded={expandedAccordions.has(block.id)}
            onToggle={(id) => {
              const newSet = new Set(expandedAccordions);
              if (newSet.has(id)) {
                newSet.delete(id);
              } else {
                newSet.add(id);
              }
              setExpandedAccordions(newSet);
            }}
          />
        );
      case 'route_card':
        return <RenderBlockRouteCard block={block as BlockRouteCard} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Meta Tags would be set here in a real app */}
      <title>{page.seo.title}</title>
      <meta name="description" content={page.seo.metaDescription} />
      <meta property="og:image" content={page.seo.ogImage?.url || page.cardListing.image.url} />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto">
        {/* Render Blocks */}
        {page.blocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Block Renderers
function RenderBlockHero({ block }: { block: BlockHero }) {
  return (
    <div className="relative h-96 bg-gray-900 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${block.backgroundMedia.url})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative h-full flex items-center justify-center text-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">{block.title}</h1>
          {block.subtitle && <p className="text-xl text-gray-200">{block.subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function RenderBlockText({ block }: { block: BlockText }) {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed">{block.content}</p>
      </div>
    </div>
  );
}

function RenderBlockImage({ block }: { block: BlockImage }) {
  return (
    <div className={`py-8 ${block.layout === 'full_width' ? 'px-0' : 'px-6'}`}>
      <div className={block.layout === 'full_width' ? 'w-full' : 'max-w-2xl mx-auto'}>
        <img
          src={block.media.url}
          alt={block.media.alt}
          className="w-full h-auto rounded-lg"
        />
        {block.media.caption && (
          <p className="text-sm text-gray-600 mt-2 text-center">{block.media.caption}</p>
        )}
      </div>
    </div>
  );
}

function RenderBlockGallery({ block }: { block: BlockGallery }) {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div
        className={`grid gap-4 ${
          block.displayMode === 'grid'
            ? 'grid-cols-3'
            : block.displayMode === 'masonry'
            ? 'columns-3'
            : 'grid-cols-1'
        }`}
      >
        {block.images.map((image, idx) => (
          <img
            key={idx}
            src={image.url}
            alt={image.alt}
            className="w-full h-auto rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

function RenderBlockVideo({ block }: { block: BlockVideo }) {
  const isYoutube = block.url.includes('youtube') || block.url.includes('youtu.be');

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="aspect-video">
        {isYoutube ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={block.url}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video src={block.url} controls className="w-full h-full rounded-lg" />
        )}
      </div>
      {block.caption && <p className="text-sm text-gray-600 mt-2 text-center">{block.caption}</p>}
    </div>
  );
}

function RenderBlockTextImage({ block }: { block: BlockTextImage }) {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div
        className={`grid grid-cols-2 gap-8 items-center ${
          block.imagePosition === 'right' ? 'grid-cols-2' : 'grid-cols-2'
        }`}
      >
        {block.imagePosition === 'left' && (
          <>
            <img src={block.media.url} alt={block.media.alt} className="w-full h-auto rounded-lg" />
            <p className="text-lg text-gray-700 leading-relaxed">{block.content}</p>
          </>
        )}
        {block.imagePosition === 'right' && (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">{block.content}</p>
            <img src={block.media.url} alt={block.media.alt} className="w-full h-auto rounded-lg" />
          </>
        )}
      </div>
    </div>
  );
}

function RenderBlockAccordion({
  block,
  expanded,
  onToggle,
}: {
  block: BlockAccordion;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="space-y-3">
        {block.items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => onToggle(item.id)}
              className="w-full px-6 py-4 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50 transition"
            >
              {item.question}
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expanded && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RenderBlockCTA({ block }: { block: BlockCTA }) {
  return (
    <div className="px-6 py-12 bg-blue-50">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg text-gray-700 mb-6">{block.text}</p>
        <a
          href={block.buttonLink}
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {block.buttonLabel}
        </a>
      </div>
    </div>
  );
}

function RenderBlockRouteCard({ block }: { block: BlockRouteCard }) {
  // This would fetch the route card data from the API
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
        <p className="text-sm text-gray-600">Rota: {block.routeId}</p>
        <p className="text-xs text-gray-500 mt-2">O card será renderizado com dados da rota</p>
      </div>
    </div>
  );
}
