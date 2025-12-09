/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for ActivityTemplate model.
 */
export type ActivityTemplate = {
    readonly id: number;
    /**
     * Template name (e.g., 'Standard Atlantic Salmon Lifecycle')
     */
    name: string;
    /**
     * Template description
     */
    description?: string | null;
    /**
     * Type of activity to generate
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
     * When to create the activity
     *
     * * `DAY_OFFSET` - Day Offset
     * * `WEIGHT_THRESHOLD` - Weight Threshold
     * * `STAGE_TRANSITION` - Stage Transition
     */
    trigger_type: 'DAY_OFFSET' | 'WEIGHT_THRESHOLD' | 'STAGE_TRANSITION';
    readonly trigger_type_display: string;
    /**
     * Days after batch creation (for DAY_OFFSET trigger)
     */
    day_offset?: number | null;
    /**
     * Average weight threshold (for WEIGHT_THRESHOLD trigger)
     */
    weight_threshold_g?: string | null;
    /**
     * Target stage for STAGE_TRANSITION trigger
     */
    target_lifecycle_stage?: number | null;
    /**
     * Template for activity notes
     */
    notes_template?: string | null;
    /**
     * Whether template is active
     */
    is_active?: boolean;
    readonly created_at: string;
    readonly updated_at: string;
};

