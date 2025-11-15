import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: { id?: string; url?: string } | null;
  onChange: (file: { id: string; url: string } | null) => void;
  required?: boolean;
  label: string;
  description?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MIN_WIDTH = 1920;
const MIN_HEIGHT = 1080;

export const ImageUpload = ({
  value,
  onChange,
  required,
  label,
  description,
}: ImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const validateImageResolution = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValid = img.width >= MIN_WIDTH && img.height >= MIN_HEIGHT;
        if (!isValid) {
          toast({
            title: "Image resolution too small",
            description: `Image must be at least ${MIN_WIDTH}x${MIN_HEIGHT}px. Current: ${img.width}x${img.height}px`,
            variant: "destructive",
          });
        }
        resolve(isValid);
      };
      img.onerror = () => {
        toast({
          title: "Error loading image",
          description: "Could not validate image resolution",
          variant: "destructive",
        });
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `Maximum file size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or WebP image",
          variant: "destructive",
        });
        return;
      }

      // Validate resolution
      const isValidResolution = await validateImageResolution(file);
      if (!isValidResolution) return;

      setIsUploading(true);

      try {
        // Simulate upload
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/v1/uploads/image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        // For demo purposes, create object URL
        const objectUrl = URL.createObjectURL(file);
        onChange({
          id: data.fileId || `img-${Date.now()}`,
          url: objectUrl,
        });

        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = () => {
    onChange(null);
  };

  if (value?.id && value?.url) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
        <div className="relative rounded-lg overflow-hidden border bg-card">
          <img
            src={value.url}
            alt="Uploaded preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            Hero Image
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            {isUploading ? (
              <Upload className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <ImageIcon className="h-6 w-6 text-primary" />
            )}
          </div>
          {isUploading ? (
            <p className="text-sm text-muted-foreground">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the image here</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drop your image here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WebP • Max 5MB • Min 1920x1080px
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
