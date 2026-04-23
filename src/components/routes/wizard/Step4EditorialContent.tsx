import { useFieldArray, useForm } from "react-hook-form";
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
import { RichTextArea } from "./RichTextArea";
import { GalleryUpload } from "./GalleryUpload";
import { MainMediaUpload } from "./MediaUpload";
import { PDFUpload } from "./PDFUpload";
import { useWizard } from "@/contexts/WizardContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Info, Plus, Trash2 } from "lucide-react";
import DOMPurify from "dompurify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Mock user role - in real app this would come from auth context
const getUserRole = (): "admin" | "editor" => {
  return "admin";
};

const difficultyOptions = ["facil", "moderado", "dificil"] as const;
const iconOptions = ["compass", "moose", "mountain", "map-pin", "alert", "info"] as const;
const availabilityOptions = ["disponivel", "ultimas-vagas", "esgotado"] as const;

const formSchema = z
  .object({
    mediaPrincipalUrl: z.string().trim().optional().or(z.literal("")),
    publicTitle: z.string().min(2, "Public title is required").max(120),
    publicLead: z.string().min(2, "Lead is required").max(180),

    introSectionTitle: z.string().min(2, "Section title is required").max(120),
    introDescription: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(4000, "Description must not exceed 4000 characters"),

    visualHighlightImageUrl: z.string().trim().optional().or(z.literal("")),
    impactText: z.string().trim().optional().or(z.literal("")),

    quickHighlights: z.array(
      z.object({
        icon: z.enum(iconOptions),
        label: z.string().min(1, "Label is required").max(80),
        value: z.string().min(1, "Value is required").max(120),
      })
    ),

    nationalMapImageUrl: z.string().trim().optional().or(z.literal("")),

    technicalDistanceKm: z.coerce.number().min(0).optional(),
    technicalAltimetryM: z.coerce.number().min(0).optional(),
    technicalDuration: z.string().trim().optional().or(z.literal("")),
    technicalDifficulty: z.enum(difficultyOptions).optional(),

    routeGpxUrl: z.string().trim().optional().or(z.literal("")),

    itinerary: z.array(
      z.object({
        dayTitle: z.string().min(1, "Day title is required").max(80),
        startPoint: z.string().min(1, "Start point is required").max(120),
        endPoint: z.string().min(1, "End point is required").max(120),
        stageDistanceKm: z.coerce.number().min(0).optional(),
        stageNotes: z.string().max(4000).optional().or(z.literal("")),
      })
    ),

    recommendedSeason: z.string().trim().optional().or(z.literal("")),
    accommodationAndSupply: z.string().max(4000).optional().or(z.literal("")),
    arrivalLogistics: z.string().max(4000).optional().or(z.literal("")),

    curiosities: z.array(
      z.object({
        imageUrl: z.string().trim().optional().or(z.literal("")),
        title: z.string().min(1, "Title is required").max(100),
        text: z.string().min(1, "Text is required").max(300),
      })
    ),

    etiquetteRules: z.array(
      z.object({
        icon: z.enum(iconOptions),
        title: z.string().min(1, "Rule title is required").max(100),
        description: z.string().min(1, "Description is required").max(500),
      })
    ),

    seasonalAlertEnabled: z.boolean(),
    seasonalAlertTitle: z.string().max(120).optional().or(z.literal("")),
    seasonalAlertMessage: z.string().max(500).optional().or(z.literal("")),

    lifestyleGalleryUrls: z.array(z.string().trim().optional().or(z.literal(""))),
    prepManualPdfUrl: z.string().trim().optional().or(z.literal("")),
    equipmentChecklistPdfUrl: z.string().trim().optional().or(z.literal("")),
    essentialEquipment: z.array(z.string().trim().max(120)),

    calendarPrices: z.array(
      z.object({
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        status: z.enum(availabilityOptions),
        pricePerPerson: z.coerce.number().min(0, "Price must be non-negative"),
        includes: z.string().max(2000).optional().or(z.literal("")),
      })
    ),

    extras: z.array(
      z.object({
        thumbnailUrl: z.string().trim().optional().or(z.literal("")),
        name: z.string().min(1, "Extra name is required").max(120),
        additionalPrice: z.coerce.number().min(0, "Additional price must be non-negative"),
      })
    ),

    leadEmail: z.string().email("A valid lead email is required"),
  })
  .superRefine((data, ctx) => {
    if (data.seasonalAlertEnabled) {
      if (!data.seasonalAlertTitle?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Alert title is required when seasonal alert is enabled",
          path: ["seasonalAlertTitle"],
        });
      }
      if (!data.seasonalAlertMessage?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Alert message is required when seasonal alert is enabled",
          path: ["seasonalAlertMessage"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

// Sanitization function
const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: [],
  });
};

const defaultFormValues: FormValues = {
  mediaPrincipalUrl: "",
  publicTitle: "",
  publicLead: "",
  introSectionTitle: "",
  introDescription: "",
  visualHighlightImageUrl: "",
  impactText: "",
  quickHighlights: [{ icon: "compass", label: "", value: "" }],
  nationalMapImageUrl: "",
  technicalDistanceKm: undefined,
  technicalAltimetryM: undefined,
  technicalDuration: "",
  technicalDifficulty: undefined,
  routeGpxUrl: "",
  itinerary: [],
  recommendedSeason: "",
  accommodationAndSupply: "",
  arrivalLogistics: "",
  curiosities: [],
  etiquetteRules: [],
  seasonalAlertEnabled: false,
  seasonalAlertTitle: "",
  seasonalAlertMessage: "",
  lifestyleGalleryUrls: [""],
  prepManualPdfUrl: "",
  equipmentChecklistPdfUrl: "",
  essentialEquipment: [""],
  calendarPrices: [],
  extras: [],
  leadEmail: "",
};

const sanitizeValues = (data: FormValues): FormValues => ({
  ...data,
  introDescription: sanitizeHTML(data.introDescription),
  itinerary: data.itinerary.map((item) => ({
    ...item,
    stageNotes: item.stageNotes ? sanitizeHTML(item.stageNotes) : "",
  })),
  accommodationAndSupply: data.accommodationAndSupply ? sanitizeHTML(data.accommodationAndSupply) : "",
  arrivalLogistics: data.arrivalLogistics ? sanitizeHTML(data.arrivalLogistics) : "",
  calendarPrices: data.calendarPrices.map((item) => ({
    ...item,
    includes: item.includes ? sanitizeHTML(item.includes) : "",
  })),
});

const toImageValue = (value?: string) => (value ? [{ id: value, url: value }] : []);

const fromImageValue = (images: Array<{ url?: string }>) => images[0]?.url ?? "";

const toMainMediaValue = (value?: string) => (value ? [{ id: value, url: value }] : []);

const fromMainMediaValue = (items: Array<{ url?: string }>) => items[0]?.url ?? "";

const toPdfValue = (value?: string) =>
  value ? { id: value, url: value, name: value.split("/").filter(Boolean).pop() } : null;

const fromPdfValue = (file: { url?: string } | null) => file?.url ?? "";

const toGalleryValue = (values: string[] = []) =>
  values.filter(Boolean).map((url, index) => ({ id: `${url}-${index}`, url }));

const fromGalleryValue = (images: Array<{ url?: string }>) =>
  images.map((image) => image.url ?? "").filter(Boolean);

const createEmptyItineraryStage = () => ({
  dayTitle: "",
  startPoint: "",
  endPoint: "",
  stageDistanceKm: undefined,
  stageNotes: "",
});

const createEmptyCuriosity = () => ({
  imageUrl: "",
  title: "",
  text: "",
});

const createEmptyEtiquetteRule = () => ({
  icon: "info" as const,
  title: "",
  description: "",
});

const createEmptyCalendarPrice = () => ({
  startDate: "",
  endDate: "",
  status: "disponivel" as const,
  pricePerPerson: 0,
  includes: "",
});

const createEmptyExtra = () => ({
  thumbnailUrl: "",
  name: "",
  additionalPrice: 0,
});

const mergeDefaults = (current?: Partial<FormValues>): FormValues => {
  if (!current) {
    return defaultFormValues;
  }

  return {
    ...defaultFormValues,
    ...current,
    quickHighlights: current.quickHighlights?.length ? current.quickHighlights : defaultFormValues.quickHighlights,
    itinerary: current.itinerary ?? defaultFormValues.itinerary,
    curiosities: current.curiosities ?? defaultFormValues.curiosities,
    etiquetteRules: current.etiquetteRules ?? defaultFormValues.etiquetteRules,
    lifestyleGalleryUrls: current.lifestyleGalleryUrls?.length
      ? current.lifestyleGalleryUrls
      : defaultFormValues.lifestyleGalleryUrls,
    essentialEquipment: current.essentialEquipment?.length
      ? current.essentialEquipment
      : defaultFormValues.essentialEquipment,
    calendarPrices: current.calendarPrices ?? defaultFormValues.calendarPrices,
    extras: current.extras ?? defaultFormValues.extras,
  };
};

export const Step4EditorialContent = () => {
  const { wizardData, updateWizardData, setCurrentStep } = useWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const userRole = getUserRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: mergeDefaults(wizardData.step4),
  });

  const quickHighlightsArray = useFieldArray({ control: form.control, name: "quickHighlights" });
  const itineraryArray = useFieldArray({ control: form.control, name: "itinerary" });
  const curiositiesArray = useFieldArray({ control: form.control, name: "curiosities" });
  const etiquetteRulesArray = useFieldArray({ control: form.control, name: "etiquetteRules" });
  const calendarArray = useFieldArray({ control: form.control, name: "calendarPrices" });
  const extrasArray = useFieldArray({ control: form.control, name: "extras" });

  const seasonalAlertEnabled = form.watch("seasonalAlertEnabled");
  const equipmentList = form.watch("essentialEquipment");

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const sanitizedData = sanitizeValues(data);

      // Mock API call - in production this would save to real backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Store step data
      updateWizardData("step4", sanitizedData);

      toast({
        title: "Success",
        description:
          userRole === "editor"
            ? "Draft saved successfully"
            : "Editorial content saved successfully.",
      });

      if (userRole === "admin") {
        navigate("/routes");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save editorial content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  const handleAddItineraryStage = async () => {
    const currentStages = form.getValues("itinerary");

    if (currentStages.length > 0) {
      const stageFieldPaths = currentStages.flatMap((_, index) => [
        `itinerary.${index}.dayTitle`,
        `itinerary.${index}.stageDistanceKm`,
        `itinerary.${index}.startPoint`,
        `itinerary.${index}.endPoint`,
      ]) as Array<
        | `itinerary.${number}.dayTitle`
        | `itinerary.${number}.stageDistanceKm`
        | `itinerary.${number}.startPoint`
        | `itinerary.${number}.endPoint`
      >;

      const isCurrentStagesValid = await form.trigger(stageFieldPaths);

      if (!isCurrentStagesValid) {
        toast({
          title: "Campos obrigatórios em falta",
          description: "Preencha os campos obrigatórios do itinerário antes de adicionar outra etapa.",
          variant: "destructive",
        });
        return;
      }
    }

    itineraryArray.append(createEmptyItineraryStage());
  };

  const handleAddCuriosityCard = async () => {
    const currentCuriosities = form.getValues("curiosities");

    if (currentCuriosities.length > 0) {
      const curiosityFieldPaths = currentCuriosities.flatMap((_, index) => [
        `curiosities.${index}.title`,
        `curiosities.${index}.imageUrl`,
        `curiosities.${index}.text`,
      ]) as Array<
        | `curiosities.${number}.title`
        | `curiosities.${number}.imageUrl`
        | `curiosities.${number}.text`
      >;

      const isCurrentCuriositiesValid = await form.trigger(curiosityFieldPaths);

      if (!isCurrentCuriositiesValid) {
        toast({
          title: "Campos obrigatórios em falta",
          description: "Preencha o título, a imagem e o texto da curiosidade antes de adicionar outra.",
          variant: "destructive",
        });
        return;
      }
    }

    curiositiesArray.append(createEmptyCuriosity());
  };

  const handleAddEtiquetteRule = async () => {
    const currentRules = form.getValues("etiquetteRules");

    if (currentRules.length > 0) {
      const ruleFieldPaths = currentRules.flatMap((_, index) => [
        `etiquetteRules.${index}.icon`,
        `etiquetteRules.${index}.title`,
        `etiquetteRules.${index}.description`,
      ]) as Array<
        | `etiquetteRules.${number}.icon`
        | `etiquetteRules.${number}.title`
        | `etiquetteRules.${number}.description`
      >;

      const isCurrentRulesValid = await form.trigger(ruleFieldPaths);

      if (!isCurrentRulesValid) {
        toast({
          title: "Campos obrigatórios em falta",
          description: "Preencha o ícone, o título e a descrição da regra antes de adicionar outra.",
          variant: "destructive",
        });
        return;
      }
    }

    etiquetteRulesArray.append(createEmptyEtiquetteRule());
  };

  const handleAddCalendarPrice = async () => {
    const currentCalendarPrices = form.getValues("calendarPrices");

    if (currentCalendarPrices.length > 0) {
      const calendarFieldPaths = currentCalendarPrices.flatMap((_, index) => [
        `calendarPrices.${index}.startDate`,
        `calendarPrices.${index}.endDate`,
        `calendarPrices.${index}.status`,
        `calendarPrices.${index}.pricePerPerson`,
      ]) as Array<
        | `calendarPrices.${number}.startDate`
        | `calendarPrices.${number}.endDate`
        | `calendarPrices.${number}.status`
        | `calendarPrices.${number}.pricePerPerson`
      >;

      const isCurrentCalendarValid = await form.trigger(calendarFieldPaths);

      if (!isCurrentCalendarValid) {
        toast({
          title: "Campos obrigatórios em falta",
          description: "Preencha a data, estado e preço da entrada atual antes de adicionar outra.",
          variant: "destructive",
        });
        return;
      }
    }

    calendarArray.append(createEmptyCalendarPrice());
  };

  const handleAddExtra = async () => {
    const currentExtras = form.getValues("extras");

    if (currentExtras.length > 0) {
      const extraFieldPaths = currentExtras.flatMap((_, index) => [
        `extras.${index}.thumbnailUrl`,
        `extras.${index}.name`,
        `extras.${index}.additionalPrice`,
      ]) as Array<
        | `extras.${number}.thumbnailUrl`
        | `extras.${number}.name`
        | `extras.${number}.additionalPrice`
      >;

      const isCurrentExtrasValid = await form.trigger(extraFieldPaths);

      if (!isCurrentExtrasValid) {
        toast({
          title: "Campos obrigatórios em falta",
          description: "Preencha a imagem e o nome do extra atual antes de adicionar outro.",
          variant: "destructive",
        });
        return;
      }
    }

    extrasArray.append(createEmptyExtra());
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Route Content Configuration</h2>
        <p className="text-muted-foreground">
          This step follows the full PDF specification: Discover, Detail, Good to Know, and Sales/Configuration.
        </p>
      </div>

      {/* Info box about content guidelines */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">PDF Requirements Applied</p>
            <p className="text-sm text-muted-foreground">
              Fill all blocks requested in the document: hero, technical sheet, itinerary, curiosities,
              alerts, gallery, documentation, schedules, extras, and lead routing email.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-lg font-semibold text-foreground">Descubra</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mediaPrincipalUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <MainMediaUpload
                        value={toMainMediaValue(field.value)}
                        onChange={(items) => field.onChange(fromMainMediaValue(items))}
                        label="Media Principal"
                        maxItems={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título Público *</FormLabel>
                    <FormControl>
                      <Input placeholder="KUNGSLEDEN" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicLead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo *</FormLabel>
                    <FormControl>
                      <Input placeholder="O Chamamento do Ártico" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introSectionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Introdução *</FormLabel>
                    <FormControl>
                      <Input placeholder="O Caminho do Rei" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="impactText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de Impacto *</FormLabel>
                    <FormControl>
                      <Input placeholder="A Última Fronteira da Europa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visualHighlightImageUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormControl>
                      <GalleryUpload
                        value={toImageValue(field.value)}
                        onChange={(images) => field.onChange(fromImageValue(images))}
                        label="Imagem de Fundo"
                        maxImages={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introDescription"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Texto Descritivo da Introdução *</FormLabel>
                    <FormControl>
                      <RichTextArea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Texto introdutório do percurso..."
                        maxLength={4000}
                        minLength={20}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Resumo Rápido (Features/Badges)</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickHighlightsArray.append({ icon: "compass", label: "", value: "" })}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Destaque
              </Button>
            </div>
            {quickHighlightsArray.fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-md">
                <FormField
                  control={form.control}
                  name={`quickHighlights.${index}.icon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`quickHighlights.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rótulo *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`quickHighlights.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => quickHighlightsArray.remove(index)}
                    disabled={quickHighlightsArray.fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <FormField
              control={form.control}
              name="nationalMapImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <GalleryUpload
                      value={toImageValue(field.value)}
                      onChange={(images) => field.onChange(fromImageValue(images))}
                      label="Imagem Mapa Nacional"
                      maxImages={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-lg font-semibold text-foreground">Em Detalhe</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Itinerário Dia-a-Dia</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItineraryStage}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Etapa
              </Button>
            </div>

            {itineraryArray.fields.map((item, index) => (
              <div key={item.id} className="space-y-3 p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.dayTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título / Dia *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dia 1" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.stageDistanceKm`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distância da Etapa (km) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.startPoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ponto de Partida *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`itinerary.${index}.endPoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ponto de Chegada *</FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`itinerary.${index}.stageNotes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações / Descrição</FormLabel>
                      <FormControl>
                        <RichTextArea
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Observações para esta etapa"
                          maxLength={4000}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => itineraryArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <FormField
              control={form.control}
              name="recommendedSeason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Época Recomendada *</FormLabel>
                  <FormControl>
                    <Input placeholder="Fevereiro/Março para Ski" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accommodationAndSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alojamento e Abastecimento *</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Onde dormir e onde recolher água/comida"
                      maxLength={4000}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arrivalLogistics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logística para Chegar *</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Como viajar até ao ponto de partida"
                      maxLength={4000}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-lg font-semibold text-foreground">Bom Saber</h3>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Curiosidades</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCuriosityCard}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Cartão
              </Button>
            </div>

            {curiositiesArray.fields.map((item, index) => (
              <div key={item.id} className="space-y-3 p-4 border rounded-md">
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`curiosities.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Título da Curiosidade *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => curiositiesArray.remove(index)}
                    className="mb-0.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`curiosities.${index}.imageUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <GalleryUpload
                          value={toImageValue(field.value)}
                          onChange={(images) => field.onChange(fromImageValue(images))}
                          label="Imagem da Curiosidade *"
                          maxImages={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`curiosities.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto Curto (máx. 300) *</FormLabel>
                      <FormControl>
                        <Textarea maxLength={300} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Guia de Etiqueta e Regras</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEtiquetteRule}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Regra
              </Button>
            </div>

            {etiquetteRulesArray.fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-md">
                <FormField
                  control={form.control}
                  name={`etiquetteRules.${index}.icon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`etiquetteRules.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`etiquetteRules.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-4 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => etiquetteRulesArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="space-y-3 p-4 border rounded-md">
              <FormField
                control={form.control}
                name="seasonalAlertEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Ativar Alerta Sazonal</FormLabel>
                      <FormDescription>
                        When enabled, title and alert message are required.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {seasonalAlertEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="seasonalAlertTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Alerta *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seasonalAlertMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem do Alerta *</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="lifestyleGalleryUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <GalleryUpload
                        value={toGalleryValue(field.value)}
                        onChange={(images) => field.onChange(fromGalleryValue(images))}
                        label="Galeria de Imagens"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prepManualPdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PDFUpload
                        value={toPdfValue(field.value)}
                        onChange={(file) => field.onChange(fromPdfValue(file))}
                        label="Manual de Preparação"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipmentChecklistPdfUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PDFUpload
                        value={toPdfValue(field.value)}
                        onChange={(file) => field.onChange(fromPdfValue(file))}
                        label="Checklist de Equipamento"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Equipamento Essencial</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => form.setValue("essentialEquipment", [...equipmentList, ""], { shouldDirty: true })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                </Button>
              </div>
              {equipmentList.map((_, index) => (
                <div key={`equipment-${index}`} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`essentialEquipment.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Saco de cama de Inverno" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      form.setValue(
                        "essentialEquipment",
                        equipmentList.filter((__, i) => i !== index),
                        { shouldDirty: true }
                      )
                    }
                    disabled={equipmentList.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-lg font-semibold text-foreground">A Tua Versão</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Calendário e Preços</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                    onClick={handleAddCalendarPrice}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Data
                </Button>
              </div>

              {calendarArray.fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`calendarPrices.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`calendarPrices.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fim</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`calendarPrices.${index}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="disponivel">Disponível</SelectItem>
                            <SelectItem value="ultimas-vagas">Últimas Vagas</SelectItem>
                            <SelectItem value="esgotado">Esgotado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`calendarPrices.${index}.pricePerPerson`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço/Pessoa (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => calendarArray.remove(index)}
                      disabled={calendarArray.fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`calendarPrices.${index}.includes`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-5">
                        <FormLabel>O que inclui</FormLabel>
                        <FormControl>
                          <RichTextArea
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Bullets/lista do que inclui"
                            maxLength={2000}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Configurador de Extras</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExtra}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Extra
                </Button>
              </div>

              {extrasArray.fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`extras.${index}.thumbnailUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <GalleryUpload
                            value={toImageValue(field.value)}
                            onChange={(images) => field.onChange(fromImageValue(images))}
                            label="Imagem Miniatura *"
                            maxImages={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`extras.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Extra *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`extras.${index}.additionalPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Adicional *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => extrasArray.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="leadEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receção de Leads (E-mail)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="reservas@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
