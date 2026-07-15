interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="text-[0.8rem] font-medium text-destructive mt-1.5" role="alert">
      {message}
    </p>
  );
}
