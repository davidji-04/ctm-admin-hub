import { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RouteImage, ImageType } from '@/types/image';
import { ImageCard } from '@/components/images/ImageCard';
import { ImageUploadModal } from '@/components/images/ImageUploadModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockRoutes } from '@/data/mockRoutes';

const ImageGallery = () => {
  const [images, setImages] = useState<RouteImage[]>([
    {
      id: '1',
      percurso_id: '1',
      tipo: 'hero',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      filename: 'hero-caminho-portugues.jpg',
      width: 1920,
      height: 1080,
      size: 2048576,
      uploadedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      percurso_id: '1',
      tipo: 'galeria',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      filename: 'gallery-1.jpg',
      ordem: 1,
      width: 1600,
      height: 900,
      size: 1524576,
      uploadedAt: '2024-01-15T11:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<ImageType | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleImageUpload = (imageData: Omit<RouteImage, 'id' | 'uploadedAt'>) => {
    const newImage: RouteImage = {
      ...imageData,
      id: `img-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setImages([...images, newImage]);
    setIsUploadModalOpen(false);
  };

  const handleImageDelete = (imageId: string) => {
    setImages(images.filter((img) => img.id !== imageId));
  };

  const handleOrderChange = (imageId: string, newOrder: number) => {
    setImages(images.map((img) =>
      img.id === imageId ? { ...img, ordem: newOrder } : img
    ));
  };

  const filteredImages = images.filter((image) => {
    const matchesSearch = image.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = routeFilter === 'all' || image.percurso_id === routeFilter;
    const matchesType = typeFilter === 'all' || image.tipo === typeFilter;
    return matchesSearch && matchesRoute && matchesType;
  });

  const heroImages = filteredImages.filter((img) => img.tipo === 'hero');
  const galleryImages = filteredImages
    .filter((img) => img.tipo === 'galeria')
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const routeSections = mockRoutes.map((route) => {
    const routeId = route.id.toString();
    const routeImages = filteredImages.filter((img) => img.percurso_id === routeId);
    const routeHeroImages = routeImages.filter((img) => img.tipo === 'hero');
    const routeGalleryImages = routeImages
      .filter((img) => img.tipo === 'galeria')
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

    return {
      route,
      routeId,
      routeImages,
      routeHeroImages,
      routeGalleryImages,
    };
  });

  const totalRouteSectionImages = routeSections.reduce((acc, section) => acc + section.routeImages.length, 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Imagens</h1>
          <p className="text-muted-foreground mt-1">
            Galeria central de imagens organizadas por percurso
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Carregar Imagens
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Procurar imagens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={routeFilter} onValueChange={setRouteFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Percurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os percursos</SelectItem>
            {mockRoutes.map((route) => (
              <SelectItem key={route.id} value={route.id.toString()}>
                {route.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ImageType | 'all')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="hero">Hero</SelectItem>
            <SelectItem value="galeria">Galeria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredImages.length})</TabsTrigger>
          <TabsTrigger value="hero">Hero ({heroImages.length})</TabsTrigger>
          <TabsTrigger value="galeria">Galeria ({galleryImages.length})</TabsTrigger>
          <TabsTrigger value="percurso">Percursos ({totalRouteSectionImages})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={handleImageDelete}
                onOrderChange={handleOrderChange}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hero" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {heroImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={handleImageDelete}
                onOrderChange={handleOrderChange}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="galeria" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={handleImageDelete}
                onOrderChange={handleOrderChange}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="percurso" className="mt-6">
          <Accordion type="multiple" className="w-full">
            {routeSections.map((section) => (
              <AccordionItem key={section.route.id} value={`route-${section.route.id}`}>
                <AccordionTrigger>
                  <div className="flex w-full items-center justify-between pr-4 text-left">
                    <span className="font-medium">{section.route.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {section.routeImages.length} imagem(ns) • Hero {section.routeHeroImages.length} • Galeria {section.routeGalleryImages.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {section.routeImages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem imagens para este percurso.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {section.routeImages.map((image) => (
                        <ImageCard
                          key={image.id}
                          image={image}
                          onDelete={handleImageDelete}
                          onOrderChange={handleOrderChange}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma imagem encontrada</p>
        </div>
      )}

      <ImageUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleImageUpload}
        routes={mockRoutes.map((route) => ({
          id: route.id.toString(),
          name: route.title,
        }))}
      />
    </div>
  );
};

export default ImageGallery;
