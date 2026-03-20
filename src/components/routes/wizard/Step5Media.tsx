import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "./ImageUpload";
import { GalleryUpload } from "./GalleryUpload";
import { useWizard } from "@/contexts/WizardContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Info, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  heroImage: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "Hero image is required" }),
  gallery: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export const Step5Media = () => {
  const { wizardData, updateWizardData, resetWizard, setCurrentStep } = useWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroImage: wizardData.step5?.heroImage || null,
      gallery: wizardData.step5?.gallery || [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      updateWizardData("step5", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const routeId = wizardData.routeId || `route-${Date.now()}`;
      toast({ title: "Success", description: "Route saved successfully." });
      
      resetWizard();
      navigate(`/routes/${routeId}/localities`);
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Media & Files</h2>
        <p className="text-muted-foreground">Upload the main image and gallery.</p>
      </div>

      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Media Requirements</p>
            <ul className="text-muted-foreground">
              <li>• Hero Image: min 1920x1080px (Required)</li>
              <li>• Gallery: max 20 images</li>
            </ul>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="heroImage"
            render={({ field }) => (
              <FormItem>
                <ImageUpload value={field.value} onChange={field.onChange} required label="Hero Image" />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gallery"
            render={({ field }) => (
              <FormItem>
                <GalleryUpload value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>Back</Button>
            <Button type="submit" disabled={isSaving}>Finalize Route</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};