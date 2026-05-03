import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockTextImage, ImageLayout, MediaItem } from '@/types/modular-page';
import { ImageUpload } from '@/components/routes/wizard/ImageUpload';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockTextImageEditorProps {
  block: BlockTextImage;
  onUpdate: (updates: Partial<BlockTextImage>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockTextImageEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockTextImageEditorProps) {
  const handleMediaUpdate = (field: keyof MediaItem, value: string) => {
    onUpdate({
      media: {
        ...block.media,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco de Texto + Imagem</h3>
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

      {/* Image Position */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Posição da Imagem
        </label>
        <Select value={block.imagePosition} onValueChange={(value) => onUpdate({ imagePosition: value as 'left' | 'right' })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image Upload */}
      <ImageUpload
        value={block.media.url ? { url: block.media.url, id: `txt-img-${Date.now()}` } : null}
        onChange={(file) => {
          if (file) {
            handleMediaUpdate('url', file.url);
          }
        }}
        label="Imagem"
        description="Arraste a imagem aqui ou clique para selecionar"
      />

      {/* Alt Text */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Texto Alternativo
        </label>
        <Input
          value={block.media.alt}
          onChange={(e) => handleMediaUpdate('alt', e.target.value)}
          placeholder="Descrição da imagem"
          className="text-sm"
        />
      </div>

      {/* Text Content */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Conteúdo de Texto
        </label>
        <Textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Digite o texto aqui..."
          className="text-sm min-h-[120px]"
        />
      </div>
    </div>
  );
}
