import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "./ImageUpload";
import { GalleryUpload } from "./GalleryUpload";
import { GPXUpload } from "./GPXUpload";
import { useWizard } from "@/contexts/WizardContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Info, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock user role - in real app this would come from auth context
const getUserRole = (): "admin" | "editor" => {
  return "admin";
};

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
  gpxFile: z
    .object({
      id: z.string(),
      url: z.string(),
      name: z.string(),
      metadata: z
        .object({
          waypoints: z.number(),
          distance: z.number().optional(),
          elevation: z.number().optional(),
        })
        .optional(),
    })
    .nullable()
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const Step4Media = () => {
  const { wizardData, updateWizardData, resetWizard } = useWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const userRole = getUserRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: wizardData.step4 || {
      heroImage: null,
      gallery: [],
      gpxFile: null,
    },
  });

  const canPublish = () => {
    return userRole === "admin" && wizardData.step1?.status === "ativo";
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      // Store step data
      updateWizardData("step4", data);

      // Mock API call - in production this would save to real backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isPublishing = canPublish();

      toast({
        title: isPublishing ? "Route Published!" : "Route Created!",
        description: isPublishing
          ? "Your route is now live and visible to users"
          : userRole === "editor"
          ? "Draft saved successfully. An admin can review and publish."
          : "Route created successfully",
      });

      // Show confirmation dialog
      setShowConfirmDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = () => {
    resetWizard();
    navigate("/routes");
  };

  const handleBack = () => {
    // Save current data before going back
    const currentData = form.getValues();
    updateWizardData("step4", currentData);
    navigate("/routes/create?step=3");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Media & Files</h2>
          <p className="text-muted-foreground">
            Upload hero image, gallery photos, and GPX file for your route. The hero image is
            required.
          </p>
        </div>

        {/* Info box */}
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Media Requirements</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hero image must be at least 1920x1080px and max 5MB</li>
                <li>• Gallery images: max 20 images, 5MB each</li>
                <li>• GPX file: max 10MB, valid GPX format</li>
              </ul>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Hero Image */}
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-foreground">Hero Image *</h3>
                <p className="text-sm text-muted-foreground">
                  Main image that will be displayed as the route cover
                </p>
              </div>
              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      required
                      label="Hero Image"
                      description="This image represents your route and will be prominently displayed"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold text-foreground">Image Gallery</h3>
                <p className="text-sm text-muted-foreground">
                  Additional photos showcasing the route
                </p>
              </div>
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
            </div>

            {/* GPX File */}
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold text-foreground">GPX File</h3>
                <p className="text-sm text-muted-foreground">
                  Route data file for mapping and navigation
                </p>
              </div>
              <FormField
                control={form.control}
                name="gpxFile"
                render={({ field }) => (
                  <FormItem>
                    <GPXUpload value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Summary */}
            {canPublish() && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Ready to Publish</p>
                    <p className="text-sm text-muted-foreground">
                      This route will be published and become visible to all users immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : canPublish()
                  ? "Finish & Publish"
                  : userRole === "editor"
                  ? "Save Draft"
                  : "Finish"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Route Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription>
              {canPublish()
                ? "Your route has been published and is now live. Users can view and interact with it."
                : userRole === "editor"
                ? "Your draft has been saved. An administrator will review and publish the route."
                : "Your route has been created successfully. You can manage it from the routes list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleFinish}>Go to Routes List</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
