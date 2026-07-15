import { useState } from "react";
import { Dispute } from "../types/domain.types";
import { AdminDisputeDetails } from "./AdminDisputeDetails";
import { AlertTriangle, Calendar, User, LayoutDashboard, ChevronRight } from "lucide-react";

interface AdminDisputeListProps {
  disputes: Dispute[];
  isLoading: boolean;
  error?: Error | null;
}

export function AdminDisputeList({ disputes, isLoading, error }: AdminDisputeListProps) {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  if (error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        <h3 className="font-semibold mb-2">Failed to load disputes</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted/50 animate-pulse border" />
        ))}
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed rounded-2xl">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">No disputes found</h3>
        <p className="text-muted-foreground mt-2">All looks good.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {disputes.map((dispute) => {
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(dispute.createdAt);

          return (
            <div 
              key={dispute.id}
              onClick={() => setSelectedDisputeId(dispute.id)}
              className="block group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {dispute.subject}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                      dispute.status === 'OPEN' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {dispute.status}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {dispute.description}
                </div>

                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-border/50 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-primary/70 shrink-0" />
                    <span className="truncate">Booking ID: {dispute.bookingId} ({dispute.serviceName})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary/70 shrink-0" />
                      <span className="truncate">{dispute.raisedByName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">{formattedDate}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AdminDisputeDetails 
        disputeId={selectedDisputeId} 
        onClose={() => setSelectedDisputeId(null)} 
      />
    </>
  );
}
