/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostImportBatch = {
    readonly import_batch_id: number;
    readonly year: number;
    readonly month: number;
    readonly source_filename: string;
    readonly checksum: string;
    readonly imported_row_count: number;
    readonly total_amount: string;
    readonly uploaded_by: number | null;
    readonly uploaded_by_username: string | null;
    readonly created_at: string;
};

