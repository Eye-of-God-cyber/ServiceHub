import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function RatingInput({ value, onChange, disabled = false }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (e.key >= '1' && e.key <= '5') {
      onChange(parseInt(e.key, 10));
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      onChange(Math.min(5, value + 1));
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      onChange(Math.max(1, value - 1));
      e.preventDefault();
    }
  };

  return (
    <div 
      className={cn("flex gap-1", disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}
      role="radiogroup"
      aria-label="Rating"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverValue ?? value) >= star;
        return (
          <div
            key={star}
            role="radio"
            aria-checked={value === star}
            tabIndex={-1}
            className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-colors"
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onClick={() => !disabled && onChange(star)}
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                isFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-muted text-muted-foreground/30"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
