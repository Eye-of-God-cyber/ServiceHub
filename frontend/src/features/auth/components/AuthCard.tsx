import { Card } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      {children}
    </Card>
  );
}
