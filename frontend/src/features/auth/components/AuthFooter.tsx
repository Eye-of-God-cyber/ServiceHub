import Link from "next/link";
import { CardFooter } from "@/components/ui/card";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <CardFooter className="flex justify-center items-center py-4 bg-muted/50 border-t mt-4">
      <div className="text-sm text-muted-foreground">
        {text}{" "}
        <Link
          href={href}
          className="text-primary hover:underline font-medium underline-offset-4"
        >
          {linkText}
        </Link>
      </div>
    </CardFooter>
  );
}
