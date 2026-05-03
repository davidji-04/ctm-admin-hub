import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlockHero, MediaItem } from '@/types/modular-page';
import { ImageUpload } from '@/components/routes/wizard/ImageUpload';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockHeroEditorProps {
  block: BlockHero;
  onUpdate: (updates: Partial<BlockHero>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockHeroEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockHeroEditorProps) {
  const handleMediaUpdate = (field: keyof MediaItem, value: string) => {
    onUpdate({
      backgroundMedia: {
        ...block.backgroundMedia,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco Hero (Cabeçalho)</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMove('up')}
            disabled={!canMoveUp}
            className="h-8 w-8 p-0"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMove('down')}
            disabled={!canMoveDown}
            className="h-8 w-8 p-0"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Background Media Upload */}
      <ImageUpload
        value={block.backgroundMedia.url ? { url: block.backgroundMedia.url, id: `hero-${Date.now()}` } : null}
        onChange={(file) => {
          if (file) {
            handleMediaUpdate('url', file.url);
          }
        }}
        label="Imagem/Vídeo de Fundo"
        description="Arraste a imagem aqui ou clique para selecionar"
      />

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Título de Destaque
        </label>
        <Input
          value={block.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Digite o título principal"
          className="text-sm font-semibold"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Subtítulo (Opcional)
        </label>
        <Input
          value={block.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder="Digite o subtítulo"
          className="text-sm"
        />
      </div>
    </div>
  );
}
