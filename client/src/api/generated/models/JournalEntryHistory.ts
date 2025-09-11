/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * History serializer for JournalEntry model.
 */
export type JournalEntryHistory = {
    readonly history_id: number;
    /**
     * User who made the change
     */
    readonly history_user: string;
    /**
     * When the change was made
     */
    readonly history_date: string;
    /**
     * Type of change: + (Created), ~ (Updated), - (Deleted)
     */
    readonly history_type: string;
    /**
     * Reason for the change
     */
    readonly history_change_reason: string;
    id?: number;
    entry_date?: string;
    /**
     * * `observation` - Observation
     * * `issue` - Issue
     * * `action` - Action
     * * `diagnosis` - Diagnosis
     * * `treatment` - Treatment
     * * `vaccination` - Vaccination
     * * `sample` - Sample
     */
    category: 'observation' | 'issue' | 'action' | 'diagnosis' | 'treatment' | 'vaccination' | 'sample';
    /**
     * * `low` - Low
     * * `medium` - Medium
     * * `high` - High
     */
    severity?: 'low' | 'medium' | 'high' | '' | null;
    description: string;
    resolution_status?: boolean;
    resolution_notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * The batch associated with this journal entry.
     */
    batch?: number | null;
    /**
     * The specific container, if applicable.
     */
    container?: number | null;
    /**
     * User who created the entry.
     */
    user?: number | null;
};

