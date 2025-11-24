import { useState } from 'react';
import { Search, User, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'premium' | 'free';
  physicalCapabilities?: string;
}

interface ClientSelectorProps {
  selectedClientId?: string;
  onClientSelect: (clientId: string) => void;
}

export const ClientSelector = ({ selectedClientId, onClientSelect }: ClientSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const clients: Client[] = [
    {
      id: 'client-1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+351 912 345 678',
      type: 'premium',
      physicalCapabilities: 'Boa condição física, caminhadas regulares',
    },
    {
      id: 'client-2',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+351 913 456 789',
      type: 'premium',
      physicalCapabilities: 'Condição moderada, primeiro Caminho',
    },
    {
      id: 'client-3',
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '+351 914 567 890',
      type: 'premium',
      physicalCapabilities: 'Excelente condição, experiente',
    },
  ];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Pesquisar Cliente</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Nome ou email do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <RadioGroup value={selectedClientId} onValueChange={onClientSelect}>
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className={`cursor-pointer transition-colors ${
                selectedClientId === client.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onClientSelect(client.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <RadioGroupItem value={client.id} id={client.id} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{client.name}</CardTitle>
                        <Badge variant="secondary">Premium</Badge>
                      </div>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-1 text-xs">
                          <User className="w-3 h-3" />
                          {client.email}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  {selectedClientId === client.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              {client.physicalCapabilities && (
                <CardContent className="pt-0">
                  <div className="text-sm">
                    <span className="font-medium">Capacidades: </span>
                    <span className="text-muted-foreground">
                      {client.physicalCapabilities}
                    </span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </RadioGroup>

      {filteredClients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cliente premium encontrado
        </div>
      )}
    </div>
  );
};
