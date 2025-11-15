import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, FileText, Eye, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface GPXFile {
  id?: string;
  url?: string;
  name?: string;
  metadata?: {
    waypoints?: number;
    distance?: number;
    elevation?: number;
  };
}

interface GPXUploadProps {
  value?: GPXFile | null;
  onChange: (file: GPXFile | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const GPXUpload = ({ value, onChange }: GPXUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const validateGPXFile = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, "text/xml");

          // Check for GPX root element
          const gpxElement = xmlDoc.getElementsByTagName("gpx")[0];
          if (!gpxElement) {
            toast({
              title: "Invalid GPX file",
              description: "File does not contain valid GPX data",
              variant: "destructive",
            });
            resolve(false);
            return;
          }

          resolve(true);
        } catch (error) {
          toast({
            title: "Invalid GPX file",
            description: "Failed to parse GPX file",
            variant: "destructive",
          });
          resolve(false);
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Could not read the GPX file",
          variant: "destructive",
        });
        resolve(false);
      };
      reader.readAsText(file);
    });
  };

  const extractGPXMetadata = async (file: File): Promise<GPXFile["metadata"]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, "text/xml");

          const waypoints = xmlDoc.getElementsByTagName("wpt").length;
          const trackPoints = xmlDoc.getElementsByTagName("trkpt").length;

          // Mock distance and elevation for demo
          const metadata = {
            waypoints: waypoints || trackPoints,
            distance: 125.5, // km (in real app, calculate from coordinates)
            elevation: 2340, // m (in real app, extract from GPX)
          };

          resolve(metadata);
        } catch (error) {
          resolve({ waypoints: 0 });
        }
      };
      reader.readAsText(file);
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
          description: `Maximum file size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          variant: "destructive",
        });
        return;
      }

      // Validate GPX format
      const isValid = await validateGPXFile(file);
      if (!isValid) return;

      setIsUploading(true);

      try {
        // Extract metadata
        const metadata = await extractGPXMetadata(file);

        // Mock upload - in production this would upload to real backend
        await new Promise((resolve) => setTimeout(resolve, 600));

        onChange({
          id: `gpx-${Date.now()}`,
          url: URL.createObjectURL(file),
          name: file.name,
          metadata,
        });

        toast({
          title: "GPX file uploaded",
          description: "Your GPX file has been uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload GPX file. Please try again.",
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
      "application/gpx+xml": [".gpx"],
      "text/xml": [".gpx"],
      "application/xml": [".gpx"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = () => {
    onChange(null);
  };

  if (value?.id && value?.url) {
    return (
      <>
        <div className="space-y-2">
          <label className="text-sm font-medium">GPX File (Optional)</label>
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">{value.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {value.metadata?.waypoints && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {value.metadata.waypoints} points
                      </Badge>
                    )}
                    {value.metadata?.distance && (
                      <Badge variant="secondary" className="text-xs">
                        {value.metadata.distance} km
                      </Badge>
                    )}
                    {value.metadata?.elevation && (
                      <Badge variant="secondary" className="text-xs">
                        ↑ {value.metadata.elevation}m
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>GPX Preview</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">File Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Filename:</span>
                      <span className="font-medium">{value.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Waypoints:</span>
                      <span className="font-medium">{value.metadata?.waypoints || 0}</span>
                    </div>
                    {value.metadata?.distance && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{value.metadata.distance} km</span>
                      </div>
                    )}
                    {value.metadata?.elevation && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Elevation Gain:</span>
                        <span className="font-medium">{value.metadata.elevation}m</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Full route visualization and locality extraction will be available in the
                    Localities Management module.
                  </p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg border h-64 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Map preview</p>
                  <p className="text-xs text-muted-foreground">
                    Route visualization coming soon
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">GPX File (Optional)</label>
      <p className="text-sm text-muted-foreground">
        Upload a GPX file to automatically extract route data and waypoints
      </p>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            {isUploading ? (
              <Upload className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
          </div>
          {isUploading ? (
            <p className="text-sm text-muted-foreground">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the GPX file here</p>
          ) : (
            <>
              <p className="text-sm font-medium">Drop your GPX file or click to browse</p>
              <p className="text-xs text-muted-foreground">GPX format • Max 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
