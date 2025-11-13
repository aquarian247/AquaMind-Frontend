/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchCreationWorkflowCancel } from '../models/BatchCreationWorkflowCancel';
import type { BatchCreationWorkflowCreate } from '../models/BatchCreationWorkflowCreate';
import type { BatchCreationWorkflowDetail } from '../models/BatchCreationWorkflowDetail';
import type { CreationAction } from '../models/CreationAction';
import type { CreationActionCreate } from '../models/CreationActionCreate';
import type { CreationActionExecute } from '../models/CreationActionExecute';
import type { CreationActionSkip } from '../models/CreationActionSkip';
import type { PaginatedBatchCreationWorkflowListList } from '../models/PaginatedBatchCreationWorkflowListList';
import type { PaginatedContainerAvailabilityResponseList } from '../models/PaginatedContainerAvailabilityResponseList';
import type { PaginatedCreationActionList } from '../models/PaginatedCreationActionList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BatchService {
    /**
     * List batch creation workflows
     * Get a list of all batch creation workflows with filtering options.
     * @param batch Filter by batch ID
     * @param eggSourceType Filter by egg source type (INTERNAL/EXTERNAL)
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param status Filter by workflow status
     * @returns PaginatedBatchCreationWorkflowListList
     * @throws ApiError
     */
    public static listBatchCreationWorkflows(
        batch?: number,
        eggSourceType?: string,
        ordering?: string,
        page?: number,
        search?: string,
        status?: string,
    ): CancelablePromise<PaginatedBatchCreationWorkflowListList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/creation-workflows/',
            query: {
                'batch': batch,
                'egg_source_type': eggSourceType,
                'ordering': ordering,
                'page': page,
                'search': search,
                'status': status,
            },
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create new batch creation workflow
     * Create a new workflow and automatically create the associated batch with PLANNED status.
     * @param requestBody
     * @returns BatchCreationWorkflowCreate
     * @throws ApiError
     */
    public static createBatchCreationWorkflow(
        requestBody: BatchCreationWorkflowCreate,
    ): CancelablePromise<BatchCreationWorkflowCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/creation-workflows/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get workflow details
     * Retrieve detailed information about a specific batch creation workflow.
     * @param id A unique integer value identifying this batch creation workflow.
     * @returns BatchCreationWorkflowDetail
     * @throws ApiError
     */
    public static retrieveBatchCreationWorkflow(
        id: number,
    ): CancelablePromise<BatchCreationWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/creation-workflows/{id}/',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Cancel workflow
     * Cancel a workflow if no actions have been executed. Once eggs are delivered, workflow cannot be cancelled (physical eggs must be managed through normal batch operations).
     * @param id A unique integer value identifying this batch creation workflow.
     * @param requestBody
     * @returns BatchCreationWorkflowDetail
     * @throws ApiError
     */
    public static cancelBatchCreationWorkflow(
        id: number,
        requestBody: BatchCreationWorkflowCancel,
    ): CancelablePromise<BatchCreationWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/creation-workflows/{id}/cancel/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Plan workflow
     * Lock workflow for execution by changing status from DRAFT to PLANNED. Requires at least one action to be added first.
     * @param id A unique integer value identifying this batch creation workflow.
     * @returns BatchCreationWorkflowDetail
     * @throws ApiError
     */
    public static planBatchCreationWorkflow(
        id: number,
    ): CancelablePromise<BatchCreationWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/creation-workflows/{id}/plan/',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List creation actions
     * Get a list of egg delivery actions with filtering options.
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param status Filter by action status
     * @param workflow Filter by workflow ID
     * @returns PaginatedCreationActionList
     * @throws ApiError
     */
    public static listCreationActions(
        ordering?: string,
        page?: number,
        search?: string,
        status?: string,
        workflow?: number,
    ): CancelablePromise<PaginatedCreationActionList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/creation-actions/',
            query: {
                'ordering': ordering,
                'page': page,
                'search': search,
                'status': status,
                'workflow': workflow,
            },
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create new creation action
     * Add a new egg delivery action to a workflow. Creates placeholder container assignment.
     * @param requestBody
     * @returns CreationActionCreate
     * @throws ApiError
     */
    public static createCreationAction(
        requestBody: CreationActionCreate,
    ): CancelablePromise<CreationActionCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/creation-actions/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get action details
     * Retrieve detailed information about a specific creation action.
     * @param id A unique integer value identifying this creation action.
     * @returns CreationAction
     * @throws ApiError
     */
    public static retrieveCreationAction(
        id: number,
    ): CancelablePromise<CreationAction> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/creation-actions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Execute delivery action
     * Record the actual delivery of eggs to a container. Updates destination assignment population, tracks mortality, and progresses workflow status.
     * @param id A unique integer value identifying this creation action.
     * @param requestBody
     * @returns CreationAction
     * @throws ApiError
     */
    public static executeCreationAction(
        id: number,
        requestBody: CreationActionExecute,
    ): CancelablePromise<CreationAction> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/creation-actions/{id}/execute/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Skip delivery action
     * Skip a delivery action (e.g. if delivery was cancelled). Action must be in PENDING status. Requires a reason.
     * @param id A unique integer value identifying this creation action.
     * @param requestBody
     * @returns CreationAction
     * @throws ApiError
     */
    public static skipCreationAction(
        id: number,
        requestBody: CreationActionSkip,
    ): CancelablePromise<CreationAction> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/creation-actions/{id}/skip/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get containers with timeline-aware availability forecasting
     * Returns containers enriched with occupancy forecasting for workflow planning. Shows which containers are immediately available, will be available by delivery date, or have conflicts (still occupied on delivery date).
     * @param geography Filter by geography ID
     * @param containerType Filter by container type name (e.g. TANK, PEN, TRAY)
     * @param deliveryDate Date when action will execute (YYYY-MM-DD). Defaults to today.
     * @param includeOccupied Include occupied containers (default: true)
     * @param lifecycleStage Filter by compatible lifecycle stage ID
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedContainerAvailabilityResponseList
     * @throws ApiError
     */
    public static listContainerAvailability(
        geography: number,
        containerType?: string,
        deliveryDate?: string,
        includeOccupied?: boolean,
        lifecycleStage?: number,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedContainerAvailabilityResponseList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/containers/availability/',
            query: {
                'container_type': containerType,
                'delivery_date': deliveryDate,
                'geography': geography,
                'include_occupied': includeOccupied,
                'lifecycle_stage': lifecycleStage,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
}
