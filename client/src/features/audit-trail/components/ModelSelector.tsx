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
      <label className="text-sm font-medium text-muted-foreground">
        Model Type
      </label>
      <Select value={selectedModel || models[0]?.value} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select model type" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
