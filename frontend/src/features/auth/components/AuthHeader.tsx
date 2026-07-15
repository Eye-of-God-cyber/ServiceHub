import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <CardHeader className="space-y-1 text-center">
      <CardTitle className="text-2xl font-bold tracking-tight">
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
