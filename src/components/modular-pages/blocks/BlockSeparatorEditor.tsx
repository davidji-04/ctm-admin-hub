import React from 'react';
import { Button } from '@/components/ui/button';
import { BlockSeparator } from '@/types/modular-page';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockSeparatorEditorProps {
  block: BlockSeparator;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockSeparatorEditor({
  block,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockSeparatorEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Separador</h3>
          <p className="text-xs text-gray-500 mt-1">Espaçamento vertical</p>
        </div>
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
      <div className="my-4 border-t border-gray-300"></div>
    </div>
  );
}
