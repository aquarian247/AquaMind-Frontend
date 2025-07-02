/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for JournalEntry model.
 *
 * Uses HealthBaseSerializer for consistent error handling and field management.
 * Handles journal entries for health observations, incidents, and notes related to batches.
 */
export type PatchedJournalEntry = {
    readonly id?: number;
    /**
     * The batch this journal entry is associated with.
     */
    batch?: number;
    /**
     * Optional container this journal entry is associated with. Can be null if the entry applies to the entire batch.
     */
    container?: number | null;
    /**
     * Date when the observation or incident occurred. Defaults to current date if not provided.
     */
    entry_date?: string;
    /**
     * Detailed description of the health observation or incident.
     */
    description?: string;
    /**
     * Category of the journal entry (e.g., 'observation', 'incident', 'treatment').
     */
    category?: string;
    /**
     * Optional severity level of the incident or observation (e.g., 'low', 'medium', 'high').
     */
    severity?: string | null;
    /**
     * Current status of resolution for this entry (e.g., 'open', 'in progress', 'resolved').
     */
    resolution_status?: string | null;
    /**
     * Notes on how the issue was resolved or is being addressed.
     */
    resolution_notes?: string | null;
    readonly created_at?: string;
    readonly updated_at?: string;
    /**
     * User who created the entry.
     */
    readonly user?: number;
};

