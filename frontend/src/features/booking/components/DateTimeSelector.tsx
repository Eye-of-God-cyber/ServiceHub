import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // HH:mm
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  error?: string;
}

export function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  error,
}: DateTimeSelectorProps) {
  // Get tomorrow's date as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">When do you need this service?</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Picker */}
        <div className="space-y-2">
          <label htmlFor="booking-date" className="text-sm font-medium">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="booking-date"
              type="date"
              min={minDate}
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className={cn(
                "flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-destructive focus-visible:ring-destructive" : ""
              )}
            />
          </div>
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <label htmlFor="booking-time" className="text-sm font-medium">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="booking-time"
              type="time"
              value={selectedTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className={cn(
                "flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-destructive focus-visible:ring-destructive" : ""
              )}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
