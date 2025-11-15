import { useState } from 'react';
import { Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RouteImage } from '@/types/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ImageCardProps {
  image: RouteImage;
  onDelete: (id: string) => void;
  onOrderChange: (id: string, newOrder: number) => void;
}

export const ImageCard = ({ image, onDelete, onOrderChange }: ImageCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isHero = image.tipo === 'hero';

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative aspect-video bg-muted">
          <img
            src={image.url}
            alt={image.filename}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Badge
            className="absolute top-2 right-2"
            variant={isHero ? 'default' : 'secondary'}
          >
            {isHero ? 'Hero' : 'Galeria'}
          </Badge>
        </div>
        <CardContent className="p-3 space-y-2">
          <div>
            <p className="text-sm font-medium truncate">{image.filename}</p>
            <p className="text-xs text-muted-foreground">
              {image.width} × {image.height} • {formatFileSize(image.size)}
            </p>
          </div>
          {!isHero && image.ordem !== undefined && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">Ordem: {image.ordem}</span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => onOrderChange(image.id, image.ordem! - 1)}
                  disabled={image.ordem === 1}
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => onOrderChange(image.id, image.ordem! + 1)}
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Imagem</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar esta imagem? Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(image.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{image.filename}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="w-full">
            <img
              src={image.url}
              alt={image.filename}
              className="w-full h-auto rounded-md"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
