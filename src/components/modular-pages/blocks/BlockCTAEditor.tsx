import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlockCTA } from '@/types/modular-page';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockCTAEditorProps {
  block: BlockCTA;
  onUpdate: (updates: Partial<BlockCTA>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockCTAEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockCTAEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco CTA (Chamada para Ação)</h3>
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

      {/* Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        {block.text && <p className="text-sm mb-2">{block.text}</p>}
        {block.buttonLabel && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {block.buttonLabel}
          </button>
        )}
      </div>

      {/* Text */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Texto
        </label>
        <Textarea
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Digite o texto da chamada para ação"
          className="text-sm min-h-[80px]"
        />
      </div>

      {/* Button Label */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Rótulo do Botão
        </label>
        <Input
          value={block.buttonLabel}
          onChange={(e) => onUpdate({ buttonLabel: e.target.value })}
          placeholder="Ex: Clique Aqui, Saiba Mais, etc."
          className="text-sm"
        />
      </div>

      {/* Button Link */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          Link do Botão
        </label>
        <Input
          value={block.buttonLink}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
          placeholder="https://exemplo.com ou /rota-interna"
          className="text-sm"
        />
      </div>
    </div>
  );
}
