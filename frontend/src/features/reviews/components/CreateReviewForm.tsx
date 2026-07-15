import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReviewSchema, type CreateReviewFormData } from "../validation/review.schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingInput } from "./RatingInput";
import { Loader2 } from "lucide-react";

interface CreateReviewFormProps {
  onSubmit: (data: CreateReviewFormData) => void;
  isSubmitting?: boolean;
}

export function CreateReviewForm({ onSubmit, isSubmitting = false }: CreateReviewFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Rating</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <RatingInput
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Review (Optional)</Label>
        <Textarea 
          id="comment"
          placeholder="Share details of your experience..." 
          className="resize-none h-32"
          disabled={isSubmitting}
          {...register("comment")}
        />
        {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </form>
  );
}
