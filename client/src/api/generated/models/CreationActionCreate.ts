/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Serializer for creating a new creation action.
 *
 * Creates a placeholder destination assignment if needed.
 */
export type CreationActionCreate = {
    readonly id: number;
    /**
     * Parent batch creation workflow
     */
    workflow: number;
    /**
     * Sequential action number within workflow (1, 2, 3...)
     */
    action_number: number;
    dest_container_id: number;
    /**
     * Number of eggs planned for this delivery
     */
    egg_count_planned: number;
    /**
     * Expected delivery date for this action
     */
    expected_delivery_date: string;
    /**
     * Notes about this delivery (transport conditions, etc.)
     */
    notes?: string;
};

