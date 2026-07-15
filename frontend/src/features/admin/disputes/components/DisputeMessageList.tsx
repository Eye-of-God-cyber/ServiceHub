import { DisputeMessage } from "../types/domain.types";
import { User } from "lucide-react";

interface DisputeMessageListProps {
  messages: DisputeMessage[];
}

export function DisputeMessageList({ messages }: DisputeMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed text-sm text-muted-foreground">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const time = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric', minute: '2-digit', 
          month: 'short', day: 'numeric'
        }).format(msg.createdAt);

        return (
          <div key={msg.id} className="flex gap-4 p-4 rounded-lg bg-muted/30 border">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{msg.senderName}</span>
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground/90">{msg.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
