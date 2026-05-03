import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Type, Image as ImageIcon, LayoutGrid, Film, SplitSquareHorizontal,
  Minus, Megaphone, Map, Zap, HelpCircle
} from 'lucide-react';
import { PageBlock } from '@/types/modular-page';
import { BlockTextEditor } from './blocks/BlockTextEditor';
import { BlockImageEditor } from './blocks/BlockImageEditor';
import { BlockHeroEditor } from './blocks/BlockHeroEditor';
import { BlockAccordionEditor } from './blocks/BlockAccordionEditor';
import { BlockGalleryEditor } from './blocks/BlockGalleryEditor';
import { BlockVideoEditor } from './blocks/BlockVideoEditor';
import { BlockTextImageEditor } from './blocks/BlockTextImageEditor';
import { BlockSeparatorEditor } from './blocks/BlockSeparatorEditor';
import { BlockCTAEditor } from './blocks/BlockCTAEditor';
import { BlockRouteCardEditor } from './blocks/BlockRouteCardEditor';

interface ModularPageEditorProps {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
}

export default function ModularPageEditor({ blocks, onChange }: ModularPageEditorProps) {
  const addBlock = (type: string) => {
    const baseBlock = { id: `block-${Date.now()}`, type, order: blocks.length + 1 };

    let newBlock: any = { ...baseBlock };
    switch (type) {
      case 'text':
        newBlock.content = '';
        break;
      case 'image':
        newBlock = { ...newBlock, layout: 'full_width', media: { url: '', alt: '', caption: '' } };
        break;
      case 'gallery':
        newBlock = { ...newBlock, displayMode: 'grid', images: [] };
        break;
      case 'video':
        newBlock.url = '';
        newBlock.caption = '';
        break;
      case 'text_image':
        newBlock = { ...newBlock, imagePosition: 'left', content: '', media: { url: '', alt: '' } };
        break;
      case 'separator':
        break;
      case 'cta':
        newBlock = { ...newBlock, text: '', buttonLabel: '', buttonLink: '' };
        break;
      case 'hero':
        newBlock = { ...newBlock, backgroundMedia: { url: '', alt: '' }, title: '', subtitle: '' };
        break;
      case 'accordion':
        newBlock = { ...newBlock, items: [] };
        break;
      case 'route_card':
        newBlock.routeId = '';
        break;
    }

    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, updates: any) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];

    const orderedBlocks = newBlocks.map((b, i) => ({ ...b, order: i + 1 }));
    onChange(orderedBlocks);
  };

  const renderBlockEditor = (block: PageBlock, index: number) => {
    const commonProps = {
      onRemove: () => removeBlock(block.id),
      onMove: (direction: 'up' | 'down') => moveBlock(index, direction),
      canMoveUp: index > 0,
      canMoveDown: index < blocks.length - 1,
    };

    switch (block.type) {
      case 'text':
        return (
          <BlockTextEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'image':
        return (
          <BlockImageEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'gallery':
        return (
          <BlockGalleryEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'video':
        return (
          <BlockVideoEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'text_image':
        return (
          <BlockTextImageEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'separator':
        return (
          <BlockSeparatorEditor
            key={block.id}
            block={block as any}
            {...commonProps}
          />
        );
      case 'cta':
        return (
          <BlockCTAEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'hero':
        return (
          <BlockHeroEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'accordion':
        return (
          <BlockAccordionEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'route_card':
        return (
          <BlockRouteCardEditor
            key={block.id}
            block={block as any}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* QUICK INSERT MENU */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-dashed shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Construtor Modular (+ Adicionar Bloco)
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Blocos Padrão</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => addBlock('text')}>
                  <Type className="w-4 h-4 mr-2" /> Texto
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('image')}>
                  <ImageIcon className="w-4 h-4 mr-2" /> Imagem
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('gallery')}>
                  <LayoutGrid className="w-4 h-4 mr-2" /> Galeria
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('video')}>
                  <Film className="w-4 h-4 mr-2" /> Vídeo
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('text_image')}>
                  <SplitSquareHorizontal className="w-4 h-4 mr-2" /> Texto+Imagem
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('separator')}>
                  <Minus className="w-4 h-4 mr-2" /> Separador
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('cta')}>
                  <Megaphone className="w-4 h-4 mr-2" /> CTA
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Blocos Específicos para Páginas</p>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm" onClick={() => addBlock('hero')}>
                  <Zap className="w-4 h-4 mr-2" /> Hero (Cabeçalho)
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" size="sm" onClick={() => addBlock('accordion')}>
                  <HelpCircle className="w-4 h-4 mr-2" /> Acordeão (FAQs)
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm" onClick={() => addBlock('route_card')}>
                  <Map className="w-4 h-4 mr-2" /> Rota/Experiência
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BUILDING AREA */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-400 italic">A página está vazia. Escolha um bloco acima para começar a construir.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id} className="relative">
              {renderBlockEditor(block, index)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
