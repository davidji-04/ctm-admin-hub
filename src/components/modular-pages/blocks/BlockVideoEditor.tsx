import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlockVideo } from '@/types/modular-page';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockVideoEditorProps {
  block: BlockVideo;
  onUpdate: (updates: Partial<BlockVideo>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockVideoEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockVideoEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco de Vídeo</h3>
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

      {/* Video Preview */}
      {block.url && (
        <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
          {block.url.includes('youtube') || block.url.includes('youtu.be') ? (
            <iframe
              src={block.url}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <video src={block.url} className="w-full h-full object-cover" controls />
          )}
        </div>
      )}

      {/* Video URL */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          URL do Vídeo (YouTube, Vimeo ou Upload)
        </label>
        <Input
          value={block.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=... ou URL de vídeo"
          className="text-sm"
        />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Legenda (Opcional)
        </label>
        <Textarea
          value={block.caption || ''}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder="Digite a legenda do vídeo"
          className="text-sm min-h-[80px]"
        />
      </div>
    </div>
  );
}
