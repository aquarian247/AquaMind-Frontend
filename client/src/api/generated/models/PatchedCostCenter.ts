/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostCenterBatchLink } from './CostCenterBatchLink';
import type { DimCompanySummary } from './DimCompanySummary';
import type { DimSiteSummary } from './DimSiteSummary';
export type PatchedCostCenter = {
    readonly cost_center_id?: number;
    company?: number;
    readonly company_summary?: DimCompanySummary;
    site?: number | null;
    readonly site_summary?: DimSiteSummary | null;
    parent?: number | null;
    readonly parent_code?: string | null;
    code?: string;
    name?: string;
    /**
     * * `SITE` - Site
     * * `PROJECT` - Project
     * * `DEPARTMENT` - Department
     * * `OTHER` - Other
     */
    cost_center_type?: 'SITE' | 'PROJECT' | 'DEPARTMENT' | 'OTHER';
    description?: string;
    is_active?: boolean;
    readonly batch_links?: Array<CostCenterBatchLink>;
    readonly created_at?: string;
    readonly updated_at?: string;
};

