import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlockRouteCard } from '@/types/modular-page';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockRouteCardEditorProps {
  block: BlockRouteCard;
  onUpdate: (updates: Partial<BlockRouteCard>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockRouteCardEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockRouteCardEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco de Rota/Experiência</h3>
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

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-700">
          O card da rota será gerado automaticamente a partir do ID da base de dados.
        </p>
      </div>

      {/* Route ID */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          ID da Rota (Obrigatório)
        </label>
        <Input
          value={block.routeId}
          onChange={(e) => onUpdate({ routeId: e.target.value })}
          placeholder="Ex: route-123"
          className="text-sm"
        />
      </div>

      {block.routeId && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600">ID: <span className="font-mono font-semibold">{block.routeId}</span></p>
          <p className="text-xs text-gray-500 mt-1">O card será renderizado na visualização final</p>
        </div>
      )}
    </div>
  );
}
