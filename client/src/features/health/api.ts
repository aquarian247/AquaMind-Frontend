/**
 * Health API Wrappers
 * Query and mutation hooks for health domain entities (JournalEntry, etc.)
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { useCrudMutation } from "@/features/shared/hooks/useCrudMutation";
import type { 
  JournalEntry,
  PaginatedJournalEntryList,
  HealthSamplingEvent,
  PaginatedHealthSamplingEventList,
  IndividualFishObservation,
  PaginatedIndividualFishObservationList,
  HealthLabSample,
  PaginatedHealthLabSampleList,
  Treatment,
  PaginatedTreatmentList,
  VaccinationType,
  PaginatedVaccinationTypeList,
  SampleType,
  PaginatedSampleTypeList,
} from "@/api/generated";

// Common query options for health
const HEALTH_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
  retryDelay: 1000,
} as const;

/**
 * Hook to fetch journal entries with optional filters
 * @param filters - Optional filters (batchId, containerId, category, etc.)
 * @returns Query result with paginated journal entries
 */
export function useJournalEntries(filters?: {
  batchId?: number;
  containerId?: number;
  category?: 'action' | 'diagnosis' | 'issue' | 'observation' | 'sample' | 'treatment' | 'vaccination';
  page?: number;
  search?: string;
}): UseQueryResult<PaginatedJournalEntryList, Error> {
  return useQuery({
    queryKey: ["health", "journal-entries", filters],
    queryFn: () => ApiService.apiV1HealthJournalEntriesList(
      filters?.batchId,
      filters?.category,
      filters?.containerId,
      undefined, // entryDate
      undefined, // entryDateGte
      undefined, // entryDateLte
      filters?.page,
      filters?.search,
      undefined, // userId
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single journal entry by ID
 * @param id - Journal entry ID
 * @returns Query result with journal entry details
 */
export function useJournalEntry(
  id: number | undefined
): UseQueryResult<JournalEntry, Error> {
  return useQuery({
    queryKey: ["health", "journal-entries", id],
    queryFn: () => ApiService.apiV1HealthJournalEntriesRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new journal entry
 * @returns Mutation hook for creating journal entries
 */
export function useCreateJournalEntry() {
  return useCrudMutation<JournalEntry, JournalEntry>({
    mutationFn: (data) => ApiService.apiV1HealthJournalEntriesCreate(data),
    description: "Journal entry created successfully",
    invalidateQueries: [
      "health",
      "journal-entries",
    ],
  });
}

/**
 * Hook to update an existing journal entry
 * @returns Mutation hook for updating journal entries
 */
export function useUpdateJournalEntry() {
  return useCrudMutation<JournalEntry & { id: number }, JournalEntry>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthJournalEntriesUpdate(id, data as JournalEntry),
    description: "Journal entry updated successfully",
    invalidateQueries: [
      "health",
      "journal-entries",
    ],
  });
}

/**
 * Hook to delete a journal entry
 * @returns Mutation hook for deleting journal entries
 */
export function useDeleteJournalEntry() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthJournalEntriesDestroy(id),
    description: "Journal entry deleted successfully",
    invalidateQueries: [
      "health",
      "journal-entries",
    ],
  });
}

// ============================================================================
// HealthSamplingEvent CRUD Operations
// ============================================================================

/**
 * Hook to fetch health sampling events with optional filters
 * @param filters - Optional filters (assignmentBatchId, assignmentContainerId, etc.)
 * @returns Query result with paginated sampling events
 */
export function useHealthSamplingEvents(filters?: {
  assignmentBatchId?: number;
  assignmentContainerId?: number;
  samplingDate?: string;
  page?: number;
}): UseQueryResult<PaginatedHealthSamplingEventList, Error> {
  return useQuery({
    queryKey: ["health", "sampling-events", filters],
    queryFn: () => ApiService.apiV1HealthHealthSamplingEventsList(
      filters?.assignmentBatchId,
      filters?.assignmentContainerId,
      filters?.page,
      undefined, // sampledById
      filters?.samplingDate,
      undefined, // samplingDateGte
      undefined, // samplingDateLte
      undefined, // search
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single health sampling event by ID
 * @param id - Sampling event ID
 * @returns Query result with sampling event details
 */
export function useHealthSamplingEvent(
  id: number | undefined
): UseQueryResult<HealthSamplingEvent, Error> {
  return useQuery({
    queryKey: ["health", "sampling-events", id],
    queryFn: () => ApiService.apiV1HealthHealthSamplingEventsRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new health sampling event
 * @returns Mutation hook for creating sampling events
 */
export function useCreateHealthSamplingEvent() {
  return useCrudMutation<HealthSamplingEvent, HealthSamplingEvent>({
    mutationFn: (data) => ApiService.apiV1HealthHealthSamplingEventsCreate(data),
    description: "Health sampling event created successfully",
    invalidateQueries: [
      "health",
      "sampling-events",
    ],
  });
}

/**
 * Hook to update an existing health sampling event
 * @returns Mutation hook for updating sampling events
 */
export function useUpdateHealthSamplingEvent() {
  return useCrudMutation<HealthSamplingEvent & { id: number }, HealthSamplingEvent>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthHealthSamplingEventsUpdate(id, data as HealthSamplingEvent),
    description: "Health sampling event updated successfully",
    invalidateQueries: [
      "health",
      "sampling-events",
    ],
  });
}

/**
 * Hook to delete a health sampling event
 * @returns Mutation hook for deleting sampling events
 */
export function useDeleteHealthSamplingEvent() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthHealthSamplingEventsDestroy(id),
    description: "Health sampling event deleted successfully",
    invalidateQueries: [
      "health",
      "sampling-events",
    ],
  });
}

// ============================================================================
// IndividualFishObservation CRUD Operations
// ============================================================================

/**
 * Hook to fetch individual fish observations with optional filters
 * @param filters - Optional filters (samplingEventId, fishIdentifier, etc.)
 * @returns Query result with paginated individual fish observations
 */
export function useIndividualFishObservations(filters?: {
  samplingEventId?: number;
  fishIdentifier?: string;
  page?: number;
}): UseQueryResult<PaginatedIndividualFishObservationList, Error> {
  return useQuery({
    queryKey: ["health", "individual-fish-observations", filters],
    queryFn: () => ApiService.apiV1HealthIndividualFishObservationsList(
      filters?.fishIdentifier,
      undefined, // fishIdentifierIcontains
      filters?.page,
      filters?.samplingEventId,
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

/**
 * Hook to fetch a single individual fish observation by ID
 * @param id - Observation ID
 * @returns Query result with observation details
 */
export function useIndividualFishObservation(
  id: number | undefined
): UseQueryResult<IndividualFishObservation, Error> {
  return useQuery({
    queryKey: ["health", "individual-fish-observations", id],
    queryFn: () => ApiService.apiV1HealthIndividualFishObservationsRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

/**
 * Hook to create a new individual fish observation
 * @returns Mutation hook for creating observations
 */
export function useCreateIndividualFishObservation() {
  return useCrudMutation<IndividualFishObservation, IndividualFishObservation>({
    mutationFn: (data) => ApiService.apiV1HealthIndividualFishObservationsCreate(data),
    description: "Fish observation created successfully",
    invalidateQueries: [
      "health",
      "individual-fish-observations",
      "sampling-events", // Invalidate parent to refresh aggregates
    ],
  });
}

/**
 * Hook to update an existing individual fish observation
 * @returns Mutation hook for updating observations
 */
export function useUpdateIndividualFishObservation() {
  return useCrudMutation<IndividualFishObservation & { id: number }, IndividualFishObservation>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthIndividualFishObservationsUpdate(id, data as IndividualFishObservation),
    description: "Fish observation updated successfully",
    invalidateQueries: [
      "health",
      "individual-fish-observations",
      "sampling-events", // Invalidate parent to refresh aggregates
    ],
  });
}

/**
 * Hook to delete an individual fish observation
 * @returns Mutation hook for deleting observations
 */
export function useDeleteIndividualFishObservation() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthIndividualFishObservationsDestroy(id),
    description: "Fish observation deleted successfully",
    invalidateQueries: [
      "health",
      "individual-fish-observations",
      "sampling-events", // Invalidate parent to refresh aggregates
    ],
  });
}

// ============================================================================
// HealthLabSample CRUD Operations
// ============================================================================

export function useHealthLabSamples(filters?: {
  batchId?: number;
  containerId?: number;
  sampleTypeId?: number;
  page?: number;
}): UseQueryResult<PaginatedHealthLabSampleList, Error> {
  return useQuery({
    queryKey: ["health", "lab-samples", filters],
    queryFn: () => ApiService.apiV1HealthHealthLabSamplesList(
      filters?.batchId,
      filters?.containerId,
      undefined, // labReferenceId (string)
      undefined, // labReferenceIdIcontains
      filters?.page,
      undefined, // recordedById
      undefined, // sampleDate
      undefined, // sampleDateGte
      undefined, // sampleDateLte
      filters?.sampleTypeId,
      undefined, // search
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useHealthLabSample(
  id: number | undefined
): UseQueryResult<HealthLabSample, Error> {
  return useQuery({
    queryKey: ["health", "lab-samples", id],
    queryFn: () => ApiService.apiV1HealthHealthLabSamplesRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useCreateHealthLabSample() {
  return useCrudMutation<HealthLabSample, HealthLabSample>({
    mutationFn: (data) => ApiService.apiV1HealthHealthLabSamplesCreate(data as any),
    description: "Lab sample created successfully",
    invalidateQueries: ["health", "lab-samples"],
  });
}

export function useUpdateHealthLabSample() {
  return useCrudMutation<HealthLabSample & { id: number }, HealthLabSample>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthHealthLabSamplesUpdate(id, data as any),
    description: "Lab sample updated successfully",
    invalidateQueries: ["health", "lab-samples"],
  });
}

export function useDeleteHealthLabSample() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthHealthLabSamplesDestroy(id),
    description: "Lab sample deleted successfully",
    invalidateQueries: ["health", "lab-samples"],
  });
}

// ============================================================================
// Treatment CRUD Operations
// ============================================================================

export function useTreatments(filters?: {
  batchId?: number;
  containerId?: number;
  treatmentType?: 'medication' | 'vaccination' | 'physical' | 'other';
  page?: number;
}): UseQueryResult<PaginatedTreatmentList, Error> {
  return useQuery({
    queryKey: ["health", "treatments", filters],
    queryFn: () => ApiService.apiV1HealthTreatmentsList(
      filters?.batchId,
      undefined, // batchAssignmentId
      filters?.containerId,
      undefined, // outcome
      undefined, // outcomeIcontains
      filters?.page,
      filters?.treatmentType,
      undefined, // treatmentDate
      undefined, // treatmentDateGte
      undefined, // treatmentDateLte
      undefined, // userId
      undefined, // vaccinationTypeId
      undefined, // withholdingPeriodDays
      undefined, // withholdingPeriodDaysGte
      undefined, // withholdingPeriodDaysLte
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useTreatment(
  id: number | undefined
): UseQueryResult<Treatment, Error> {
  return useQuery({
    queryKey: ["health", "treatments", id],
    queryFn: () => ApiService.apiV1HealthTreatmentsRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useCreateTreatment() {
  return useCrudMutation<Treatment, Treatment>({
    mutationFn: (data) => ApiService.apiV1HealthTreatmentsCreate(data),
    description: "Treatment created successfully",
    invalidateQueries: ["health", "treatments"],
  });
}

export function useUpdateTreatment() {
  return useCrudMutation<Treatment & { id: number }, Treatment>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthTreatmentsUpdate(id, data as Treatment),
    description: "Treatment updated successfully",
    invalidateQueries: ["health", "treatments"],
  });
}

export function useDeleteTreatment() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthTreatmentsDestroy(id),
    description: "Treatment deleted successfully",
    invalidateQueries: ["health", "treatments"],
  });
}

// ============================================================================
// VaccinationType CRUD Operations
// ============================================================================

export function useVaccinationTypes(filters?: {
  name?: string;
  manufacturer?: string;
  page?: number;
}): UseQueryResult<PaginatedVaccinationTypeList, Error> {
  return useQuery({
    queryKey: ["health", "vaccination-types", filters],
    queryFn: () => ApiService.apiV1HealthVaccinationTypesList(
      filters?.manufacturer,
      undefined, // manufacturerIcontains
      filters?.name,
      undefined, // nameIcontains
      filters?.page,
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useVaccinationType(
  id: number | undefined
): UseQueryResult<VaccinationType, Error> {
  return useQuery({
    queryKey: ["health", "vaccination-types", id],
    queryFn: () => ApiService.apiV1HealthVaccinationTypesRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useCreateVaccinationType() {
  return useCrudMutation<VaccinationType, VaccinationType>({
    mutationFn: (data) => ApiService.apiV1HealthVaccinationTypesCreate(data),
    description: "Vaccination type created successfully",
    invalidateQueries: ["health", "vaccination-types"],
  });
}

export function useUpdateVaccinationType() {
  return useCrudMutation<VaccinationType & { id: number }, VaccinationType>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthVaccinationTypesUpdate(id, data as VaccinationType),
    description: "Vaccination type updated successfully",
    invalidateQueries: ["health", "vaccination-types"],
  });
}

export function useDeleteVaccinationType() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthVaccinationTypesDestroy(id),
    description: "Vaccination type deleted successfully",
    invalidateQueries: ["health", "vaccination-types"],
  });
}

// ============================================================================
// SampleType CRUD Operations
// ============================================================================

export function useSampleTypes(filters?: {
  name?: string;
  page?: number;
}): UseQueryResult<PaginatedSampleTypeList, Error> {
  return useQuery({
    queryKey: ["health", "sample-types", filters],
    queryFn: () => ApiService.apiV1HealthSampleTypesList(
      filters?.name,
      undefined, // nameIcontains
      filters?.page,
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useSampleType(
  id: number | undefined
): UseQueryResult<SampleType, Error> {
  return useQuery({
    queryKey: ["health", "sample-types", id],
    queryFn: () => ApiService.apiV1HealthSampleTypesRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useCreateSampleType() {
  return useCrudMutation<SampleType, SampleType>({
    mutationFn: (data) => ApiService.apiV1HealthSampleTypesCreate(data),
    description: "Sample type created successfully",
    invalidateQueries: ["health", "sample-types"],
  });
}

export function useUpdateSampleType() {
  return useCrudMutation<SampleType & { id: number }, SampleType>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthSampleTypesUpdate(id, data as SampleType),
    description: "Sample type updated successfully",
    invalidateQueries: ["health", "sample-types"],
  });
}

export function useDeleteSampleType() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthSampleTypesDestroy(id),
    description: "Sample type deleted successfully",
    invalidateQueries: ["health", "sample-types"],
  });
}

// ==========================================
// Lice Counts
// ==========================================

export function useLiceCounts(filters?: {
  batchId?: number;
  containerId?: number;
  countDateGte?: string;
  countDateLte?: string;
  page?: number;
}): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["health", "lice-counts", filters],
    queryFn: () => ApiService.apiV1HealthLiceCountsList(
      undefined, // adultFemaleCount
      undefined, // adultFemaleCountGte
      undefined, // adultFemaleCountLte
      undefined, // adultMaleCount
      undefined, // adultMaleCountGte
      undefined, // adultMaleCountLte
      filters?.batchId, // batch
      filters?.containerId, // container
      undefined, // countDate
      filters?.countDateGte, // countDateGte
      filters?.countDateLte, // countDateLte
      undefined, // countValue
      undefined, // countValueGte
      undefined, // countValueLte
      undefined, // fishSampled
      undefined, // fishSampledGte
      undefined, // fishSampledLte
      undefined, // juvenileCount
      undefined, // juvenileCountGte
      undefined, // juvenileCountLte
      undefined, // liceType
      filters?.page, // page
      undefined, // search
      undefined, // user
    ),
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useLiceCount(
  id: number | undefined
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["health", "lice-counts", id],
    queryFn: () => ApiService.apiV1HealthLiceCountsRetrieve(id!),
    enabled: !!id,
    ...HEALTH_QUERY_OPTIONS,
  });
}

export function useCreateLiceCount() {
  return useCrudMutation<any, any>({
    mutationFn: (data) => ApiService.apiV1HealthLiceCountsCreate(data),
    description: "Lice count recorded successfully",
    invalidateQueries: ["health", "lice-counts"],
  });
}

export function useUpdateLiceCount() {
  return useCrudMutation<any & { id: number }, any>({
    mutationFn: ({ id, ...data }) => ApiService.apiV1HealthLiceCountsUpdate(id, data as any),
    description: "Lice count updated successfully",
    invalidateQueries: ["health", "lice-counts"],
  });
}

export function useDeleteLiceCount() {
  return useCrudMutation({
    mutationFn: ({ id }: { id: number }) => ApiService.apiV1HealthLiceCountsDestroy(id),
    description: "Lice count deleted successfully",
    invalidateQueries: ["health", "lice-counts"],
  });
}

