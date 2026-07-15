import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search for services..." }: SearchBarProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative flex w-full max-w-lg items-center">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-10 h-12 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/30"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1.5 h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
