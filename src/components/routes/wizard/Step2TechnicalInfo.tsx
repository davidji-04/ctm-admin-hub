import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWizard } from "@/contexts/WizardContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock user role - in real app this would come from auth context
const getUserRole = (): "admin" | "editor" => {
  return "admin";
};

const terrainTypes = [
  { value: "flat", label: "Flat" },
  { value: "mixed", label: "Mixed" },
  { value: "mountain", label: "Mountain" },
  { value: "trail", label: "Trail" },
  { value: "road", label: "Road" },
  { value: "coastal", label: "Coastal" },
  { value: "forest", label: "Forest" },
];

// Dynamic schema based on modalities
const createFormSchema = (hasAutocaravana: boolean) => {
  const baseSchema = {
    distancia_total: z.number().min(0).optional(),
    elevacao_altimetria: z.number().min(0).max(9000).optional(),
    tipo_terreno: z.string().min(1, "Terrain type is required"),
  };

  if (hasAutocaravana) {
    return z.object({
      ...baseSchema,
      altura_max_veiculo: z
        .number()
        .min(200, "Minimum height is 200 cm (2 meters)")
        .max(500, "Maximum height is 500 cm (5 meters)"),
    });
  }

  return z.object(baseSchema);
};

type FormValues = {
  distancia_total?: number;
  elevacao_altimetria?: number;
  tipo_terreno: string;
  altura_max_veiculo?: number;
};

export const Step2TechnicalInfo = () => {
  const { wizardData, updateWizardData, setCurrentStep } = useWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const userRole = getUserRole();

  // Get modalities from Step 1
  const step1Data = wizardData.step1;
  const hasAutocaravana = step1Data?.modalidade?.includes("autocaravana") || false;

  // Create schema based on modalities
  const formSchema = createFormSchema(hasAutocaravana);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: wizardData.step2 || {
      distancia_total: 0,
      elevacao_altimetria: undefined,
      tipo_terreno: "",
      altura_max_veiculo: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      // Mock API call - in production this would save to real backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Store step data
      updateWizardData("step2", data);

      toast({
        title: "Success",
        description:
          userRole === "editor"
            ? "Draft saved successfully"
            : "Technical information saved. Continue to next step.",
      });

      // Admin can continue to next step
      if (userRole === "admin") {
        setCurrentStep(3);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save technical information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Technical Information</h2>
        <p className="text-muted-foreground">
          Provide the technical details of your route. Some fields are calculated automatically.
        </p>
      </div>

      {/* Selected Modalities Preview */}
      {step1Data?.modalidade && step1Data.modalidade.length > 0 && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">Selected Modalities:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {step1Data.modalidade.map((mod) => (
              <Badge key={mod} variant="secondary">
                {mod === "a_pe" && "A pé"}
                {mod === "bicicleta" && "Bicicleta"}
                {mod === "autocaravana" && "Autocaravana"}
                {mod === "grupo" && "Grupo"}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distance - Read Only */}
            <FormField
              control={form.control}
              name="distancia_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Total Distance (km)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Calculated automatically based on localities</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || 0}
                        disabled
                        className="pr-10 bg-muted/50"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>Auto-calculated from route localities</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Elevation */}
            <FormField
              control={form.control}
              name="elevacao_altimetria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Elevation Gain (m)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total elevation gain in meters (0-9000)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 1250"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : parseFloat(val));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Optional - recommended for accuracy</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terrain Type */}
            <FormField
              control={form.control}
              name="tipo_terreno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terrain Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terrain type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {terrainTypes.map((terrain) => (
                        <SelectItem key={terrain.value} value={terrain.value}>
                          {terrain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Primary terrain type of the route</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Caravan Height - Conditional */}
            {hasAutocaravana && (
              <FormField
                control={form.control}
                name="altura_max_veiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Max Vehicle Height (cm) *
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Required for caravan/motorhome routes</p>
                            <p className="text-xs mt-1">Minimum: 200cm (2m)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 350"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : parseInt(val));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum vehicle height allowed (in centimeters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Info box about auto-calculations */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Auto-calculated Fields</p>
                <p className="text-sm text-muted-foreground">
                  The total distance will be automatically calculated based on the localities you add in
                  subsequent steps. You can also import a GPX file to populate technical data automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : userRole === "editor" ? "Save Draft" : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
