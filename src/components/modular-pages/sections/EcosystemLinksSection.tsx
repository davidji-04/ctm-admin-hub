import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Map } from 'lucide-react';
import { SHARED_MOCK_ROUTES } from '@/data/mockData';

interface EcosystemLinksProps {
  relatedRouteIds: string[];
  onChange: (routeIds: string[]) => void;
}

export function EcosystemLinksSection({ relatedRouteIds, onChange }: EcosystemLinksProps) {
  const [searchId, setSearchId] = useState('');

  const addRoute = () => {
    if (searchId.trim() && !relatedRouteIds.includes(searchId)) {
      onChange([...relatedRouteIds, searchId]);
      setSearchId('');
    }
  };

  const removeRoute = (id: string) => {
    onChange(relatedRouteIds.filter((routeId) => routeId !== id));
  };

  const getRouteDetails = (id: string) => {
    return SHARED_MOCK_ROUTES.find((route) => String(route.id) === id);
  };

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="text-lg">Secção 4: Ligações ao Ecossistema</CardTitle>
        <CardDescription>
          Associe rotas e experiências a esta página (preenchimento opcional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Route */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Inserir Rota/Experiência
          </label>
          <p className="text-xs text-gray-600">
            Pesquise por ID da base de dados. O admin pesquisa por ID e o frontend gera automaticamente o card da viagem.
          </p>

          <div className="flex gap-2">
            <Input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addRoute()}
              placeholder="Ex: route-1, route-123..."
              className="flex-1"
            />
            <Button onClick={addRoute} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>

          {/* Available Routes Hint */}
          <details className="text-xs">
            <summary className="cursor-pointer text-blue-600 hover:underline">
              Ver rotas disponíveis ({SHARED_MOCK_ROUTES.length})
            </summary>
            <div className="mt-2 pl-4 border-l-2 border-blue-200 space-y-1">
              {SHARED_MOCK_ROUTES.slice(0, 5).map((route) => (
                <div key={route.id} className="text-gray-600">
                  <span className="font-mono text-xs">{route.id}</span> - {route.title}
                </div>
              ))}
              {SHARED_MOCK_ROUTES.length > 5 && (
                <div className="text-gray-500">... e mais {SHARED_MOCK_ROUTES.length - 5}</div>
              )}
            </div>
          </details>
        </div>

        {/* Related Routes List */}
        {relatedRouteIds.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Map className="w-4 h-4" /> Rotas Associadas ({relatedRouteIds.length})
            </h4>

            <div className="space-y-2">
              {relatedRouteIds.map((routeId) => {
                const route = getRouteDetails(routeId);
                return (
                  <div key={routeId} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{route?.title || routeId}</p>
                      <p className="text-xs text-gray-500 font-mono">{routeId}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoute(routeId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {relatedRouteIds.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Map className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Nenhuma rota associada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
