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
import { RichTextArea } from "./RichTextArea";
import { useWizard } from "@/contexts/WizardContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import DOMPurify from "dompurify";

// Mock user role - in real app this would come from auth context
const getUserRole = (): "admin" | "editor" => {
  return "admin";
};

const formSchema = z.object({
  descricao: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  historia_percurso: z
    .string()
    .max(2000, "Route history must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  destaques_unicos: z
    .string()
    .max(2000, "Unique highlights must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  experiencia_cultural: z
    .string()
    .max(2000, "Cultural experience must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  desafios_esperados: z
    .string()
    .max(2000, "Expected challenges must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  certificacoes: z
    .string()
    .max(2000, "Certifications must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  relatos_equipe: z
    .string()
    .max(2000, "Team notes must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

// Sanitization function
const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: [],
  });
};

export const Step4EditorialContent = () => {
  const { wizardData, updateWizardData, setCurrentStep } = useWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const userRole = getUserRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: wizardData.step4 || {
      descricao: "",
      historia_percurso: "",
      destaques_unicos: "",
      experiencia_cultural: "",
      desafios_esperados: "",
      certificacoes: "",
      relatos_equipe: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      // Sanitize all text fields
      const sanitizedData = {
        descricao: sanitizeHTML(data.descricao),
        historia_percurso: data.historia_percurso ? sanitizeHTML(data.historia_percurso) : "",
        destaques_unicos: data.destaques_unicos ? sanitizeHTML(data.destaques_unicos) : "",
        experiencia_cultural: data.experiencia_cultural ? sanitizeHTML(data.experiencia_cultural) : "",
        desafios_esperados: data.desafios_esperados ? sanitizeHTML(data.desafios_esperados) : "",
        certificacoes: data.certificacoes ? sanitizeHTML(data.certificacoes) : "",
        relatos_equipe: data.relatos_equipe ? sanitizeHTML(data.relatos_equipe) : "",
      };

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

      // Wizard now ends on step 4.
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Editorial Content</h2>
        <p className="text-muted-foreground">
          Provide rich, engaging content about your route. The main description is required, all other fields are optional.
        </p>
      </div>

      {/* Info box about content guidelines */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Content Guidelines</p>
            <p className="text-sm text-muted-foreground">
              Use the formatting toolbar to add emphasis and structure. All content is automatically
              sanitized for security. Special characters and scripts are removed.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Description */}
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-lg font-semibold text-foreground">Main Description *</h3>
              <p className="text-sm text-muted-foreground">
                Primary description of the route that users will see first
              </p>
            </div>
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Description *</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Describe the route, its main features, what makes it special..."
                      maxLength={2000}
                      minLength={100}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    100-2000 characters. This is the primary route description shown to users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Route Story */}
          <div className="space-y-4">
            <div className="border-l-4 border-accent pl-4">
              <h3 className="text-lg font-semibold text-foreground">Route Story</h3>
              <p className="text-sm text-muted-foreground">
                Historical context and background of the route
              </p>
            </div>
            <FormField
              control={form.control}
              name="historia_percurso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>History</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Share the historical background, origin, or evolution of this route..."
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>Optional - Historical context of the route</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cultural Experience */}
          <div className="space-y-4">
            <div className="border-l-4 border-accent pl-4">
              <h3 className="text-lg font-semibold text-foreground">Cultural Experience</h3>
              <p className="text-sm text-muted-foreground">
                Cultural aspects, traditions, and local experiences
              </p>
            </div>
            <FormField
              control={form.control}
              name="experiencia_cultural"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cultural Aspects</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Describe cultural experiences, local traditions, gastronomy, pilgrim culture..."
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - Cultural and traditional aspects of the route
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Unique Highlights */}
          <div className="space-y-4">
            <div className="border-l-4 border-accent pl-4">
              <h3 className="text-lg font-semibold text-foreground">Highlights</h3>
              <p className="text-sm text-muted-foreground">
                Unique features and memorable moments
              </p>
            </div>
            <FormField
              control={form.control}
              name="destaques_unicos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unique Highlights</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="What makes this route unique? Special scenery, emotional moments, standout features..."
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>Optional - Special features and highlights</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Expected Challenges */}
          <div className="space-y-4">
            <div className="border-l-4 border-accent pl-4">
              <h3 className="text-lg font-semibold text-foreground">Challenges</h3>
              <p className="text-sm text-muted-foreground">
                Difficulties and challenges to be aware of
              </p>
            </div>
            <FormField
              control={form.control}
              name="desafios_esperados"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Challenges</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Steep climbs, weather conditions, long distances, technical sections..."
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - Challenges and difficulties users should expect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="border-l-4 border-accent pl-4">
              <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
              <p className="text-sm text-muted-foreground">
                Official certifications and credentials available
              </p>
            </div>
            <FormField
              control={form.control}
              name="certificacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Compostela, official route certification, stamps available..."
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - Certificates and credentials pilgrims can obtain
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Team Notes */}
          <div className="space-y-4">
            <div className="border-l-4 border-accent pl-4">
              <h3 className="text-lg font-semibold text-foreground">Team Notes</h3>
              <p className="text-sm text-muted-foreground">
                Internal notes and observations from CTM team
              </p>
            </div>
            <FormField
              control={form.control}
              name="relatos_equipe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Team Notes</FormLabel>
                  <FormControl>
                    <RichTextArea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Internal observations, recommendations, maintenance notes..."
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - Internal notes for CTM team reference only
                  </FormDescription>
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
