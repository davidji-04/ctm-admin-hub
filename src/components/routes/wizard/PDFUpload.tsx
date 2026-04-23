import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFFile {
  id?: string;
  url?: string;
  name?: string;
}

interface PDFUploadProps {
  value?: PDFFile | null;
  onChange: (file: PDFFile | null) => void;
  required?: boolean;
  label: string;
  description?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["application/pdf"];

const getFileNameFromUrl = (url?: string) => {
  if (!url) return "PDF file";

  try {
    const parsed = new URL(url, window.location.origin);
    const lastSegment = parsed.pathname.split("/").filter(Boolean).pop();
    return lastSegment ? decodeURIComponent(lastSegment) : "PDF file";
  } catch {
    const lastSegment = url.split("/").filter(Boolean).pop();
    return lastSegment || "PDF file";
  }
};

export const PDFUpload = ({ value, onChange, required, label, description }: PDFUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `Maximum file size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          variant: "destructive",
        });
        return;
      }

      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const objectUrl = URL.createObjectURL(file);
        onChange({
          id: `pdf-${Date.now()}`,
          url: objectUrl,
          name: file.name,
        });

        toast({
          title: "PDF uploaded",
          description: "Your PDF has been uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload PDF. Please try again.",
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
      "application/pdf": [".pdf"],
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

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium truncate">{value.name ?? getFileNameFromUrl(value.url)}</p>
              <p className="text-xs text-muted-foreground">PDF ready to use</p>
            </div>
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
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            {isUploading ? (
              <Upload className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <FileText className="h-6 w-6 text-primary" />
            )}
          </div>
          {isUploading ? (
            <p className="text-sm text-muted-foreground">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the PDF here</p>
          ) : (
            <>
              <p className="text-sm font-medium">Drop your PDF here or click to browse</p>
              <p className="text-xs text-muted-foreground">PDF only • Max 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
