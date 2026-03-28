import { Edit, Trash2, Weight, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Equipment, EQUIPMENT_CATEGORY_LABELS, EQUIPMENT_PRIORITY_LABELS } from '@/types/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: () => void;
  onDelete: () => void;
}

const getCategoryColor = (category: Equipment['category']) => {
  const colors = {
    clothing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    safety: 'bg-red-500/10 text-red-500 border-red-500/20',
    navigation: 'bg-green-500/10 text-green-500 border-green-500/20',
    food: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    camping: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'first-aid': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return colors[category];
};

const getPriorityColor = (priority: 'essencial' | 'opcional') => {
  return priority === 'essencial'
    ? 'bg-red-500/10 text-red-500 border-red-500/20'
    : 'bg-blue-500/10 text-blue-500 border-blue-500/20';
};

export const EquipmentCard = ({ equipment, onEdit, onDelete }: EquipmentCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{equipment.name}</CardTitle>
            <Badge variant="outline" className={`mt-2 ${getCategoryColor(equipment.category)}`}>
              {EQUIPMENT_CATEGORY_LABELS[equipment.category]}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {equipment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{equipment.description}</p>
        )}
        
        {equipment.weight && (
          <div className="flex items-center gap-2 text-sm">
            <Weight className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{equipment.weight}g</span>
          </div>
        )}

        {equipment.linkedRoutes.length > 0 && (
          <div className="pt-2 border-t space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="w-3 h-3" />
              <span>Vinculado a {equipment.linkedRoutes.length} percurso(s)/roteiro(s)</span>
            </div>
            <div className="space-y-1">
              {equipment.linkedRoutes.slice(0, 2).map((link) => (
                <div key={link.routeId} className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <span className="text-muted-foreground truncate block">{link.routeName}</span>
                    {link.routeType === 'roteiro' && link.clientName && (
                      <span className="text-[11px] text-muted-foreground">Cliente: {link.clientName}</span>
                    )}
                  </div>
                  <Badge variant="outline" className={getPriorityColor(link.priority)}>
                    {EQUIPMENT_PRIORITY_LABELS[link.priority]}
                  </Badge>
                </div>
              ))}
              {equipment.linkedRoutes.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{equipment.linkedRoutes.length - 2} mais
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
