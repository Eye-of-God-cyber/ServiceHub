import { useState } from "react";
import { useResolveDispute } from "../hooks/useAdminDisputes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";

interface DisputeResolutionSectionProps {
  disputeId: string;
}

export function DisputeResolutionSection({ disputeId }: DisputeResolutionSectionProps) {
  const [resolution, setResolution] = useState("");
  const { mutate: resolveDispute, isPending } = useResolveDispute();

  const handleResolve = () => {
    if (!resolution.trim()) return;
    
    resolveDispute(
      { disputeId, resolution: resolution.trim() },
      {
        onSuccess: () => setResolution(""),
      }
    );
  };

  return (
    <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
        <CheckCircle className="w-4 h-4" /> Resolve Dispute
      </h4>
      <p className="text-xs text-amber-800">
        Providing a resolution note will permanently close this dispute and notify both parties.
      </p>
      <div className="flex flex-col items-end gap-2 pt-2">
        <Textarea
          placeholder="Enter the official resolution here..."
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="min-h-[80px] resize-none bg-white border-amber-200 focus-visible:ring-amber-500"
        />
        <Button 
          variant="default"
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={handleResolve} 
          disabled={!resolution.trim() || isPending}
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Mark as Resolved
        </Button>
      </div>
    </div>
  );
}
