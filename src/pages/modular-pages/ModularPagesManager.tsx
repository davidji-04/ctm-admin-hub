import React, { useState } from 'react';
import { ModularPage } from '@/types/modular-page';
import { mockModularPages } from '@/data/mockModularPages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Lock, CheckCircle2, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModularPagesManager() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<ModularPage[]>(mockModularPages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'draft':
        return <Lock className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleEdit = (pageId: string) => {
    navigate(`/modular-pages/${pageId}/edit`);
  };

  const handleCreate = () => {
    navigate('/modular-pages/new');
  };

  const handleDelete = (pageId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta página?')) {
      setPages(pages.filter((p) => p.id !== pageId));
    }
  };

  const handleView = (slug: string) => {
    window.open(`/pages/${slug}`, '_blank');
  };

  const stats = {
    total: pages.length,
    published: pages.filter((p) => p.status === 'published').length,
    draft: pages.filter((p) => p.status === 'draft').length,
    archived: pages.filter((p) => p.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Páginas Modulares</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as páginas modulares do seu site</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Nova Página
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total de Páginas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-700">{stats.published}</p>
              <p className="text-sm text-green-600 mt-1">Publicadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-700">{stats.draft}</p>
              <p className="text-sm text-yellow-600 mt-1">Rascunhos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-700">{stats.archived}</p>
              <p className="text-sm text-gray-600 mt-1">Arquivadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Pesquisar por título ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  className="min-w-[100px]"
                >
                  {status === 'all' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <div className="space-y-3">
        {filteredPages.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-500 mb-4">Nenhuma página encontrada</p>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Criar Primeira Página
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{page.pageTitle}</h3>
                      <Badge className={getStatusColor(page.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(page.status)}
                          {getStatusLabel(page.status)}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">/pages/{page.slug}</p>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {page.cardListing.shortDescription}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📝 {page.blocks.length} bloco{page.blocks.length !== 1 ? 's' : ''}</span>
                      <span>🔗 {page.relatedRouteIds?.length || 0} rota{page.relatedRouteIds?.length !== 1 ? 's' : ''}</span>
                      <span>📅 Atualizado em {new Date(page.updatedAt).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(page.slug)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(page.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
