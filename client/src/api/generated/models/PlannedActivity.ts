/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for PlannedActivity model.
 */
export type PlannedActivity = {
    readonly id: number;
    /**
     * Scenario this activity belongs to
     */
    scenario: number;
    readonly scenario_name: string;
    /**
     * Batch this activity is planned for
     */
    batch: number;
    readonly batch_number: string;
    /**
     * Type of operational activity
     *
     * * `VACCINATION` - Vaccination
     * * `TREATMENT` - Treatment/Health Intervention
     * * `CULL` - Culling
     * * `HARVEST` - Harvest
     * * `SALE` - Sale/Commercial Handoff
     * * `FEED_CHANGE` - Feed Strategy Change
     * * `TRANSFER` - Transfer
     * * `MAINTENANCE` - Maintenance
     * * `SAMPLING` - Sampling
     * * `OTHER` - Other
     */
    activity_type: 'VACCINATION' | 'TREATMENT' | 'CULL' | 'HARVEST' | 'SALE' | 'FEED_CHANGE' | 'TRANSFER' | 'MAINTENANCE' | 'SAMPLING' | 'OTHER';
    readonly activity_type_display: string;
    /**
     * Planned execution date
     */
    due_date: string;
    /**
     * Current status of the activity
     *
     * * `PENDING` - Pending
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     */
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    readonly status_display: string;
    /**
     * Target container (optional)
     */
    container?: number | null;
    readonly container_name: string | null;
    /**
     * Free-text notes for context
     */
    notes?: string | null;
    /**
     * User who created this activity
     */
    readonly created_by: number;
    readonly created_by_name: string;
    readonly created_at: string;
    readonly updated_at: string;
    /**
     * Timestamp when activity was completed
     */
    readonly completed_at: string | null;
    /**
     * User who marked activity as completed
     */
    readonly completed_by: number | null;
    readonly completed_by_name: string;
    /**
     * Spawned Transfer Workflow (for TRANSFER activities)
     */
    readonly transfer_workflow: number | null;
    readonly is_overdue: string;
};

