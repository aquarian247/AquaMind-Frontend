/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PeriodLock = {
    readonly period_lock_id: number;
    company: number;
    readonly company_name: string;
    operating_unit: number;
    readonly operating_unit_name: string;
    year: number;
    month: number;
    is_locked?: boolean;
    readonly version: number;
    lock_reason?: string;
    locked_by?: number | null;
    readonly locked_by_username: string | null;
    readonly locked_at: string;
    reopened_by?: number | null;
    readonly reopened_by_username: string | null;
    readonly reopened_at: string | null;
    reopen_reason?: string;
    readonly updated_at: string;
};

