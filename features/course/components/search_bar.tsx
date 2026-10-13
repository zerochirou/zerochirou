"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input_group";
import { Button } from "@/components/ui/button";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  filteredCount?: number;
  filteredResultCount?: number;
  totalResults?: number;
  resultsCount?: number;
  count?: number;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  categories = [],
  selectedCategory = "Semua",
  onSelectCategory,
  filteredResultCount,
}: SearchBarProps) {
  const resultCount = filteredResultCount ?? 0;

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={cn("w-full space-y-3 sm:space-y-4", className)}>
      <div className="flex flex-col items-center justify-center w-full">
        <InputGroup className="w-full max-w-2xl">
          <InputGroupInput
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {value ? (
              <InputGroupButton
                size="icon-xs"
                aria-label="Bersihkan pencarian"
                onClick={handleClear}
                className="size-6 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </InputGroupButton>
            ) : null}
            {resultCount} results
          </InputGroupAddon>
        </InputGroup>
      </div>

      {categories.length > 0 && onSelectCategory && (
        <div
          role="tablist"
          aria-label="Filter kategori mata kuliah"
          className="flex justify-center items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
                <Button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectCategory(category)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5",
                    "text-xs sm:text-sm font-medium rounded-full transition-all duration-200 select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border/30",
                  )}
                >
                  <span>{category}</span>
                </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
