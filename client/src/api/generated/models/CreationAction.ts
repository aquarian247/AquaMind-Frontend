/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for creation actions (list and detail views).
 */
export type CreationAction = {
    readonly id: number;
    /**
     * Parent batch creation workflow
     */
    workflow: number;
    /**
     * Sequential action number within workflow (1, 2, 3...)
     */
    action_number: number;
    /**
     * * `PENDING` - Pending
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `FAILED` - Failed
     * * `SKIPPED` - Skipped
     */
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
    readonly status_display: string;
    /**
     * Destination container assignment (tray/tank)
     */
    dest_assignment: number;
    readonly dest_container_name: string;
    readonly dest_container_type: string;
    /**
     * Number of eggs planned for this delivery
     */
    egg_count_planned: number;
    /**
     * Actual number of eggs delivered (if different from planned)
     */
    readonly egg_count_actual: number | null;
    /**
     * Number of eggs DOA (dead on arrival)
     */
    mortality_on_arrival?: number;
    readonly eggs_actually_received: string;
    readonly mortality_rate_percentage: string;
    /**
     * Expected delivery date for this action
     */
    expected_delivery_date: string;
    /**
     * Actual delivery date (when executed)
     */
    readonly actual_delivery_date: string | null;
    readonly days_since_expected: string;
    /**
     * Method of egg delivery
     *
     * * `TRANSPORT` - Ground Transport
     * * `HELICOPTER` - Helicopter
     * * `BOAT` - Boat
     * * `INTERNAL_TRANSFER` - Internal Facility Transfer
     */
    delivery_method?: 'TRANSPORT' | 'HELICOPTER' | 'BOAT' | 'INTERNAL_TRANSFER' | '' | null;
    readonly delivery_method_display: string | null;
    /**
     * Water temperature in destination container (°C)
     */
    water_temp_on_arrival?: string | null;
    /**
     * Visual egg quality score on arrival (1=poor, 5=excellent)
     */
    egg_quality_score?: number | null;
    /**
     * Duration of delivery operation (minutes)
     */
    execution_duration_minutes?: number | null;
    readonly executed_by_username: string | null;
    /**
     * Notes about this delivery (transport conditions, etc.)
     */
    notes?: string;
    readonly created_at: string;
    readonly updated_at: string;
};

