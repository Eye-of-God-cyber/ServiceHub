"use client";

import { useState } from "react";
import { useProviderTimeOff, useDeleteProviderTimeOff } from "../hooks/useProviderTimeOff";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertCircle, Loader2, CalendarX2 } from "lucide-react";
import { AddTimeOffDialog } from "./AddTimeOffDialog";
import { toast } from "sonner";
import { parseApiError } from "@/utils/parseApiError";


export function ProviderTimeOffManager() {
  const { data: timeOffs, isLoading, isError, refetch } = useProviderTimeOff();
  const deleteMutation = useDeleteProviderTimeOff();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this time-off?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Time-off deleted successfully"),
      onError: (error: unknown) => {
        toast.error(parseApiError(error));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h3 className="text-lg font-bold mb-2">Failed to load time-offs</h3>
        <button onClick={() => refetch()} className="underline font-medium">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Time Off</h2>
          <p className="text-muted-foreground">Block out dates when you are unavailable for bookings.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Time-Off
        </Button>
      </div>

      {!timeOffs?.length ? (
        <div className="p-12 text-center bg-muted/30 rounded-xl border border-dashed">
          <CalendarX2 className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No time-offs scheduled</h3>
          <p className="text-muted-foreground mb-4">You have not blocked out any days.</p>
          <Button onClick={() => setIsAddOpen(true)} variant="outline">Schedule time-off</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeOffs.map((to) => {
            const formattedStart = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(to.startDate);
            const formattedEnd = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(to.endDate);
            
            return (
              <Card key={to.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold mb-1">
                        {formattedStart} <span className="text-muted-foreground font-normal mx-1">to</span> {formattedEnd}
                      </div>
                      {to.reason ? (
                        <p className="text-sm text-muted-foreground">{to.reason}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No reason provided</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(to.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddTimeOffDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
      />
    </div>
  );
}
