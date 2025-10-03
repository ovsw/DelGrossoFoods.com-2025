"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  filterOptions?: (
    options: ComboboxOption[],
    searchValue: string,
  ) => ComboboxOption[];
  "aria-label"?: string;
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  className,
  disabled = false,
  id,
  filterOptions,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Default filter function (simple case-insensitive search)
  const defaultFilterOptions = useCallback(
    (options: ComboboxOption[], searchValue: string) => {
      if (!searchValue.trim()) {
        return options;
      }
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
      );
    },
    [],
  );

  const filterFn = filterOptions || defaultFilterOptions;

  // Filter options based on search input
  const filteredOptions = useMemo(() => {
    return filterFn(options, searchValue);
  }, [options, searchValue, filterFn]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onSelect?.(optionValue);
      setSearchValue("");
      setOpen(false);
    },
    [onSelect],
  );

  // Use custom filter function that always returns 1 (showing all items)
  // since we handle filtering ourselves via filteredOptions
  const commandFilter = useCallback(() => {
    return 1;
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            "w-full justify-between text-start font-normal bg-white/70 hover:bg-white/70",
            !selectedOption && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command filter={commandFilter}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "me-2 h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
