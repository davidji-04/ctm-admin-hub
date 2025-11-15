import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, GripVertical, Images } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryImage {
  id?: string;
  url?: string;
}

interface GalleryUploadProps {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 20;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SortableImage = ({ image, onRemove }: { image: { id: string; url: string }; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border bg-card"
    >
      <img src={image.url} alt="Gallery" className="w-full h-32 object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-background/80 hover:bg-background"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 bg-background/80 hover:bg-background text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const GalleryUpload = ({ value, onChange }: GalleryUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > MAX_IMAGES) {
        toast({
          title: "Too many images",
          description: `Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - value.length} more.`,
          variant: "destructive",
        });
        return;
      }

      const validFiles: File[] = [];
      
      for (const file of acceptedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "File too large",
            description: `${file.name} is too large. Max size is 5MB.`,
            variant: "destructive",
          });
          continue;
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a valid image type.`,
            variant: "destructive",
          });
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);

      try {
        const uploadPromises = validFiles.map(async (file) => {
          // Mock upload - in production this would upload to real backend
          await new Promise((resolve) => setTimeout(resolve, 300));

          return {
            id: `img-${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
          };
        });

        const newImages = await Promise.all(uploadPromises);
        onChange([...value, ...newImages]);

        toast({
          title: "Images uploaded",
          description: `${newImages.length} image(s) added to gallery`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: MAX_IMAGES - value.length,
    disabled: isUploading || value.length >= MAX_IMAGES,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((img) => img.id === active.id);
      const newIndex = value.findIndex((img) => img.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  const handleRemove = (id?: string) => {
    if (!id) return;
    onChange(value.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Gallery Images (Optional)</label>
        <span className="text-xs text-muted-foreground">
          {value.length} / {MAX_IMAGES}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Upload multiple images for the route gallery. Drag to reorder.
      </p>

      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {value.map((image, index) => 
                image.id ? (
                  <SortableImage
                    key={image.id}
                    image={image as { id: string; url: string }}
                    onRemove={() => handleRemove(image.id!)}
                  />
                ) : null
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {value.length < MAX_IMAGES && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${isUploading || value.length >= MAX_IMAGES ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              {isUploading ? (
                <Upload className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <Images className="h-5 w-5 text-primary" />
              )}
            </div>
            {isUploading ? (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            ) : isDragActive ? (
              <p className="text-sm text-muted-foreground">Drop images here</p>
            ) : (
              <>
                <p className="text-sm font-medium">Add more images</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, or WebP • Max 5MB each
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
