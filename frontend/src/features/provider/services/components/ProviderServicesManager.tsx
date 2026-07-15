"use client";

import { useState } from "react";
import { useProviderServices, useDeleteProviderService } from "../hooks/useProviderServices";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { AddProviderServiceDialog } from "./AddProviderServiceDialog";
import { EditProviderServiceDialog } from "./EditProviderServiceDialog";
import { toast } from "sonner";
import { type ProviderService } from "../types/domain.types";
import { parseApiError } from "@/utils/parseApiError";

export function ProviderServicesManager() {
  const { data: services, isLoading, isError, refetch } = useProviderServices();
  const deleteMutation = useDeleteProviderService();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProviderService | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Service deleted successfully"),
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
        <h3 className="text-lg font-bold mb-2">Failed to load services</h3>
        <button onClick={() => refetch()} className="underline font-medium">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Services</h2>
          <p className="text-muted-foreground">Manage the services you offer and their pricing.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {!services?.length ? (
        <div className="p-12 text-center bg-muted/30 rounded-xl border border-dashed">
          <h3 className="text-lg font-bold mb-2">No services added yet</h3>
          <p className="text-muted-foreground mb-4">You have not added any services to your profile.</p>
          <Button onClick={() => setIsAddOpen(true)} variant="outline">Add your first service</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((svc) => (
            <Card key={svc.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{svc.baseServiceName}</h3>
                    {!svc.isAvailable && (
                      <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Base price: ${svc.basePrice.toFixed(2)} / {svc.unit}
                  </p>
                  {svc.description && (
                    <p className="text-sm mt-2">{svc.description}</p>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="text-xl font-bold text-primary">
                    ${svc.effectivePrice.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ {svc.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingService(svc)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(svc.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddProviderServiceDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
      />
      
      {editingService && (
        <EditProviderServiceDialog 
          open={!!editingService} 
          onOpenChange={(open) => !open && setEditingService(null)} 
          service={editingService} 
        />
      )}
    </div>
  );
}
