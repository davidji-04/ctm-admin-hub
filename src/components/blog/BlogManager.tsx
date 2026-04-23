import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, Calendar, Globe, Clock, User, BookOpen, Hash } from 'lucide-react';

import { mockFullArticles, mockAuthors, mockSeries, mockCategories } from '@/data/mockBlog';

export default function BlogManager() {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [seriesFilter, setSeriesFilter] = useState('all');

  const filteredArticles = mockFullArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
    const matchesSeries = seriesFilter === 'all' || art.seriesId === seriesFilter;
    return matchesSearch && matchesStatus && matchesSeries;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* CABEÇALHO DO SISTEMA*/}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema Editorial</h1>
          <p className="text-muted-foreground mt-1">Gestão central de Histórias, Autores e Séries Editoriais do Cheiro de Terra Molhada.</p>
        </div>
        <Button 
          onClick={() => navigate('/blog/admin/criar')} 
          className="gap-2 bg-[#0e0e0e] text-white hover:bg-gray-800 shrink-0 h-11 px-6 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nova História
        </Button>
      </div>

      {/* NAVEGAÇÃO ENTRE ENTIDADES */}
      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-md">
          <TabsTrigger value="articles" className="flex gap-2 items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BookOpen className="w-4 h-4" /> Histórias & Manuais
          </TabsTrigger>
          <TabsTrigger value="series" className="flex gap-2 items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Hash className="w-4 h-4" /> Séries Editoriais
          </TabsTrigger>
          <TabsTrigger value="authors" className="flex gap-2 items-center data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <User className="w-4 h-4" /> Autores
          </TabsTrigger>
        </TabsList>

        {/* Artigos*/}
        <TabsContent value="articles" className="space-y-6">
          
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar por título, excerto ou palavras-chave..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <select 
              className="p-2 border border-gray-200 rounded-md text-sm bg-white min-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
            </select>
            <select 
              className="p-2 border border-gray-200 rounded-md text-sm bg-white min-w-[180px]"
              value={seriesFilter}
              onChange={(e) => setSeriesFilter(e.target.value)}
            >
              <option value="all">Todas as Séries</option>
              {mockSeries.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* All Artigos*/}
          {filteredArticles.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center">
              <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">Nenhuma história encontrada</h3>
              <p className="text-gray-500 text-sm mt-1">Tente ajustar os filtros de pesquisa acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArticles.map((article) => {
                const author = mockAuthors.find(a => a.id === article.authorId);
                const series = mockSeries.find(s => s.id === article.seriesId);

                return (
                  <Card key={article.id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 border-gray-200">
                    
                    <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                      <img 
                        src={article.heroImage?.url || "https://images.unsplash.com/photo-1548560781-a7a07d9d33db?w=600&h=400&fit=crop"} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="bg-white/95 text-black hover:bg-white shadow-sm font-semibold">
                          {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </Badge>
                        <Badge variant="outline" className="bg-black/50 text-white border-none backdrop-blur-sm shadow-sm flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {article.language.toUpperCase()}
                        </Badge>
                      </div>

                      {article.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Série: {series?.name || 'Geral'}
                      </span>
                      
                      <h3 className="font-serif text-xl font-bold text-[#0e0e0e] line-clamp-2 mb-2 group-hover:text-gray-600 transition-colors leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          {author?.photo ? (
                            <img src={author.photo} alt={author.name} className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                              {author?.name?.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-gray-700">{author?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-0 border-t border-gray-100 flex">
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-none h-12 text-gray-600 hover:text-[#0e0e0e] hover:bg-gray-50 font-semibold text-sm"
                        onClick={() => navigate(`/blog/admin/editar/${article.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </Button>
                      <div className="w-[1px] bg-gray-100" />
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-none h-12 text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold text-sm"
                        title="Mover para o Lixo"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Apagar
                      </Button>
                    </CardFooter>

                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="series">
          <Card className="border-dashed border-2 bg-gray-50">
            <CardContent className="py-16 text-center flex flex-col items-center">
              <Hash className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#0e0e0e]">Gestão de Séries Editoriais</h3>
              <p className="text-gray-500 mt-2 max-w-md">As séries editoriais ajudam a agrupar histórias por temas profundos (ex: "Diários de Inverno", "Horizontes").</p>
              <Button className="mt-6 bg-[#0e0e0e] text-white">Criar Nova Série</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authors">
          <Card className="border-dashed border-2 bg-gray-50">
            <CardContent className="py-16 text-center flex flex-col items-center">
              <User className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#0e0e0e]">Perfis de Autores</h3>
              <p className="text-gray-500 mt-2 max-w-md">Gira as biografias e as fotografias dos guias e jornalistas que escrevem os Diários da Terra.</p>
              <Button className="mt-6 bg-[#0e0e0e] text-white">Adicionar Novo Autor</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}