import { MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function ReviewEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-3xl bg-muted/10">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-3">No Reviews Yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg leading-relaxed">
        You haven&apos;t left any reviews yet. Complete a booking and share your experience to help others find great providers!
      </p>
      <Button render={<Link href={ROUTES.CATALOG} />} size="lg" className="rounded-full px-8">
        <Search className="w-5 h-5 mr-2" />
        Explore Services
      </Button>
    </div>
  );
}
