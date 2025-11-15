import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DuplicateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  routeTitle: string;
  onSuccess: () => void;
}

export const DuplicateRouteModal = ({
  open,
  onOpenChange,
  routeId,
  routeTitle,
  onSuccess,
}: DuplicateRouteModalProps) => {
  const { toast } = useToast();
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Route duplicated',
        description: `[CÓPIA] ${routeTitle} has been created as a draft`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Duplication failed',
        description: 'Failed to duplicate route. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Duplicate Route</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to duplicate "{routeTitle}"?
            <br />
            <br />
            A new route will be created as a draft with the prefix "[CÓPIA]".
            <br />
            <br />
            The duplicated route will include:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All basic information</li>
              <li>Technical details</li>
              <li>Editorial content</li>
              <li>Localities (if any)</li>
            </ul>
            <br />
            Version history will not be copied.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDuplicating}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDuplicate} disabled={isDuplicating}>
            {isDuplicating ? 'Duplicating...' : 'Duplicate Route'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
