import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RouteImage, ImageType, IMAGE_CONSTRAINTS } from '@/types/image';
import { toast } from 'sonner';

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (image: Omit<RouteImage, 'id' | 'uploadedAt'>) => void;
  routes: { id: string; name: string }[];
}

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  dimensions?: { width: number; height: number };
}

export const ImageUploadModal = ({
  open,
  onOpenChange,
  onUpload,
  routes,
}: ImageUploadModalProps) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ImageType>('galeria');
  const [files, setFiles] = useState<UploadFile[]>([]);

  const validateFile = async (file: File): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> => {
    // Check file type
    if (!IMAGE_CONSTRAINTS.ALLOWED_FORMATS.includes(file.type)) {
      return { valid: false, error: 'Formato inválido. Use JPG, PNG ou WebP.' };
    }

    // Get image dimensions
    const dimensions = await getImageDimensions(file);

    // Check hero image constraints
    if (selectedType === 'hero') {
      if (file.size > IMAGE_CONSTRAINTS.HERO_MAX_SIZE) {
        return { valid: false, error: `Imagem hero deve ter no máximo ${IMAGE_CONSTRAINTS.HERO_MAX_SIZE / (1024 * 1024)}MB.` };
      }
      if (dimensions.width < IMAGE_CONSTRAINTS.HERO_MIN_WIDTH || dimensions.height < IMAGE_CONSTRAINTS.HERO_MIN_HEIGHT) {
        return { 
          valid: false, 
          error: `Imagem hero deve ter pelo menos ${IMAGE_CONSTRAINTS.HERO_MIN_WIDTH}×${IMAGE_CONSTRAINTS.HERO_MIN_HEIGHT}px.` 
        };
      }
    }

    return { valid: true, dimensions };
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = [];

    for (const file of acceptedFiles) {
      const validation = await validateFile(file);
      const uploadFile: UploadFile = {
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: validation.valid ? 'pending' : 'error',
        error: validation.error,
        dimensions: validation.dimensions,
      };
      newFiles.push(uploadFile);
    }

    setFiles((prev) => [...prev, ...newFiles]);
  }, [selectedType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const simulateUpload = (index: number): Promise<void> => {
    return new Promise((resolve) => {
      setFiles((prev) => {
        const updated = [...prev];
        updated[index].status = 'uploading';
        return updated;
      });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles((prev) => {
          const updated = [...prev];
          updated[index].progress = progress;
          return updated;
        });

        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) => {
            const updated = [...prev];
            updated[index].status = 'success';
            return updated;
          });
          resolve();
        }
      }, 100);
    });
  };

  const handleUpload = async () => {
    if (!selectedRoute) {
      toast.error('Selecione um percurso');
      return;
    }

    const validFiles = files.filter((f) => f.status === 'pending' || f.status === 'success');
    if (validFiles.length === 0) {
      toast.error('Nenhuma imagem válida para carregar');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await simulateUpload(i);
      }
    }

    // Upload all valid files
    for (const uploadFile of validFiles) {
      const imageData: Omit<RouteImage, 'id' | 'uploadedAt'> = {
        percurso_id: selectedRoute,
        tipo: selectedType,
        url: uploadFile.preview, // In production, this would be the uploaded URL
        filename: uploadFile.file.name,
        ordem: selectedType === 'galeria' ? files.filter(f => f.status === 'success').length + 1 : undefined,
        width: uploadFile.dimensions?.width || 0,
        height: uploadFile.dimensions?.height || 0,
        size: uploadFile.file.size,
      };
      onUpload(imageData);
    }

    toast.success(`${validFiles.length} imagem(ns) carregada(s) com sucesso`);
    setFiles([]);
    setSelectedRoute('');
    setSelectedType('galeria');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carregar Imagens</DialogTitle>
          <DialogDescription>
            Faça upload de imagens JPG, PNG ou WebP. Hero: min 1920×1080, max 5MB
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Percurso *</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um percurso" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo *</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ImageType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="galeria">Galeria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Solte as imagens aqui...'
                : 'Arraste imagens aqui ou clique para selecionar'}
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Pré-visualização ({files.length})</h3>
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {files.map((uploadFile, index) => (
                  <div key={index} className="relative border rounded-lg p-2 space-y-2">
                    <div className="relative aspect-video bg-muted rounded overflow-hidden">
                      <img
                        src={uploadFile.preview}
                        alt={uploadFile.file.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium truncate">{uploadFile.file.name}</p>
                      {uploadFile.dimensions && (
                        <p className="text-xs text-muted-foreground">
                          {uploadFile.dimensions.width}×{uploadFile.dimensions.height}
                        </p>
                      )}
                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="h-1" />
                      )}
                      {uploadFile.status === 'success' && (
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Carregado</span>
                        </div>
                      )}
                      {uploadFile.status === 'error' && (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-xs">{uploadFile.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || !selectedRoute}>
              Carregar {files.length > 0 && `(${files.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
