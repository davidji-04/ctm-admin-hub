import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  motivo_exclusao: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});

interface DeleteRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  routeTitle: string;
  activeItineraries?: number;
  onSuccess: () => void;
}

export const DeleteRouteModal = ({
  open,
  onOpenChange,
  routeId,
  routeTitle,
  activeItineraries = 0,
  onSuccess,
}: DeleteRouteModalProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivo_exclusao: '',
    },
  });

  const handleDelete = async (data: z.infer<typeof formSchema>) => {
    setIsDeleting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Route deleted',
        description: `${routeTitle} has been soft deleted`,
      });

      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete route. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Delete Route (Soft Delete)
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{routeTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Box */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
            <p className="text-sm font-medium">Important Information:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>This is a soft delete - the route will be hidden from the main list</li>
              {activeItineraries > 0 && (
                <li className="font-medium text-foreground">
                  {activeItineraries} active itinerary(ies) will continue to function normally
                </li>
              )}
              <li>The route can potentially be restored by administrators</li>
            </ul>
          </div>

          {/* Suggestion */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">💡 Tip:</span> Consider inactivating this route instead of
              deleting it. This keeps the route visible in your system while preventing new bookings.
            </p>
          </div>

          {/* Reason Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDelete)} className="space-y-4">
              <FormField
                control={form.control}
                name="motivo_exclusao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reason for Deletion <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please explain why you are deleting this route..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete Route'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
