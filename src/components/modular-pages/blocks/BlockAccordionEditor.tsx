import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlockAccordion, AccordionItem } from '@/types/modular-page';
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';

interface BlockAccordionEditorProps {
  block: BlockAccordion;
  onUpdate: (updates: Partial<BlockAccordion>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockAccordionEditor({
  block,
  onUpdate,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: BlockAccordionEditorProps) {
  const addItem = () => {
    const newItem: AccordionItem = {
      id: `item-${Date.now()}`,
      question: '',
      answer: '',
    };
    onUpdate({
      items: [...block.items, newItem],
    });
  };

  const updateItem = (itemId: string, field: keyof AccordionItem, value: string) => {
    onUpdate({
      items: block.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const removeItem = (itemId: string) => {
    onUpdate({
      items: block.items.filter((item) => item.id !== itemId),
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Bloco Acordeão (FAQs)</h3>
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

      {/* Items List */}
      <div className="space-y-3">
        {block.items.map((item, index) => (
          <div key={item.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Item {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* Question */}
            <Input
              value={item.question}
              onChange={(e) => updateItem(item.id, 'question', e.target.value)}
              placeholder="Pergunta..."
              className="text-sm mb-2"
            />

            {/* Answer */}
            <Textarea
              value={item.answer}
              onChange={(e) => updateItem(item.id, 'answer', e.target.value)}
              placeholder="Resposta..."
              className="text-sm min-h-[80px]"
            />
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Item
      </Button>
    </div>
  );
}
