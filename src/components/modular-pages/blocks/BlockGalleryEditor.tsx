import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockGallery, MediaItem } from '@/types/modular-page';
import { GalleryUpload } from '@/components/routes/wizard/GalleryUpload';
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';

interface BlockGalleryEditorProps {
  block: BlockGallery;
  onUpdate: (updates: Partial<BlockGallery>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockGalleryEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockGalleryEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco de Galeria</h3>
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

      {/* Display Mode */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Modo de Exibição
        </label>
        <Select value={block.displayMode || 'grid'} onValueChange={(value) => onUpdate({ displayMode: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grade</SelectItem>
            <SelectItem value="slider">Carrossel</SelectItem>
            <SelectItem value="masonry">Alvenaria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Images Upload */}
      <GalleryUpload
        value={block.images.map((img) => ({ url: img.url, id: img.url }))}
        onChange={(images) => {
          onUpdate({
            images: images.map((img) => ({
              url: img.url || '',
              alt: '',
              caption: '',
            })),
          });
        }}
        label="Imagens da Galeria"
        maxImages={20}
      />

      {/* Alt Text for existing images */}
      {block.images.length > 0 && (
        <div className="border-t pt-4 space-y-3 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-700">Descrições das Imagens</h4>
          {block.images.map((image, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 mb-2">Imagem {index + 1}</p>
              <Input
                value={image.alt}
                onChange={(e) => {
                  const newImages = [...block.images];
                  newImages[index].alt = e.target.value;
                  onUpdate({ images: newImages });
                }}
                placeholder="Texto alternativo (acessibilidade)"
                className="text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
