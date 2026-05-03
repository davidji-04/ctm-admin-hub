import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlockText } from '@/types/modular-page';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockTextEditorProps {
  block: BlockText;
  onUpdate: (updates: Partial<BlockText>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockTextEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockTextEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco de Texto</h3>
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

      <Textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Escreva o texto aqui..."
        className="min-h-[120px]"
      />
    </div>
  );
}
