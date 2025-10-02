import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Option for multi-select filter
 */
export interface MultiSelectOption {
  /** Unique identifier */
  id: number;
  /** Display label */
  label: string;
  /** Optional secondary text */
  description?: string;
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * Props for MultiSelectFilter component
 */
export interface MultiSelectFilterProps {
  /** Available options to select from */
  options: MultiSelectOption[];
  /** Currently selected IDs */
  selectedIds: number[];
  /** Callback when selection changes */
  onChange: (selectedIds: number[]) => void;
  /** Label for the filter */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Whether to show selection count badge */
  showCount?: boolean;
  /** Maximum number of selections allowed (0 = unlimited) */
  maxSelections?: number;
  /** Custom class name */
  className?: string;
  /** Whether to show clear all button */
  showClearAll?: boolean;
  /** Error message to display */
  error?: string;
  /** Warning message to display */
  warning?: string;
}

/**
 * Multi-Select Filter Component
 * 
 * Provides a searchable, multi-select filter interface with badges
 * for selected items. Built on top of Shadcn UI components.
 * 
 * @example
 * <MultiSelectFilter
 *   options={halls.map(h => ({ id: h.id, label: h.name }))}
 *   selectedIds={selectedHallIds}
 *   onChange={setSelectedHallIds}
 *   label="Halls"
 *   placeholder="Select halls..."
 *   showCount
 * />
 */
export function MultiSelectFilter({
  options,
  selectedIds,
  onChange,
  label,
  placeholder = 'Select items...',
  disabled = false,
  showCount = true,
  maxSelections = 0,
  className,
  showClearAll = true,
  error,
  warning
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      option =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Get selected options for display
  const selectedOptions = useMemo(() => {
    return options.filter(option => selectedIds.includes(option.id));
  }, [options, selectedIds]);

  // Toggle selection of an option
  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      // Check max selections limit
      if (maxSelections > 0 && selectedIds.length >= maxSelections) {
        return; // Don't add if limit reached
      }
      onChange([...selectedIds, id]);
    }
  };

  // Clear all selections
  const clearAll = () => {
    onChange([]);
    setOpen(false);
  };

  // Remove a specific selection
  const removeSelection = (id: number) => {
    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {showCount && selectedIds.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedIds.length} selected
          </Badge>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedIds.length === 0
                ? placeholder
                : selectedIds.length === 1
                ? selectedOptions[0]?.label
                : `${selectedIds.length} items selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => {
                  const isSelected = selectedIds.includes(option.id);
                  const isLimitReached = maxSelections > 0 && selectedIds.length >= maxSelections;
                  const isDisabled = option.disabled || (!isSelected && isLimitReached);

                  return (
                    <CommandItem
                      key={option.id}
                      value={option.label}
                      onSelect={() => {
                        if (!isDisabled) {
                          toggleOption(option.id);
                        }
                      }}
                      disabled={isDisabled}
                      className={cn(
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col flex-1">
                        <span>{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          {showClearAll && selectedIds.length > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Selected items badges */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map(option => (
            <Badge
              key={option.id}
              variant="secondary"
              className="gap-1"
            >
              {option.label}
              <button
                type="button"
                onClick={() => removeSelection(option.id)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Warning message */}
      {warning && (
        <p className="text-sm text-amber-600 dark:text-amber-500">{warning}</p>
      )}

      {/* Max selections notice */}
      {maxSelections > 0 && selectedIds.length >= maxSelections && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxSelections} selections reached
        </p>
      )}
    </div>
  );
}

