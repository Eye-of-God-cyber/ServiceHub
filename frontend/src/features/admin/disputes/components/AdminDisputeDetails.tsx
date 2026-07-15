import { useAdminDispute } from "../hooks/useAdminDisputes";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { DisputeMessageList } from "./DisputeMessageList";
import { DisputeMessageComposer } from "./DisputeMessageComposer";
import { DisputeResolutionSection } from "./DisputeResolutionSection";

interface AdminDisputeDetailsProps {
  disputeId: string | null;
  onClose: () => void;
}

export function AdminDisputeDetails({ disputeId, onClose }: AdminDisputeDetailsProps) {
  const { data: dispute, isLoading, error } = useAdminDispute(disputeId || "");

  return (
    <Dialog open={!!disputeId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {isLoading && (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="p-6 text-center text-destructive">
            Failed to load dispute details.
          </div>
        )}

        {dispute && (
          <>
            <DialogHeader className="shrink-0 pb-4 border-b">
              <div className="flex items-center justify-between gap-4 pr-6">
                <DialogTitle className="text-xl">{dispute.subject}</DialogTitle>
                <span className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  dispute.status === 'OPEN' 
                    ? 'bg-amber-100 text-amber-800 border-amber-200' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {dispute.status}
                </span>
              </div>
              <DialogDescription className="mt-2 text-sm text-foreground">
                {dispute.description}
              </DialogDescription>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
                <span>ID: {dispute.id}</span>
                <span>Raised by: {dispute.raisedByName}</span>
                <span>Booking ID: {dispute.bookingId} ({dispute.serviceName})</span>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">
              <DisputeMessageList messages={dispute.messages} />
              
              {dispute.status === 'OPEN' ? (
                <div className="space-y-6 shrink-0 pt-4 border-t">
                  <DisputeMessageComposer disputeId={dispute.id} />
                  <DisputeResolutionSection disputeId={dispute.id} />
                </div>
              ) : (
                <div className="shrink-0 p-4 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 mt-4">
                  <h4 className="font-semibold text-sm mb-1">Resolution Note</h4>
                  <p className="text-sm">{dispute.resolution}</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
