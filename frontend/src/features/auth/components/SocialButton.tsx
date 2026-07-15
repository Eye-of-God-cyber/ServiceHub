import { Button } from "@/components/ui/button";

interface SocialButtonProps {
  provider: "Google" | "Apple";
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialButton({ provider, icon, onClick, disabled }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full font-normal"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="mr-2 h-4 w-4 flex items-center justify-center">
        {icon}
      </span>
      Continue with {provider}
    </Button>
  );
}
