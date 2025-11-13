/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for the Batch model.
 *
 * Handles the representation of Batch instances, including their core attributes,
 * related model information (species name), and dynamically calculated metrics
 * such as population count, biomass, average weight, current lifecycle stage,
 * days in production, and active containers.
 */
export type Batch = {
    /**
     * Unique read-only identifier for the batch record.
     */
    readonly id: number;
    /**
     * User-defined unique identifier or code for the batch (e.g., BATCH2023-001).
     */
    batch_number: string;
    /**
     * Foreign key ID of the species for this batch. Must be an existing Species ID.
     */
    species: number;
    /**
     * Name of the species associated with this batch (read-only).
     */
    readonly species_name: string;
    /**
     * Foreign key ID of the initial or primary lifecycle stage for this batch. Must be an existing LifeCycleStage ID appropriate for the selected species.
     */
    lifecycle_stage: number;
    /**
     * Current status of the batch. Refer to model choices (e.g., 'Planned', 'Active', 'Harvested').
     *
     * * `PLANNED` - Planned - Awaiting Delivery
     * * `RECEIVING` - Receiving - Partial Delivery
     * * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     * * `CANCELLED` - Cancelled - Never Delivered
     */
    status?: 'PLANNED' | 'RECEIVING' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'CANCELLED';
    /**
     * Type or category of the batch. Refer to model choices (e.g., 'Production', 'Experimental').
     *
     * * `STANDARD` - Standard
     * * `MIXED` - Mixed Population
     */
    batch_type?: 'STANDARD' | 'MIXED';
    /**
     * Date when the batch officially started or was created (YYYY-MM-DD).
     */
    start_date: string;
    /**
     * Anticipated end date for the batch (e.g., for harvest or transfer) (YYYY-MM-DD). Defaults to 30 days after start_date if not provided.
     */
    expected_end_date?: string | null;
    /**
     * Actual end date when the batch was completed/harvested (YYYY-MM-DD). Used to freeze age counter in UI.
     */
    actual_end_date?: string | null;
    /**
     * Any general notes or comments about the batch (optional).
     */
    notes?: string;
    /**
     * Timestamp of when the batch record was created (read-only).
     */
    readonly created_at: string;
    /**
     * Timestamp of the last update to the batch record (read-only).
     */
    readonly updated_at: string;
    /**
     * Total current population count for this batch, calculated from active assignments (read-only).
     */
    readonly calculated_population_count: number;
    /**
     * Total current biomass in kilograms for this batch, calculated from active assignments and formatted to two decimal places (read-only).
     */
    readonly calculated_biomass_kg: number;
    /**
     * Current average weight in grams for individuals in this batch, calculated from active assignments and formatted to two decimal places (read-only).
     */
    readonly calculated_avg_weight_g: number;
    /**
     * The current lifecycle stage of the batch (ID, name, order), determined by the latest active assignment (read-only).
     */
    readonly current_lifecycle_stage: any;
    /**
     * Number of days the batch has been in production since its start date (read-only).
     */
    readonly days_in_production: number;
    /**
     * List of IDs of containers currently actively holding this batch (read-only).
     */
    readonly active_containers: Array<number>;
};

