import { MapPin, Phone, Mail, Globe, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Service, SERVICE_CATEGORY_LABELS } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

const getCategoryColor = (category: Service['category']) => {
  const colors = {
    accommodation: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    food: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    medical: 'bg-red-500/10 text-red-500 border-red-500/20',
    shopping: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    transport: 'bg-green-500/10 text-green-500 border-green-500/20',
    tourism: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    emergency: 'bg-red-600/10 text-red-600 border-red-600/20',
  };
  return colors[category];
};

export const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <Badge variant="outline" className={`mt-2 ${getCategoryColor(service.category)}`}>
              {SERVICE_CATEGORY_LABELS[service.category]}
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
        {service.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{service.address}</span>
          </div>
          
          {service.contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a href={`tel:${service.contact.phone}`} className="text-muted-foreground hover:text-foreground">
                {service.contact.phone}
              </a>
            </div>
          )}
          
          {service.contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a href={`mailto:${service.contact.email}`} className="text-muted-foreground hover:text-foreground truncate">
                {service.contact.email}
              </a>
            </div>
          )}
          
          {service.contact.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={service.contact.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground truncate"
              >
                {service.contact.website}
              </a>
            </div>
          )}
        </div>

        {service.linkedLocalityIds.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Vinculado a {service.linkedLocalityIds.length} localidade{service.linkedLocalityIds.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
