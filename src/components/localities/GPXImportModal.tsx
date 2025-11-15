import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Check } from 'lucide-react';
import { LocalityMap } from './LocalityMap';
import { Locality, LocalityFormData } from '@/types/locality';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface GPXPoint {
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
}

interface GPXImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (localities: LocalityFormData[]) => Promise<void>;
  routeId: string;
}

const parseGPXFile = async (file: File): Promise<GPXPoint[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');

        // Check for GPX root element
        const gpxElement = xmlDoc.getElementsByTagName('gpx')[0];
        if (!gpxElement) {
          reject(new Error('Invalid GPX file'));
          return;
        }

        const points: GPXPoint[] = [];

        // Parse waypoints
        const waypoints = xmlDoc.getElementsByTagName('wpt');
        for (let i = 0; i < waypoints.length; i++) {
          const wpt = waypoints[i];
          const lat = parseFloat(wpt.getAttribute('lat') || '0');
          const lon = parseFloat(wpt.getAttribute('lon') || '0');
          const name = wpt.getElementsByTagName('name')[0]?.textContent || `Point ${i + 1}`;
          const ele = wpt.getElementsByTagName('ele')[0]?.textContent;

          points.push({
            name,
            latitude: lat,
            longitude: lon,
            elevation: ele ? parseFloat(ele) : undefined,
          });
        }

        // Parse track points if no waypoints
        if (points.length === 0) {
          const trackPoints = xmlDoc.getElementsByTagName('trkpt');
          for (let i = 0; i < trackPoints.length; i++) {
            const trkpt = trackPoints[i];
            const lat = parseFloat(trkpt.getAttribute('lat') || '0');
            const lon = parseFloat(trkpt.getAttribute('lon') || '0');
            const ele = trkpt.getElementsByTagName('ele')[0]?.textContent;

            // Sample every 10th point to avoid too many localities
            if (i % 10 === 0) {
              points.push({
                name: `Trackpoint ${Math.floor(i / 10) + 1}`,
                latitude: lat,
                longitude: lon,
                elevation: ele ? parseFloat(ele) : undefined,
              });
            }
          }
        }

        resolve(points);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const GPXImportModal = ({ open, onOpenChange, onImport, routeId }: GPXImportModalProps) => {
  const { toast } = useToast();
  const [points, setPoints] = useState<GPXPoint[]>([]);
  const [editableNames, setEditableNames] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'GPX file must be smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      try {
        const parsedPoints = await parseGPXFile(file);

        if (parsedPoints.length === 0) {
          toast({
            title: 'No points found',
            description: 'The GPX file does not contain any waypoints or track points',
            variant: 'destructive',
          });
          return;
        }

        setPoints(parsedPoints);
        setEditableNames(parsedPoints.map((p) => p.name));

        toast({
          title: 'GPX file loaded',
          description: `Found ${parsedPoints.length} points`,
        });
      } catch (error) {
        toast({
          title: 'Failed to parse GPX',
          description: 'The file is not a valid GPX format',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/gpx+xml': ['.gpx'],
      'text/xml': ['.gpx'],
      'application/xml': ['.gpx'],
    },
    maxFiles: 1,
  });

  const handleRemovePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
    setEditableNames(editableNames.filter((_, i) => i !== index));
  };

  const handleNameChange = (index: number, newName: string) => {
    const newNames = [...editableNames];
    newNames[index] = newName;
    setEditableNames(newNames);
  };

  const handleConfirmImport = async () => {
    if (points.length < 2) {
      toast({
        title: 'Not enough points',
        description: 'A route must have at least 2 localities',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    try {
      const localityData: LocalityFormData[] = points.map((point, index) => ({
        nome: editableNames[index] || point.name,
        latitude: point.latitude,
        longitude: point.longitude,
        elevacao_altimetria: point.elevation,
        dificuldade_nivel_tecnico: 'media' as const,
        observacao: '',
        selo_badge: '',
      }));

      await onImport(localityData);

      toast({
        title: 'Success',
        description: `Imported ${points.length} localities from GPX`,
      });

      setPoints([]);
      setEditableNames([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Failed to import localities. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const previewLocalities: Locality[] = points.map((point, index) => ({
    id: `preview-${index}`,
    percurso_id: routeId,
    nome: editableNames[index] || point.name,
    ordem_no_percurso: index,
    latitude: point.latitude,
    longitude: point.longitude,
    elevacao_altimetria: point.elevation,
    distancia_localidade_anterior: 0,
    tempo_estimado_da_anterior: 0,
    dificuldade_nivel_tecnico: 'media',
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Localities from GPX</DialogTitle>
        </DialogHeader>

        {points.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              {isDragActive ? (
                <p className="text-lg">Drop the GPX file here</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drop your GPX file or click to browse</p>
                  <p className="text-sm text-muted-foreground">GPX format • Max 10MB</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 flex-1 overflow-hidden">
            {/* Points List */}
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Points ({points.length})</h3>
                <Badge variant="secondary">{points.length} localities will be created</Badge>
              </div>

              {points.map((point, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Input
                        value={editableNames[index]}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder="Locality name"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePoint(index)}
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Lat: {point.latitude.toFixed(6)}, Lon: {point.longitude.toFixed(6)}</div>
                    {point.elevation && <div>Elevation: {Math.round(point.elevation)}m</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Map Preview */}
            <div className="space-y-2">
              <h3 className="font-semibold">Route Preview</h3>
              <LocalityMap localities={previewLocalities} height="h-[550px]" />
            </div>
          </div>
        )}

        {points.length > 0 && (
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setPoints([]);
                setEditableNames([]);
              }}
            >
              Clear
            </Button>
            <Button onClick={handleConfirmImport} disabled={isImporting}>
              <Check className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : `Import ${points.length} Localities`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
