import { useWizard } from "@/contexts/WizardContext";
import { GPXUpload } from "./GPXUpload";
import { GpxMap } from "./GpxMap";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MapPin } from "lucide-react";

// Single source of truth for height — passed to both the wrapper div AND GpxMap
const MAP_HEIGHT = 450;

export const Step3Localities = () => {
  const { wizardData, updateWizardData, setCurrentStep } = useWizard();
  const [isSaving, setIsSaving] = useState(false);

  const gpxUrl = wizardData.step3?.gpxFile?.url;

  const handleNext = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setCurrentStep(4);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Localities and Routes</h2>
        <p className="text-muted-foreground">Upload and preview your GPX route.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left — upload */}
        <div className="lg:col-span-2">
          <GPXUpload
            value={wizardData.step3?.gpxFile}
            onChange={(file) => updateWizardData("step3", { ...wizardData.step3, gpxFile: file })}
          />
        </div>

        {/* Right — map
            IMPORTANT: set the height directly here in px so GpxMap's wrapper
            and MapContainer both have the same concrete pixel value. Do NOT
            rely on a Tailwind h-[] class on a grid cell — Leaflet reads
            offsetHeight before Tailwind has fully resolved it. */}
        <div className="lg:col-span-3" style={{ height: MAP_HEIGHT }}>
          {gpxUrl ? (
            <GpxMap gpxUrl={gpxUrl} height={MAP_HEIGHT} />
          ) : (
            <div
              style={{ height: MAP_HEIGHT }}
              className="w-full border-2 border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center text-muted-foreground p-8 text-center"
            >
              <MapPin className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Map Visualization</p>
              <p className="text-sm opacity-60 mt-1">Upload a GPX file to see the route here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
        <Button onClick={handleNext} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
};