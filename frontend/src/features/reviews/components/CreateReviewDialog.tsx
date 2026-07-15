import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateReviewForm } from "./CreateReviewForm";
import { useCreateReview } from "../hooks/useCreateReview";
import type { CreateReviewFormData } from "../validation/review.schema";
import type { ReactNode } from "react";

interface CreateReviewDialogProps {
  bookingId: number;
  trigger: ReactNode;
}

export function CreateReviewDialog({ bookingId, trigger }: CreateReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createReview, isPending } = useCreateReview();

  const handleSubmit = async (data: CreateReviewFormData) => {
    try {
      await createReview({
        bookingId,
        rating: data.rating,
        comment: data.comment || undefined,
      });
      setOpen(false);
    } catch {
      // Error handled by hook's toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience to help others find great providers.
          </DialogDescription>
        </DialogHeader>
        
        <CreateReviewForm 
          onSubmit={handleSubmit} 
          isSubmitting={isPending} 
        />
      </DialogContent>
    </Dialog>
  );
}
