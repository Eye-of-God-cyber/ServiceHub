/**
 * auth feature barrel export.
 *
 * Consumers can import from "@/features/auth" instead of drilling into subdirectories.
 */

// Schemas & types
export * from "./schema/auth.schema";
export * from "./types/auth.types";
export * from "./constants/auth.constants";

// Forms (client components — must be imported directly in client files)
export { LoginForm } from "./forms/LoginForm";
export { RegisterForm } from "./forms/RegisterForm";

// Reusable components
export { AuthCard } from "./components/AuthCard";
export { AuthHeader } from "./components/AuthHeader";
export { AuthFooter } from "./components/AuthFooter";
export { PasswordInput } from "./components/PasswordInput";
export { LoadingButton } from "./components/LoadingButton";
export { SocialButton } from "./components/SocialButton";
export { FormError } from "./components/FormError";
