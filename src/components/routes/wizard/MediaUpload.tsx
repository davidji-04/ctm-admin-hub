import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, GripVertical, Image as ImageIcon, Film } from "lucide-react";
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

type MediaType = "image" | "video";

interface MainMediaItem {
  id?: string;
  url?: string;
  type?: MediaType;
}

interface MainMediaUploadProps {
  value: MainMediaItem[];
  onChange: (items: MainMediaItem[]) => void;
  label?: string;
  description?: string;
  maxItems?: number;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const DEFAULT_MAX_ITEMS = 1;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4"];

const detectTypeFromUrl = (url?: string): MediaType => {
  if (!url) {
    return "image";
  }

  const lower = url.toLowerCase();
  if (lower.endsWith(".mp4") || lower.includes("video")) {
    return "video";
  }

  return "image";
};

const SortableMediaCard = ({
  item,
  onRemove,
}: {
  item: { id: string; url: string; type: MediaType };
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-lg overflow-hidden border bg-card">
      {item.type === "video" ? (
        <video src={item.url} className="w-full h-48 object-cover" muted playsInline controls />
      ) : (
        <img src={item.url} alt="Main media" className="w-full h-48 object-cover" />
      )}
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

export const MainMediaUpload = ({
  value,
  onChange,
  label,
  description,
  maxItems = DEFAULT_MAX_ITEMS,
}: MainMediaUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const normalizedValue = value.map((item) => ({
    ...item,
    type: item.type ?? detectTypeFromUrl(item.url),
  }));

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (normalizedValue.length + acceptedFiles.length > maxItems) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxItems} file(s) allowed. You can add ${maxItems - normalizedValue.length} more.`,
          variant: "destructive",
        });
        return;
      }

      const validFiles: File[] = [];

      for (const file of acceptedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "File too large",
            description: `${file.name} is too large. Max size is 30MB.`,
            variant: "destructive",
          });
          continue;
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} must be JPG, PNG, WebP, or MP4.`,
            variant: "destructive",
          });
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        return;
      }

      setIsUploading(true);

      try {
        const uploadPromises = validFiles.map(async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 300));

          return {
            id: `media-${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            type: file.type === "video/mp4" ? "video" : "image",
          } as MainMediaItem;
        });

        const newItems = await Promise.all(uploadPromises);
        onChange([...normalizedValue, ...newItems]);

        toast({
          title: "Media uploaded",
          description: `${newItems.length} file(s) added`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload files. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [maxItems, normalizedValue, onChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "video/mp4": [".mp4"],
    },
    maxFiles: maxItems - normalizedValue.length,
    disabled: isUploading || normalizedValue.length >= maxItems,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = normalizedValue.findIndex((item) => item.id === active.id);
      const newIndex = normalizedValue.findIndex((item) => item.id === over.id);
      onChange(arrayMove(normalizedValue, oldIndex, newIndex));
    }
  };

  const handleRemove = (id?: string) => {
    if (!id) {
      return;
    }
    onChange(normalizedValue.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label ?? "Main Media"}</label>
        <span className="text-xs text-muted-foreground">
          {normalizedValue.length} / {maxItems}
        </span>
      </div>

      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}

      {normalizedValue.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={normalizedValue.map((item) => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4">
              {normalizedValue.map((item) =>
                item.id && item.url ? (
                  <SortableMediaCard
                    key={item.id}
                    item={{ id: item.id, url: item.url, type: item.type ?? "image" }}
                    onRemove={() => handleRemove(item.id)}
                  />
                ) : null
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {normalizedValue.length < maxItems && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          } ${isUploading || normalizedValue.length >= maxItems ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              {isUploading ? <Upload className="h-5 w-5 text-primary animate-pulse" /> : <Film className="h-5 w-5 text-primary" />}
            </div>

            {isUploading ? (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            ) : isDragActive ? (
              <p className="text-sm text-muted-foreground">Drop media here</p>
            ) : (
              <>
                <p className="text-sm font-medium">Add image or video</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP, or MP4 (preferably without audio)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
