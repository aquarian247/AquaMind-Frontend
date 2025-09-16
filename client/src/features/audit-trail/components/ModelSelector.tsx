import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableModels } from "../index";
import type { AppDomain } from "../index";

interface ModelSelectorProps {
  appDomain: AppDomain;
  selectedModel?: string;
  onModelChange: (model: string) => void;
  className?: string;
}

export function ModelSelector({
  appDomain,
  selectedModel,
  onModelChange,
  className
}: ModelSelectorProps) {
  const models = getAvailableModels(appDomain);

  if (models.length <= 1) {
    return null; // Don't show selector if only one model available
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label
        className="text-sm font-medium text-muted-foreground"
        id="model-selector-label"
      >
        Model Type
      </label>
      <Select
        value={selectedModel || models[0]?.value}
        onValueChange={onModelChange}
        aria-labelledby="model-selector-label"
        aria-describedby="model-selector-description"
      >
        <SelectTrigger
          className="w-full"
          aria-label={`Select model type, currently ${selectedModel || models[0]?.label || 'none selected'}`}
        >
          <SelectValue placeholder="Select model type" />
        </SelectTrigger>
        <SelectContent role="listbox" aria-label="Available model types">
          {models.map((model) => (
            <SelectItem
              key={model.value}
              value={model.value}
              role="option"
              aria-label={`${model.label} model`}
            >
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div id="model-selector-description" className="sr-only">
        Choose which model type to filter audit records by
      </div>
    </div>
  );
}

export const MemoizedModelSelector = memo(ModelSelector);
