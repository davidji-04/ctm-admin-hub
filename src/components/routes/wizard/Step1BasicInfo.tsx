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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useWizard } from "@/contexts/WizardContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock user role - in real app this would come from auth context
const getUserRole = (): "admin" | "editor" => {
  // Change return value to "editor" to test editor mode
  return "admin";
};

const countries = [
  { code: "PT", name: "Portugal" },
  { code: "ES", name: "Spain" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "DE", name: "Germany" },
];

const modalidades = [
  { id: "a_pe", label: "A pé" },
  { id: "bicicleta", label: "Bicicleta" },
  { id: "autocaravana", label: "Autocaravana" },
  { id: "grupo", label: "Grupo" },
];

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must not exceed 255 characters"),
  localidade_pais: z.string().min(1, "Country is required"),
  categoria: z.enum(["free", "premium"], {
    required_error: "Category is required",
  }),
  modalidade: z.array(z.string()).min(1, "Select at least one modality"),
  dificuldade_geral: z.enum(["facil", "media", "dificil"], {
    required_error: "Difficulty is required",
  }),
  status: z.enum(["rascunho", "ativo", "inativo"]),
});

type FormValues = z.infer<typeof formSchema>;

export const Step1BasicInfo = () => {
  const { wizardData, updateWizardData, setCurrentStep } = useWizard();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const userRole = getUserRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: wizardData.step1 || {
      title: "",
      localidade_pais: "",
      categoria: undefined,
      modalidade: [],
      dificuldade_geral: undefined,
      status: userRole === "editor" ? "rascunho" : "rascunho",
    },
  });

  const checkTitleUniqueness = async (title: string, country: string) => {
    setIsChecking(true);
    try {
      // Simulate API call
      const response = await fetch(
        `/api/v1/routes?title=${encodeURIComponent(title)}&country=${country}`
      );
      const data = await response.json();
      
      if (data.exists) {
        form.setError("title", {
          type: "manual",
          message: "A route with this title already exists in this country.",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking title uniqueness:", error);
      // For demo purposes, allow continuation
      return true;
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Override status for editors
    if (userRole === "editor") {
      data.status = "rascunho";
    }

    // Check title uniqueness
    const country = data.localidade_pais;
    const isUnique = await checkTitleUniqueness(data.title, country);
    
    if (!isUnique) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      const response = await fetch("/api/v1/routes", {
        method: wizardData.routeId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          id: wizardData.routeId,
        }),
      });

      const result = await response.json();
      
      // Store route ID and step data
      updateWizardData("routeId", result.id || "mock-route-id");
      updateWizardData("step1", data);

      toast({
        title: "Success",
        description: userRole === "editor" 
          ? "Draft saved successfully" 
          : "Basic information saved. Continue to next step.",
      });

      // Admin can continue to next step
      if (userRole === "admin") {
        setCurrentStep(2);
      } else {
        // Editor stays on same step or returns to list
        navigate("/routes");
      }
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

  const handleCancel = () => {
    navigate("/routes");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Basic Information</h2>
        <p className="text-muted-foreground">
          Enter the fundamental details of your route. All fields marked with * are required.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Route Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Caminho da Serra" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be unique per country (5-255 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localidade_pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
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
              name="dificuldade_geral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="facil">Easy</SelectItem>
                      <SelectItem value="media">Medium</SelectItem>
                      <SelectItem value="dificil">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Category *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="free" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Free</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="premium" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Premium</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modalidade"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Modalities *</FormLabel>
                  <FormDescription>Select at least one activity type</FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {modalidades.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="modalidade"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== item.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={userRole === "editor"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rascunho">Draft</SelectItem>
                    {userRole === "admin" && (
                      <>
                        <SelectItem value="ativo">Active</SelectItem>
                        <SelectItem value="inativo">Inactive</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {userRole === "editor" && (
                  <FormDescription>
                    Editors can only save as Draft
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isChecking}>
              {isSaving
                ? "Saving..."
                : isChecking
                ? "Checking..."
                : userRole === "editor"
                ? "Save Draft"
                : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
