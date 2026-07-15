import { useState } from "react";
import { useAddDisputeMessage } from "../hooks/useAdminDisputes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface DisputeMessageComposerProps {
  disputeId: string;
}

export function DisputeMessageComposer({ disputeId }: DisputeMessageComposerProps) {
  const [message, setMessage] = useState("");
  const { mutate: addMessage, isPending } = useAddDisputeMessage();

  const handleSend = () => {
    if (!message.trim()) return;
    
    addMessage(
      { disputeId, message: message.trim() },
      {
        onSuccess: () => setMessage(""),
      }
    );
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">Add a Message</h4>
      <div className="flex flex-col items-end gap-2">
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Send Message
        </Button>
      </div>
    </div>
  );
}
