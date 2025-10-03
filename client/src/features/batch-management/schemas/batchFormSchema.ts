import { z } from "zod";

/**
 * Zod schema for batch creation form validation
 * Ensures all required fields are present and valid before submission
 */
export const batchFormSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  species: z.number().min(1, "Species is required"),
  startDate: z.date(),
  initialCount: z.number().min(1, "Initial count must be positive"),
  initialBiomassKg: z.number().min(0.01, "Initial biomass must be positive"),
  currentCount: z.number().min(0, "Current count cannot be negative"),
  currentBiomassKg: z.number().min(0, "Current biomass cannot be negative"),
  container: z.number().optional(),
  stage: z.number().optional(),
  status: z.enum(["active", "harvested", "transferred"]).default("active"),
  expectedHarvestDate: z.date().optional(),
  notes: z.string().optional(),
  // Broodstock traceability fields
  eggSource: z.enum(["internal", "external"]),
  broodstockPairId: z.number().optional(),
  eggSupplierId: z.number().optional(),
  eggBatchNumber: z.string().optional(),
  eggProductionDate: z.date().optional(),
}).refine((data) => {
  if (data.eggSource === "internal" && !data.broodstockPairId) {
    return false;
  }
  if (data.eggSource === "external" && (!data.eggSupplierId || !data.eggBatchNumber)) {
    return false;
  }
  return true;
}, {
  message: "Please provide required fields for the selected egg source",
  path: ["eggSource"],
});

/**
 * TypeScript type inferred from the batch form schema
 * Use this type for form data throughout the application
 */
export type BatchFormData = z.infer<typeof batchFormSchema>;

