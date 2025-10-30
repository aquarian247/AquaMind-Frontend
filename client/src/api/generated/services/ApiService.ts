/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Area } from '../models/Area';
import type { AreaHistory } from '../models/AreaHistory';
import type { Batch } from '../models/Batch';
import type { BatchComposition } from '../models/BatchComposition';
import type { BatchContainerAssignment } from '../models/BatchContainerAssignment';
import type { BatchContainerAssignmentHistory } from '../models/BatchContainerAssignmentHistory';
import type { BatchFeedingSummary } from '../models/BatchFeedingSummary';
import type { BatchHistory } from '../models/BatchHistory';
import type { BatchParentage } from '../models/BatchParentage';
import type { BatchParentageHistory } from '../models/BatchParentageHistory';
import type { BatchTransferWorkflowCreate } from '../models/BatchTransferWorkflowCreate';
import type { BatchTransferWorkflowDetail } from '../models/BatchTransferWorkflowDetail';
import type { BiologicalConstraints } from '../models/BiologicalConstraints';
import type { BreedingPair } from '../models/BreedingPair';
import type { BreedingPairHistory } from '../models/BreedingPairHistory';
import type { BreedingPlan } from '../models/BreedingPlan';
import type { BreedingTraitPriority } from '../models/BreedingTraitPriority';
import type { BroodstockFish } from '../models/BroodstockFish';
import type { BroodstockFishHistory } from '../models/BroodstockFishHistory';
import type { Container } from '../models/Container';
import type { ContainerHistory } from '../models/ContainerHistory';
import type { ContainerType } from '../models/ContainerType';
import type { ContainerTypeHistory } from '../models/ContainerTypeHistory';
import type { CSVUpload } from '../models/CSVUpload';
import type { CustomTokenObtainPair } from '../models/CustomTokenObtainPair';
import type { EggProduction } from '../models/EggProduction';
import type { EggProductionDetail } from '../models/EggProductionDetail';
import type { EggProductionHistory } from '../models/EggProductionHistory';
import type { EggSupplier } from '../models/EggSupplier';
import type { EnvironmentalParameter } from '../models/EnvironmentalParameter';
import type { EnvironmentalReading } from '../models/EnvironmentalReading';
import type { ExternalEggBatch } from '../models/ExternalEggBatch';
import type { FactHarvest } from '../models/FactHarvest';
import type { FCRModel } from '../models/FCRModel';
import type { FCRTrends } from '../models/FCRTrends';
import type { Feed } from '../models/Feed';
import type { FeedContainer } from '../models/FeedContainer';
import type { FeedContainerHistory } from '../models/FeedContainerHistory';
import type { FeedContainerStock } from '../models/FeedContainerStock';
import type { FeedContainerStockCreate } from '../models/FeedContainerStockCreate';
import type { FeedingEvent } from '../models/FeedingEvent';
import type { FeedingEventHistory } from '../models/FeedingEventHistory';
import type { FeedPurchase } from '../models/FeedPurchase';
import type { FishMovement } from '../models/FishMovement';
import type { FishMovementHistory } from '../models/FishMovementHistory';
import type { FishParameterScore } from '../models/FishParameterScore';
import type { FreshwaterStation } from '../models/FreshwaterStation';
import type { FreshwaterStationHistory } from '../models/FreshwaterStationHistory';
import type { Geography } from '../models/Geography';
import type { GeographyHistory } from '../models/GeographyHistory';
import type { GrowthSample } from '../models/GrowthSample';
import type { GrowthSampleHistory } from '../models/GrowthSampleHistory';
import type { Hall } from '../models/Hall';
import type { HallHistory } from '../models/HallHistory';
import type { HarvestEvent } from '../models/HarvestEvent';
import type { HarvestLot } from '../models/HarvestLot';
import type { HealthLabSample } from '../models/HealthLabSample';
import type { HealthLabSampleHistory } from '../models/HealthLabSampleHistory';
import type { HealthParameter } from '../models/HealthParameter';
import type { HealthSamplingEvent } from '../models/HealthSamplingEvent';
import type { IndividualFishObservation } from '../models/IndividualFishObservation';
import type { IntercompanyTransaction } from '../models/IntercompanyTransaction';
import type { JournalEntry } from '../models/JournalEntry';
import type { JournalEntryHistory } from '../models/JournalEntryHistory';
import type { LiceCount } from '../models/LiceCount';
import type { LiceCountHistory } from '../models/LiceCountHistory';
import type { LiceType } from '../models/LiceType';
import type { LiceTypeHistory } from '../models/LiceTypeHistory';
import type { LifeCycleStage } from '../models/LifeCycleStage';
import type { MaintenanceTask } from '../models/MaintenanceTask';
import type { MortalityEvent } from '../models/MortalityEvent';
import type { MortalityEventHistory } from '../models/MortalityEventHistory';
import type { MortalityModel } from '../models/MortalityModel';
import type { MortalityReason } from '../models/MortalityReason';
import type { MortalityRecord } from '../models/MortalityRecord';
import type { MortalityRecordHistory } from '../models/MortalityRecordHistory';
import type { NavExportBatch } from '../models/NavExportBatch';
import type { NavExportBatchCreate } from '../models/NavExportBatchCreate';
import type { PaginatedAreaHistoryList } from '../models/PaginatedAreaHistoryList';
import type { PaginatedAreaList } from '../models/PaginatedAreaList';
import type { PaginatedBatchCompositionList } from '../models/PaginatedBatchCompositionList';
import type { PaginatedBatchContainerAssignmentHistoryList } from '../models/PaginatedBatchContainerAssignmentHistoryList';
import type { PaginatedBatchContainerAssignmentList } from '../models/PaginatedBatchContainerAssignmentList';
import type { PaginatedBatchFeedingSummaryList } from '../models/PaginatedBatchFeedingSummaryList';
import type { PaginatedBatchHistoryList } from '../models/PaginatedBatchHistoryList';
import type { PaginatedBatchList } from '../models/PaginatedBatchList';
import type { PaginatedBatchParentageHistoryList } from '../models/PaginatedBatchParentageHistoryList';
import type { PaginatedBatchParentageList } from '../models/PaginatedBatchParentageList';
import type { PaginatedBatchTransferWorkflowListList } from '../models/PaginatedBatchTransferWorkflowListList';
import type { PaginatedBiologicalConstraintsList } from '../models/PaginatedBiologicalConstraintsList';
import type { PaginatedBreedingPairHistoryList } from '../models/PaginatedBreedingPairHistoryList';
import type { PaginatedBreedingPairList } from '../models/PaginatedBreedingPairList';
import type { PaginatedBreedingPlanList } from '../models/PaginatedBreedingPlanList';
import type { PaginatedBreedingTraitPriorityList } from '../models/PaginatedBreedingTraitPriorityList';
import type { PaginatedBroodstockFishHistoryList } from '../models/PaginatedBroodstockFishHistoryList';
import type { PaginatedBroodstockFishList } from '../models/PaginatedBroodstockFishList';
import type { PaginatedContainerHistoryList } from '../models/PaginatedContainerHistoryList';
import type { PaginatedContainerList } from '../models/PaginatedContainerList';
import type { PaginatedContainerTypeHistoryList } from '../models/PaginatedContainerTypeHistoryList';
import type { PaginatedContainerTypeList } from '../models/PaginatedContainerTypeList';
import type { PaginatedEggProductionHistoryList } from '../models/PaginatedEggProductionHistoryList';
import type { PaginatedEggProductionList } from '../models/PaginatedEggProductionList';
import type { PaginatedEggSupplierList } from '../models/PaginatedEggSupplierList';
import type { PaginatedEnvironmentalParameterList } from '../models/PaginatedEnvironmentalParameterList';
import type { PaginatedEnvironmentalReadingList } from '../models/PaginatedEnvironmentalReadingList';
import type { PaginatedExternalEggBatchList } from '../models/PaginatedExternalEggBatchList';
import type { PaginatedFactHarvestList } from '../models/PaginatedFactHarvestList';
import type { PaginatedFCRModelList } from '../models/PaginatedFCRModelList';
import type { PaginatedFeedContainerHistoryList } from '../models/PaginatedFeedContainerHistoryList';
import type { PaginatedFeedContainerList } from '../models/PaginatedFeedContainerList';
import type { PaginatedFeedContainerStockList } from '../models/PaginatedFeedContainerStockList';
import type { PaginatedFeedingEventHistoryList } from '../models/PaginatedFeedingEventHistoryList';
import type { PaginatedFeedingEventList } from '../models/PaginatedFeedingEventList';
import type { PaginatedFeedList } from '../models/PaginatedFeedList';
import type { PaginatedFeedPurchaseList } from '../models/PaginatedFeedPurchaseList';
import type { PaginatedFishMovementHistoryList } from '../models/PaginatedFishMovementHistoryList';
import type { PaginatedFishMovementList } from '../models/PaginatedFishMovementList';
import type { PaginatedFishParameterScoreList } from '../models/PaginatedFishParameterScoreList';
import type { PaginatedFreshwaterStationHistoryList } from '../models/PaginatedFreshwaterStationHistoryList';
import type { PaginatedFreshwaterStationList } from '../models/PaginatedFreshwaterStationList';
import type { PaginatedGeographyHistoryList } from '../models/PaginatedGeographyHistoryList';
import type { PaginatedGeographyList } from '../models/PaginatedGeographyList';
import type { PaginatedGrowthSampleHistoryList } from '../models/PaginatedGrowthSampleHistoryList';
import type { PaginatedGrowthSampleList } from '../models/PaginatedGrowthSampleList';
import type { PaginatedHallHistoryList } from '../models/PaginatedHallHistoryList';
import type { PaginatedHallList } from '../models/PaginatedHallList';
import type { PaginatedHarvestEventList } from '../models/PaginatedHarvestEventList';
import type { PaginatedHarvestLotList } from '../models/PaginatedHarvestLotList';
import type { PaginatedHealthLabSampleHistoryList } from '../models/PaginatedHealthLabSampleHistoryList';
import type { PaginatedHealthLabSampleList } from '../models/PaginatedHealthLabSampleList';
import type { PaginatedHealthParameterList } from '../models/PaginatedHealthParameterList';
import type { PaginatedHealthSamplingEventList } from '../models/PaginatedHealthSamplingEventList';
import type { PaginatedIndividualFishObservationList } from '../models/PaginatedIndividualFishObservationList';
import type { PaginatedIntercompanyTransactionList } from '../models/PaginatedIntercompanyTransactionList';
import type { PaginatedJournalEntryHistoryList } from '../models/PaginatedJournalEntryHistoryList';
import type { PaginatedJournalEntryList } from '../models/PaginatedJournalEntryList';
import type { PaginatedLiceCountHistoryList } from '../models/PaginatedLiceCountHistoryList';
import type { PaginatedLiceCountList } from '../models/PaginatedLiceCountList';
import type { PaginatedLiceTypeHistoryList } from '../models/PaginatedLiceTypeHistoryList';
import type { PaginatedLiceTypeList } from '../models/PaginatedLiceTypeList';
import type { PaginatedLifeCycleStageList } from '../models/PaginatedLifeCycleStageList';
import type { PaginatedMaintenanceTaskList } from '../models/PaginatedMaintenanceTaskList';
import type { PaginatedMortalityEventHistoryList } from '../models/PaginatedMortalityEventHistoryList';
import type { PaginatedMortalityEventList } from '../models/PaginatedMortalityEventList';
import type { PaginatedMortalityModelList } from '../models/PaginatedMortalityModelList';
import type { PaginatedMortalityReasonList } from '../models/PaginatedMortalityReasonList';
import type { PaginatedMortalityRecordHistoryList } from '../models/PaginatedMortalityRecordHistoryList';
import type { PaginatedMortalityRecordList } from '../models/PaginatedMortalityRecordList';
import type { PaginatedParameterScoreDefinitionList } from '../models/PaginatedParameterScoreDefinitionList';
import type { PaginatedPhotoperiodDataList } from '../models/PaginatedPhotoperiodDataList';
import type { PaginatedSampleTypeList } from '../models/PaginatedSampleTypeList';
import type { PaginatedScenarioList } from '../models/PaginatedScenarioList';
import type { PaginatedScenarioProjectionList } from '../models/PaginatedScenarioProjectionList';
import type { PaginatedSensorHistoryList } from '../models/PaginatedSensorHistoryList';
import type { PaginatedSensorList } from '../models/PaginatedSensorList';
import type { PaginatedSpeciesList } from '../models/PaginatedSpeciesList';
import type { PaginatedStageTransitionEnvironmentalList } from '../models/PaginatedStageTransitionEnvironmentalList';
import type { PaginatedTemperatureProfileList } from '../models/PaginatedTemperatureProfileList';
import type { PaginatedTGCModelList } from '../models/PaginatedTGCModelList';
import type { PaginatedTransferActionListList } from '../models/PaginatedTransferActionListList';
import type { PaginatedTreatmentHistoryList } from '../models/PaginatedTreatmentHistoryList';
import type { PaginatedTreatmentList } from '../models/PaginatedTreatmentList';
import type { PaginatedUserList } from '../models/PaginatedUserList';
import type { PaginatedUserProfileHistoryList } from '../models/PaginatedUserProfileHistoryList';
import type { PaginatedVaccinationTypeList } from '../models/PaginatedVaccinationTypeList';
import type { PaginatedWeatherDataList } from '../models/PaginatedWeatherDataList';
import type { ParameterScoreDefinition } from '../models/ParameterScoreDefinition';
import type { PatchedArea } from '../models/PatchedArea';
import type { PatchedBatch } from '../models/PatchedBatch';
import type { PatchedBatchComposition } from '../models/PatchedBatchComposition';
import type { PatchedBatchContainerAssignment } from '../models/PatchedBatchContainerAssignment';
import type { PatchedBatchParentage } from '../models/PatchedBatchParentage';
import type { PatchedBatchTransferWorkflowDetail } from '../models/PatchedBatchTransferWorkflowDetail';
import type { PatchedBiologicalConstraints } from '../models/PatchedBiologicalConstraints';
import type { PatchedBreedingPair } from '../models/PatchedBreedingPair';
import type { PatchedBreedingPlan } from '../models/PatchedBreedingPlan';
import type { PatchedBreedingTraitPriority } from '../models/PatchedBreedingTraitPriority';
import type { PatchedBroodstockFish } from '../models/PatchedBroodstockFish';
import type { PatchedContainer } from '../models/PatchedContainer';
import type { PatchedContainerType } from '../models/PatchedContainerType';
import type { PatchedEggProduction } from '../models/PatchedEggProduction';
import type { PatchedEggSupplier } from '../models/PatchedEggSupplier';
import type { PatchedEnvironmentalParameter } from '../models/PatchedEnvironmentalParameter';
import type { PatchedEnvironmentalReading } from '../models/PatchedEnvironmentalReading';
import type { PatchedExternalEggBatch } from '../models/PatchedExternalEggBatch';
import type { PatchedFCRModel } from '../models/PatchedFCRModel';
import type { PatchedFeed } from '../models/PatchedFeed';
import type { PatchedFeedContainer } from '../models/PatchedFeedContainer';
import type { PatchedFeedContainerStock } from '../models/PatchedFeedContainerStock';
import type { PatchedFeedingEvent } from '../models/PatchedFeedingEvent';
import type { PatchedFeedPurchase } from '../models/PatchedFeedPurchase';
import type { PatchedFishMovement } from '../models/PatchedFishMovement';
import type { PatchedFishParameterScore } from '../models/PatchedFishParameterScore';
import type { PatchedFreshwaterStation } from '../models/PatchedFreshwaterStation';
import type { PatchedGeography } from '../models/PatchedGeography';
import type { PatchedGrowthSample } from '../models/PatchedGrowthSample';
import type { PatchedHall } from '../models/PatchedHall';
import type { PatchedHealthLabSample } from '../models/PatchedHealthLabSample';
import type { PatchedHealthParameter } from '../models/PatchedHealthParameter';
import type { PatchedHealthSamplingEvent } from '../models/PatchedHealthSamplingEvent';
import type { PatchedIndividualFishObservation } from '../models/PatchedIndividualFishObservation';
import type { PatchedJournalEntry } from '../models/PatchedJournalEntry';
import type { PatchedLiceCount } from '../models/PatchedLiceCount';
import type { PatchedLifeCycleStage } from '../models/PatchedLifeCycleStage';
import type { PatchedMaintenanceTask } from '../models/PatchedMaintenanceTask';
import type { PatchedMortalityEvent } from '../models/PatchedMortalityEvent';
import type { PatchedMortalityModel } from '../models/PatchedMortalityModel';
import type { PatchedMortalityReason } from '../models/PatchedMortalityReason';
import type { PatchedMortalityRecord } from '../models/PatchedMortalityRecord';
import type { PatchedParameterScoreDefinition } from '../models/PatchedParameterScoreDefinition';
import type { PatchedPhotoperiodData } from '../models/PatchedPhotoperiodData';
import type { PatchedSampleType } from '../models/PatchedSampleType';
import type { PatchedScenario } from '../models/PatchedScenario';
import type { PatchedSensor } from '../models/PatchedSensor';
import type { PatchedSpecies } from '../models/PatchedSpecies';
import type { PatchedStageTransitionEnvironmental } from '../models/PatchedStageTransitionEnvironmental';
import type { PatchedTemperatureProfile } from '../models/PatchedTemperatureProfile';
import type { PatchedTGCModel } from '../models/PatchedTGCModel';
import type { PatchedTransferActionDetail } from '../models/PatchedTransferActionDetail';
import type { PatchedTreatment } from '../models/PatchedTreatment';
import type { PatchedUser } from '../models/PatchedUser';
import type { PatchedUserProfileUpdate } from '../models/PatchedUserProfileUpdate';
import type { PatchedVaccinationType } from '../models/PatchedVaccinationType';
import type { PatchedWeatherData } from '../models/PatchedWeatherData';
import type { PhotoperiodData } from '../models/PhotoperiodData';
import type { SampleType } from '../models/SampleType';
import type { Scenario } from '../models/Scenario';
import type { Sensor } from '../models/Sensor';
import type { SensorHistory } from '../models/SensorHistory';
import type { Species } from '../models/Species';
import type { StageTransitionEnvironmental } from '../models/StageTransitionEnvironmental';
import type { TemperatureProfile } from '../models/TemperatureProfile';
import type { TGCModel } from '../models/TGCModel';
import type { TokenObtainPair } from '../models/TokenObtainPair';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { TransferActionDetail } from '../models/TransferActionDetail';
import type { TransferActionExecute } from '../models/TransferActionExecute';
import type { TransferActionRollback } from '../models/TransferActionRollback';
import type { TransferActionSkip } from '../models/TransferActionSkip';
import type { Treatment } from '../models/Treatment';
import type { TreatmentHistory } from '../models/TreatmentHistory';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserProfile } from '../models/UserProfile';
import type { UserProfileHistory } from '../models/UserProfileHistory';
import type { UserProfileUpdate } from '../models/UserProfileUpdate';
import type { VaccinationType } from '../models/VaccinationType';
import type { WeatherData } from '../models/WeatherData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiService {
    /**
     * Return a structured overview of all available API endpoints.
     * @returns any No response body
     * @throws ApiError
     */
    public static apiRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param name
     * @param nameIcontains
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param unit
     * @returns PaginatedEnvironmentalParameterList
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersList(
        name?: string,
        nameIcontains?: string,
        ordering?: string,
        page?: number,
        search?: string,
        unit?: string,
    ): CancelablePromise<PaginatedEnvironmentalParameterList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/parameters/',
            query: {
                'name': name,
                'name__icontains': nameIcontains,
                'ordering': ordering,
                'page': page,
                'search': search,
                'unit': unit,
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
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param requestBody
     * @returns EnvironmentalParameter
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersCreate(
        requestBody: EnvironmentalParameter,
    ): CancelablePromise<EnvironmentalParameter> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/environmental/parameters/',
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
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental parameter.
     * @param requestBody
     * @returns EnvironmentalParameter
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersUpdate(
        id: number,
        requestBody: EnvironmentalParameter,
    ): CancelablePromise<EnvironmentalParameter> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/environmental/parameters/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental parameter.
     * @returns EnvironmentalParameter
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersRetrieve(
        id: number,
    ): CancelablePromise<EnvironmentalParameter> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/parameters/{id}/',
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
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental parameter.
     * @returns void
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/environmental/parameters/{id}/',
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
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental parameter.
     * @param requestBody
     * @returns EnvironmentalParameter
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersPartialUpdate(
        id: number,
        requestBody?: PatchedEnvironmentalParameter,
    ): CancelablePromise<EnvironmentalParameter> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/environmental/parameters/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param batch
     * @param batchIn Multiple values may be separated by commas.
     * @param container
     * @param containerIn Multiple values may be separated by commas.
     * @param isManual
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param parameter
     * @param parameterIn Multiple values may be separated by commas.
     * @param search A search term.
     * @param sensor
     * @param sensorIn Multiple values may be separated by commas.
     * @returns PaginatedEnvironmentalReadingList
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsList(
        batch?: number,
        batchIn?: Array<number>,
        container?: number,
        containerIn?: Array<number>,
        isManual?: boolean,
        ordering?: string,
        page?: number,
        parameter?: number,
        parameterIn?: Array<number>,
        search?: string,
        sensor?: number,
        sensorIn?: Array<number>,
    ): CancelablePromise<PaginatedEnvironmentalReadingList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/',
            query: {
                'batch': batch,
                'batch__in': batchIn,
                'container': container,
                'container__in': containerIn,
                'is_manual': isManual,
                'ordering': ordering,
                'page': page,
                'parameter': parameter,
                'parameter__in': parameterIn,
                'search': search,
                'sensor': sensor,
                'sensor__in': sensorIn,
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
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param requestBody
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsCreate(
        requestBody: EnvironmentalReading,
    ): CancelablePromise<EnvironmentalReading> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/environmental/readings/',
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
     * Get readings filtered by container and optional time range.
     *
     * Query parameters:
     * - container_id: Required, container to fetch readings for
     * - parameter_id: Optional, filter by specific parameter
     * - start_time: Optional, ISO format datetime for range start
     * - end_time: Optional, ISO format datetime for range end
     * - limit: Optional, limit number of results (default: 1000)
     * @param containerId ID of the container to fetch readings for.
     * @param endTime Filter readings at or before this timestamp.
     * @param limit Maximum number of readings to return (default 1000).
     * @param parameterId Filter readings by environmental parameter.
     * @param startTime Filter readings at or after this timestamp.
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsByContainerRetrieve(
        containerId: number,
        endTime?: string,
        limit: number = 1000,
        parameterId?: number,
        startTime?: string,
    ): CancelablePromise<Array<EnvironmentalReading>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/by_container/',
            query: {
                'container_id': containerId,
                'end_time': endTime,
                'limit': limit,
                'parameter_id': parameterId,
                'start_time': startTime,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Return the most recent readings for each parameter-container combo.
     *
     * Uses PostgreSQL DISTINCT ON when available, falls back to
     * iteration for SQLite. Optimized with select_related to avoid N+1.
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsRecentRetrieve(): CancelablePromise<Array<EnvironmentalReading>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/recent/',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Return aggregated statistics for readings based on query parameters.
     * @param days Number of days to include in the aggregation window.
     * @param groupBy Aggregation dimension: parameter (default), container, or batch.
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsStatsRetrieve(
        days: number = 7,
        groupBy: string = 'parameter',
    ): CancelablePromise<Array<EnvironmentalReading>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/stats/',
            query: {
                'days': days,
                'group_by': groupBy,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental reading.
     * @param requestBody
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsUpdate(
        id: number,
        requestBody: EnvironmentalReading,
    ): CancelablePromise<EnvironmentalReading> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/environmental/readings/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental reading.
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsRetrieve(
        id: number,
    ): CancelablePromise<EnvironmentalReading> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/{id}/',
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
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental reading.
     * @returns void
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/environmental/readings/{id}/',
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
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this environmental reading.
     * @param requestBody
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsPartialUpdate(
        id: number,
        requestBody?: PatchedEnvironmentalReading,
    ): CancelablePromise<EnvironmentalReading> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/environmental/readings/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param area
     * @param areaIn Multiple values may be separated by commas.
     * @param date
     * @param isInterpolated
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedPhotoperiodDataList
     * @throws ApiError
     */
    public static apiV1EnvironmentalPhotoperiodList(
        area?: number,
        areaIn?: Array<number>,
        date?: string,
        isInterpolated?: boolean,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedPhotoperiodDataList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/photoperiod/',
            query: {
                'area': area,
                'area__in': areaIn,
                'date': date,
                'is_interpolated': isInterpolated,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for viewing and editing PhotoperiodData instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param requestBody
     * @returns PhotoperiodData
     * @throws ApiError
     */
    public static apiV1EnvironmentalPhotoperiodCreate(
        requestBody: PhotoperiodData,
    ): CancelablePromise<PhotoperiodData> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/environmental/photoperiod/',
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
     * ViewSet for viewing and editing PhotoperiodData instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this photoperiod data.
     * @param requestBody
     * @returns PhotoperiodData
     * @throws ApiError
     */
    public static apiV1EnvironmentalPhotoperiodUpdate(
        id: number,
        requestBody: PhotoperiodData,
    ): CancelablePromise<PhotoperiodData> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/environmental/photoperiod/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this photoperiod data.
     * @returns PhotoperiodData
     * @throws ApiError
     */
    public static apiV1EnvironmentalPhotoperiodRetrieve(
        id: number,
    ): CancelablePromise<PhotoperiodData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/photoperiod/{id}/',
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
     * ViewSet for viewing and editing PhotoperiodData instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this photoperiod data.
     * @returns void
     * @throws ApiError
     */
    public static apiV1EnvironmentalPhotoperiodDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/environmental/photoperiod/{id}/',
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
     * ViewSet for viewing and editing PhotoperiodData instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this photoperiod data.
     * @param requestBody
     * @returns PhotoperiodData
     * @throws ApiError
     */
    public static apiV1EnvironmentalPhotoperiodPartialUpdate(
        id: number,
        requestBody?: PatchedPhotoperiodData,
    ): CancelablePromise<PhotoperiodData> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/environmental/photoperiod/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param area
     * @param areaIn Multiple values may be separated by commas.
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedWeatherDataList
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherList(
        area?: number,
        areaIn?: Array<number>,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedWeatherDataList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/weather/',
            query: {
                'area': area,
                'area__in': areaIn,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param requestBody
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherCreate(
        requestBody: WeatherData,
    ): CancelablePromise<WeatherData> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/environmental/weather/',
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
     * Get weather data filtered by area and optional time range.
     *
     * Query parameters:
     * - area_id: Required, the ID of the area to fetch weather data for
     * - start_time: Optional, ISO format datetime for range start
     * - end_time: Optional, ISO format datetime for range end
     * - limit: Optional, limit number of results (default: 1000)
     * @param areaId ID of the area to fetch weather data for.
     * @param endTime Filter weather data at or before this timestamp.
     * @param limit Maximum number of records to return (default 1000).
     * @param startTime Filter weather data at or after this timestamp.
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherByAreaRetrieve(
        areaId: number,
        endTime?: string,
        limit: number = 1000,
        startTime?: string,
    ): CancelablePromise<WeatherData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/weather/by_area/',
            query: {
                'area_id': areaId,
                'end_time': endTime,
                'limit': limit,
                'start_time': startTime,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Return the most recent weather data for each area.
     *
     * Uses PostgreSQL DISTINCT ON when available, falls back to
     * iteration for SQLite. Optimized with select_related.
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherRecentRetrieve(): CancelablePromise<Array<WeatherData>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/weather/recent/',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this weather data.
     * @param requestBody
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherUpdate(
        id: number,
        requestBody: WeatherData,
    ): CancelablePromise<WeatherData> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/environmental/weather/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this weather data.
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherRetrieve(
        id: number,
    ): CancelablePromise<WeatherData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/weather/{id}/',
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
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this weather data.
     * @returns void
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/environmental/weather/{id}/',
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
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this weather data.
     * @param requestBody
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherPartialUpdate(
        id: number,
        requestBody?: PatchedWeatherData,
    ): CancelablePromise<WeatherData> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/environmental/weather/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param batchTransferWorkflow
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedStageTransitionEnvironmentalList
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsList(
        batchTransferWorkflow?: number,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedStageTransitionEnvironmentalList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/stage-transitions/',
            query: {
                'batch_transfer_workflow': batchTransferWorkflow,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param requestBody
     * @returns StageTransitionEnvironmental
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsCreate(
        requestBody: StageTransitionEnvironmental,
    ): CancelablePromise<StageTransitionEnvironmental> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/environmental/stage-transitions/',
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
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this stage transition environmental.
     * @param requestBody
     * @returns StageTransitionEnvironmental
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsUpdate(
        id: number,
        requestBody: StageTransitionEnvironmental,
    ): CancelablePromise<StageTransitionEnvironmental> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/environmental/stage-transitions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this stage transition environmental.
     * @returns StageTransitionEnvironmental
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsRetrieve(
        id: number,
    ): CancelablePromise<StageTransitionEnvironmental> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/stage-transitions/{id}/',
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
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this stage transition environmental.
     * @returns void
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/environmental/stage-transitions/{id}/',
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
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     *
     * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
     * @param id A unique integer value identifying this stage transition environmental.
     * @param requestBody
     * @returns StageTransitionEnvironmental
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsPartialUpdate(
        id: number,
        requestBody?: PatchedStageTransitionEnvironmental,
    ): CancelablePromise<StageTransitionEnvironmental> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/environmental/stage-transitions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param descriptionContains
     * @param name
     * @param nameContains
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param scientificName
     * @param scientificNameContains
     * @param search A search term.
     * @returns PaginatedSpeciesList
     * @throws ApiError
     */
    public static apiV1BatchSpeciesList(
        descriptionContains?: string,
        name?: string,
        nameContains?: string,
        ordering?: string,
        page?: number,
        scientificName?: string,
        scientificNameContains?: string,
        search?: string,
    ): CancelablePromise<PaginatedSpeciesList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/species/',
            query: {
                'description_contains': descriptionContains,
                'name': name,
                'name_contains': nameContains,
                'ordering': ordering,
                'page': page,
                'scientific_name': scientificName,
                'scientific_name_contains': scientificNameContains,
                'search': search,
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
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param requestBody
     * @returns Species
     * @throws ApiError
     */
    public static apiV1BatchSpeciesCreate(
        requestBody: Species,
    ): CancelablePromise<Species> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/species/',
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
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this species.
     * @param requestBody
     * @returns Species
     * @throws ApiError
     */
    public static apiV1BatchSpeciesUpdate(
        id: number,
        requestBody: Species,
    ): CancelablePromise<Species> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/species/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this species.
     * @returns Species
     * @throws ApiError
     */
    public static apiV1BatchSpeciesRetrieve(
        id: number,
    ): CancelablePromise<Species> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/species/{id}/',
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
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this species.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchSpeciesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/species/{id}/',
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
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this species.
     * @param requestBody
     * @returns Species
     * @throws ApiError
     */
    public static apiV1BatchSpeciesPartialUpdate(
        id: number,
        requestBody?: PatchedSpecies,
    ): CancelablePromise<Species> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/species/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param name
     * @param nameContains
     * @param order
     * @param orderMax
     * @param orderMin
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param species
     * @param speciesName
     * @returns PaginatedLifeCycleStageList
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesList(
        name?: string,
        nameContains?: string,
        order?: number,
        orderMax?: number,
        orderMin?: number,
        ordering?: string,
        page?: number,
        search?: string,
        species?: number,
        speciesName?: string,
    ): CancelablePromise<PaginatedLifeCycleStageList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/lifecycle-stages/',
            query: {
                'name': name,
                'name_contains': nameContains,
                'order': order,
                'order_max': orderMax,
                'order_min': orderMin,
                'ordering': ordering,
                'page': page,
                'search': search,
                'species': species,
                'species_name': speciesName,
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
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param requestBody
     * @returns LifeCycleStage
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesCreate(
        requestBody: LifeCycleStage,
    ): CancelablePromise<LifeCycleStage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/lifecycle-stages/',
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
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this life cycle stage.
     * @param requestBody
     * @returns LifeCycleStage
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesUpdate(
        id: number,
        requestBody: LifeCycleStage,
    ): CancelablePromise<LifeCycleStage> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/lifecycle-stages/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this life cycle stage.
     * @returns LifeCycleStage
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesRetrieve(
        id: number,
    ): CancelablePromise<LifeCycleStage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/lifecycle-stages/{id}/',
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
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this life cycle stage.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/lifecycle-stages/{id}/',
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
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this life cycle stage.
     * @param requestBody
     * @returns LifeCycleStage
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesPartialUpdate(
        id: number,
        requestBody?: PatchedLifeCycleStage,
    ): CancelablePromise<LifeCycleStage> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/lifecycle-stages/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Retrieve a list of batches.
     *
     * Supports filtering by fields like `batch_number`, `species`, `lifecycle_stage`, `status`, and `batch_type`.
     * Supports searching across `batch_number`, `species__name`, `lifecycle_stage__name`, `notes`, and `batch_type`.
     * Supports ordering by `batch_number`, `start_date`, `species__name`, `lifecycle_stage__name`, and `created_at`.
     * @param batchNumber
     * @param batchNumberIcontains
     * @param batchType * `STANDARD` - Standard
     * * `MIXED` - Mixed Population
     * @param batchTypeIn * `STANDARD` - Standard
     * * `MIXED` - Mixed Population
     * @param biomassMax
     * @param biomassMin
     * @param endDateAfter
     * @param endDateBefore
     * @param lifecycleStage
     * @param lifecycleStageIn Multiple values may be separated by commas.
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param populationMax
     * @param populationMin
     * @param search A search term.
     * @param species
     * @param speciesIn Multiple values may be separated by commas.
     * @param startDateAfter
     * @param startDateBefore
     * @param status * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     * @param statusIn * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     * @returns PaginatedBatchList
     * @throws ApiError
     */
    public static apiV1BatchBatchesList(
        batchNumber?: string,
        batchNumberIcontains?: string,
        batchType?: 'MIXED' | 'STANDARD',
        batchTypeIn?: Array<'MIXED' | 'STANDARD'>,
        biomassMax?: number,
        biomassMin?: number,
        endDateAfter?: string,
        endDateBefore?: string,
        lifecycleStage?: number,
        lifecycleStageIn?: Array<number>,
        ordering?: string,
        page?: number,
        populationMax?: number,
        populationMin?: number,
        search?: string,
        species?: number,
        speciesIn?: Array<number>,
        startDateAfter?: string,
        startDateBefore?: string,
        status?: 'ACTIVE' | 'COMPLETED' | 'TERMINATED',
        statusIn?: Array<'ACTIVE' | 'COMPLETED' | 'TERMINATED'>,
    ): CancelablePromise<PaginatedBatchList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/',
            query: {
                'batch_number': batchNumber,
                'batch_number__icontains': batchNumberIcontains,
                'batch_type': batchType,
                'batch_type_in': batchTypeIn,
                'biomass_max': biomassMax,
                'biomass_min': biomassMin,
                'end_date_after': endDateAfter,
                'end_date_before': endDateBefore,
                'lifecycle_stage': lifecycleStage,
                'lifecycle_stage__in': lifecycleStageIn,
                'ordering': ordering,
                'page': page,
                'population_max': populationMax,
                'population_min': populationMin,
                'search': search,
                'species': species,
                'species__in': speciesIn,
                'start_date_after': startDateAfter,
                'start_date_before': startDateBefore,
                'status': status,
                'status_in': statusIn,
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
     * Create a new batch.
     *
     * Requires details such as `batch_number`, `species`, `lifecycle_stage`, `status`, `batch_type`, and `start_date`.
     * `expected_end_date` will default to 30 days after `start_date` if not provided.
     * @param requestBody
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesCreate(
        requestBody: Batch,
    ): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/batches/',
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
     * Compare metrics between multiple batches.
     *
     * Query parameters:
     * - batch_ids: Comma-separated list of batch IDs to compare
     * - metrics: Comma-separated list of metrics to include (default: all)
     * Options: growth, mortality, biomass, all
     *
     * Example URL: /api/v1/batch/batches/compare/?batch_ids=1,2,3&metrics=growth,mortality
     * @param batchIds Comma-separated list of batch IDs to compare.
     * @param metrics Comma-separated metrics to include (growth, mortality, biomass, all).
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesCompareRetrieve(
        batchIds: string,
        metrics: string = 'all',
    ): CancelablePromise<Array<Batch>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/compare/',
            query: {
                'batch_ids': batchIds,
                'metrics': metrics,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get aggregated growth, mortality, and feed metrics for batches in a geography
     * Returns geography-level aggregated metrics for all batches including:
     * - Growth metrics (TGC, SGR, average growth rate)
     * - Mortality metrics (total count, rate, breakdown by cause)
     * - Feed metrics (total feed, average FCR)
     *
     * Useful for executive dashboards and geography-level performance monitoring.
     * @param geography Filter by geography ID. Required.
     * @param endDate Filter batches with activity before this date (ISO 8601 format: YYYY-MM-DD)
     * @param startDate Filter batches with activity after this date (ISO 8601 format: YYYY-MM-DD)
     * @returns any
     * @throws ApiError
     */
    public static batchGeographySummary(
        geography: number,
        endDate?: string,
        startDate?: string,
    ): CancelablePromise<{
        geography_id?: number;
        geography_name?: string;
        period_start?: string | null;
        period_end?: string | null;
        total_batches?: number;
        growth_metrics?: {
            avg_tgc?: number | null;
            avg_sgr?: number | null;
            avg_growth_rate_g_per_day?: number | null;
            avg_weight_g?: number;
            total_biomass_kg?: number;
        };
        mortality_metrics?: {
            total_count?: number;
            total_biomass_kg?: number;
            avg_mortality_rate_percent?: number;
            by_cause?: Array<{
                cause?: string;
                count?: number;
                percentage?: number;
            }>;
        };
        feed_metrics?: {
            total_feed_kg?: number;
            avg_fcr?: number | null;
            feed_cost_total?: number | null;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/geography-summary/',
            query: {
                'end_date': endDate,
                'geography': geography,
                'start_date': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle. Uses HistoryReasonMixin to
     * capture audit change reasons.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `species__in`: Filter by multiple Species IDs (comma-separated).
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
     * - `lifecycle_stage__in`: Filter by multiple LifeCycleStage IDs (comma-separated).
     * - `status`: Exact match by status string (e.g., 'ACTIVE', 'PLANNED').
     * - `batch_type`: Exact match by type string (e.g., 'PRODUCTION', 'EXPERIMENTAL').
     *
     * **Searching:**
     * - `batch_number`: Partial match.
     * - `species__name`: Partial match on the related Species name.
     * - `lifecycle_stage__name`: Partial match on the related LifeCycleStage name.
     * - `notes`: Partial match on the batch notes.
     * - `batch_type`: Partial match on the batch type.
     *
     * **Ordering:**
     * - `batch_number`
     * - `start_date`
     * - `species__name`
     * - `lifecycle_stage__name`
     * - `created_at` (default: descending)
     * @param id A unique integer value identifying this batch.
     * @param requestBody
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesUpdate(
        id: number,
        requestBody: Batch,
    ): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/batches/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle. Uses HistoryReasonMixin to
     * capture audit change reasons.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `species__in`: Filter by multiple Species IDs (comma-separated).
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
     * - `lifecycle_stage__in`: Filter by multiple LifeCycleStage IDs (comma-separated).
     * - `status`: Exact match by status string (e.g., 'ACTIVE', 'PLANNED').
     * - `batch_type`: Exact match by type string (e.g., 'PRODUCTION', 'EXPERIMENTAL').
     *
     * **Searching:**
     * - `batch_number`: Partial match.
     * - `species__name`: Partial match on the related Species name.
     * - `lifecycle_stage__name`: Partial match on the related LifeCycleStage name.
     * - `notes`: Partial match on the batch notes.
     * - `batch_type`: Partial match on the batch type.
     *
     * **Ordering:**
     * - `batch_number`
     * - `start_date`
     * - `species__name`
     * - `lifecycle_stage__name`
     * - `created_at` (default: descending)
     * @param id A unique integer value identifying this batch.
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesRetrieve(
        id: number,
    ): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/{id}/',
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
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle. Uses HistoryReasonMixin to
     * capture audit change reasons.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `species__in`: Filter by multiple Species IDs (comma-separated).
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
     * - `lifecycle_stage__in`: Filter by multiple LifeCycleStage IDs (comma-separated).
     * - `status`: Exact match by status string (e.g., 'ACTIVE', 'PLANNED').
     * - `batch_type`: Exact match by type string (e.g., 'PRODUCTION', 'EXPERIMENTAL').
     *
     * **Searching:**
     * - `batch_number`: Partial match.
     * - `species__name`: Partial match on the related Species name.
     * - `lifecycle_stage__name`: Partial match on the related LifeCycleStage name.
     * - `notes`: Partial match on the batch notes.
     * - `batch_type`: Partial match on the batch type.
     *
     * **Ordering:**
     * - `batch_number`
     * - `start_date`
     * - `species__name`
     * - `lifecycle_stage__name`
     * - `created_at` (default: descending)
     * @param id A unique integer value identifying this batch.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchBatchesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/batches/{id}/',
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
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle. Uses HistoryReasonMixin to
     * capture audit change reasons.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `species__in`: Filter by multiple Species IDs (comma-separated).
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
     * - `lifecycle_stage__in`: Filter by multiple LifeCycleStage IDs (comma-separated).
     * - `status`: Exact match by status string (e.g., 'ACTIVE', 'PLANNED').
     * - `batch_type`: Exact match by type string (e.g., 'PRODUCTION', 'EXPERIMENTAL').
     *
     * **Searching:**
     * - `batch_number`: Partial match.
     * - `species__name`: Partial match on the related Species name.
     * - `lifecycle_stage__name`: Partial match on the related LifeCycleStage name.
     * - `notes`: Partial match on the batch notes.
     * - `batch_type`: Partial match on the batch type.
     *
     * **Ordering:**
     * - `batch_number`
     * - `start_date`
     * - `species__name`
     * - `lifecycle_stage__name`
     * - `created_at` (default: descending)
     * @param id A unique integer value identifying this batch.
     * @param requestBody
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesPartialUpdate(
        id: number,
        requestBody?: PatchedBatch,
    ): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/batches/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Calculate and return growth analysis metrics for a batch over time.
     *
     * Returns metrics like:
     * - Growth rate over time
     * - Weight gain trends
     * - SGR (Specific Growth Rate)
     * - TGC (Thermal Growth Coefficient) if temperature data is available
     *
     * URL: /api/v1/batch/batches/{pk}/growth_analysis/
     * @param id A unique integer value identifying this batch.
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesGrowthAnalysisRetrieve(
        id: number,
    ): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/{id}/growth_analysis/',
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
     * Calculate and return performance metrics for a batch.
     *
     * Includes:
     * - Mortality rates
     * - Growth efficiency
     * - Density metrics
     * - Current status summary
     *
     * URL: /api/v1/batch/batches/{pk}/performance_metrics/
     * @param id A unique integer value identifying this batch.
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesPerformanceMetricsRetrieve(
        id: number,
    ): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/{id}/performance_metrics/',
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
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `container`: ID of the assigned container.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `is_active`: Boolean indicating if the assignment is currently active.
     * - `assignment_date`: Exact date of the assignment.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the assigned batch.
     * - `container__name`: Name of the assigned container.
     *
     * **Ordering:**
     * - `assignment_date` (default: descending)
     * - `batch__batch_number`
     * - `container__name`
     * - `population_count`
     * - `biomass_kg`
     * @param assignmentDate
     * @param assignmentDateAfter
     * @param assignmentDateBefore
     * @param batch
     * @param batchIn Multiple values may be separated by commas.
     * @param batchNumber
     * @param biomassMax
     * @param biomassMin
     * @param container
     * @param containerIn Multiple values may be separated by commas.
     * @param containerName
     * @param containerType
     * @param isActive
     * @param lifecycleStage
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param populationMax
     * @param populationMin
     * @param search A search term.
     * @param species
     * @returns PaginatedBatchContainerAssignmentList
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsList(
        assignmentDate?: string,
        assignmentDateAfter?: string,
        assignmentDateBefore?: string,
        batch?: number,
        batchIn?: Array<number>,
        batchNumber?: string,
        biomassMax?: number,
        biomassMin?: number,
        container?: number,
        containerIn?: Array<number>,
        containerName?: string,
        containerType?: string,
        isActive?: boolean,
        lifecycleStage?: number,
        ordering?: string,
        page?: number,
        populationMax?: number,
        populationMin?: number,
        search?: string,
        species?: number,
    ): CancelablePromise<PaginatedBatchContainerAssignmentList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/container-assignments/',
            query: {
                'assignment_date': assignmentDate,
                'assignment_date_after': assignmentDateAfter,
                'assignment_date_before': assignmentDateBefore,
                'batch': batch,
                'batch__in': batchIn,
                'batch_number': batchNumber,
                'biomass_max': biomassMax,
                'biomass_min': biomassMin,
                'container': container,
                'container__in': containerIn,
                'container_name': containerName,
                'container_type': containerType,
                'is_active': isActive,
                'lifecycle_stage': lifecycleStage,
                'ordering': ordering,
                'page': page,
                'population_max': populationMax,
                'population_min': populationMin,
                'search': search,
                'species': species,
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
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `container`: ID of the assigned container.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `is_active`: Boolean indicating if the assignment is currently active.
     * - `assignment_date`: Exact date of the assignment.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the assigned batch.
     * - `container__name`: Name of the assigned container.
     *
     * **Ordering:**
     * - `assignment_date` (default: descending)
     * - `batch__batch_number`
     * - `container__name`
     * - `population_count`
     * - `biomass_kg`
     * @param requestBody
     * @returns BatchContainerAssignment
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsCreate(
        requestBody: BatchContainerAssignment,
    ): CancelablePromise<BatchContainerAssignment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/container-assignments/',
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
     * Get aggregated summary of batch container assignments
     * Returns aggregated metrics for batch container assignments with optional location-based filtering.
     * @param area Filter by area ID. Only affects containers directly assigned to this area.
     * @param containerType Filter by container type category. Valid values: TANK, PEN, TRAY, OTHER.
     * @param geography Filter by geography ID. Affects containers in both halls and areas within this geography.
     * @param hall Filter by hall ID. Only affects containers directly in this hall.
     * @param isActive Filter by active status (default: true). Set to false to include inactive assignments.
     * @param station Filter by freshwater station ID. Only affects containers in halls within this station.
     * @returns any
     * @throws ApiError
     */
    public static batchContainerAssignmentsSummary(
        area?: number,
        containerType?: string,
        geography?: number,
        hall?: number,
        isActive: boolean = true,
        station?: number,
    ): CancelablePromise<{
        /**
         * Total biomass in kg for active assignments
         */
        active_biomass_kg: number;
        /**
         * Total number of assignments matching filters
         */
        count: number;
        /**
         * Total fish population count across all assignments
         */
        total_population: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/container-assignments/summary/',
            query: {
                'area': area,
                'container_type': containerType,
                'geography': geography,
                'hall': hall,
                'is_active': isActive,
                'station': station,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `container`: ID of the assigned container.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `is_active`: Boolean indicating if the assignment is currently active.
     * - `assignment_date`: Exact date of the assignment.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the assigned batch.
     * - `container__name`: Name of the assigned container.
     *
     * **Ordering:**
     * - `assignment_date` (default: descending)
     * - `batch__batch_number`
     * - `container__name`
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch container assignment.
     * @param requestBody
     * @returns BatchContainerAssignment
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsUpdate(
        id: number,
        requestBody: BatchContainerAssignment,
    ): CancelablePromise<BatchContainerAssignment> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/container-assignments/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `container`: ID of the assigned container.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `is_active`: Boolean indicating if the assignment is currently active.
     * - `assignment_date`: Exact date of the assignment.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the assigned batch.
     * - `container__name`: Name of the assigned container.
     *
     * **Ordering:**
     * - `assignment_date` (default: descending)
     * - `batch__batch_number`
     * - `container__name`
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch container assignment.
     * @returns BatchContainerAssignment
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsRetrieve(
        id: number,
    ): CancelablePromise<BatchContainerAssignment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/container-assignments/{id}/',
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
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `container`: ID of the assigned container.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `is_active`: Boolean indicating if the assignment is currently active.
     * - `assignment_date`: Exact date of the assignment.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the assigned batch.
     * - `container__name`: Name of the assigned container.
     *
     * **Ordering:**
     * - `assignment_date` (default: descending)
     * - `batch__batch_number`
     * - `container__name`
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch container assignment.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/container-assignments/{id}/',
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
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `container`: ID of the assigned container.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `is_active`: Boolean indicating if the assignment is currently active.
     * - `assignment_date`: Exact date of the assignment.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the assigned batch.
     * - `container__name`: Name of the assigned container.
     *
     * **Ordering:**
     * - `assignment_date` (default: descending)
     * - `batch__batch_number`
     * - `container__name`
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch container assignment.
     * @param requestBody
     * @returns BatchContainerAssignment
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsPartialUpdate(
        id: number,
        requestBody?: PatchedBatchContainerAssignment,
    ): CancelablePromise<BatchContainerAssignment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/container-assignments/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `mixed_batch`: ID of the resulting mixed batch.
     * - `source_batch`: ID of a source batch contributing to the mixed batch.
     *
     * **Searching:**
     * - `mixed_batch__batch_number`: Batch number of the mixed batch.
     * - `source_batch__batch_number`: Batch number of the source batch.
     *
     * **Ordering:**
     * - `mixed_batch__batch_number` (default)
     * - `source_batch__batch_number`
     * - `percentage` (default)
     * - `population_count`
     * - `biomass_kg`
     * @param biomassMax
     * @param biomassMin
     * @param mixedBatch
     * @param mixedBatchNumber
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param percentageMax
     * @param percentageMin
     * @param populationMax
     * @param populationMin
     * @param search A search term.
     * @param sourceBatch
     * @param sourceBatchNumber
     * @returns PaginatedBatchCompositionList
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsList(
        biomassMax?: number,
        biomassMin?: number,
        mixedBatch?: number,
        mixedBatchNumber?: string,
        ordering?: string,
        page?: number,
        percentageMax?: number,
        percentageMin?: number,
        populationMax?: number,
        populationMin?: number,
        search?: string,
        sourceBatch?: number,
        sourceBatchNumber?: string,
    ): CancelablePromise<PaginatedBatchCompositionList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batch-compositions/',
            query: {
                'biomass_max': biomassMax,
                'biomass_min': biomassMin,
                'mixed_batch': mixedBatch,
                'mixed_batch_number': mixedBatchNumber,
                'ordering': ordering,
                'page': page,
                'percentage_max': percentageMax,
                'percentage_min': percentageMin,
                'population_max': populationMax,
                'population_min': populationMin,
                'search': search,
                'source_batch': sourceBatch,
                'source_batch_number': sourceBatchNumber,
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
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `mixed_batch`: ID of the resulting mixed batch.
     * - `source_batch`: ID of a source batch contributing to the mixed batch.
     *
     * **Searching:**
     * - `mixed_batch__batch_number`: Batch number of the mixed batch.
     * - `source_batch__batch_number`: Batch number of the source batch.
     *
     * **Ordering:**
     * - `mixed_batch__batch_number` (default)
     * - `source_batch__batch_number`
     * - `percentage` (default)
     * - `population_count`
     * - `biomass_kg`
     * @param requestBody
     * @returns BatchComposition
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsCreate(
        requestBody: BatchComposition,
    ): CancelablePromise<BatchComposition> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/batch-compositions/',
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
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `mixed_batch`: ID of the resulting mixed batch.
     * - `source_batch`: ID of a source batch contributing to the mixed batch.
     *
     * **Searching:**
     * - `mixed_batch__batch_number`: Batch number of the mixed batch.
     * - `source_batch__batch_number`: Batch number of the source batch.
     *
     * **Ordering:**
     * - `mixed_batch__batch_number` (default)
     * - `source_batch__batch_number`
     * - `percentage` (default)
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch composition.
     * @param requestBody
     * @returns BatchComposition
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsUpdate(
        id: number,
        requestBody: BatchComposition,
    ): CancelablePromise<BatchComposition> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/batch-compositions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `mixed_batch`: ID of the resulting mixed batch.
     * - `source_batch`: ID of a source batch contributing to the mixed batch.
     *
     * **Searching:**
     * - `mixed_batch__batch_number`: Batch number of the mixed batch.
     * - `source_batch__batch_number`: Batch number of the source batch.
     *
     * **Ordering:**
     * - `mixed_batch__batch_number` (default)
     * - `source_batch__batch_number`
     * - `percentage` (default)
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch composition.
     * @returns BatchComposition
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsRetrieve(
        id: number,
    ): CancelablePromise<BatchComposition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batch-compositions/{id}/',
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
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `mixed_batch`: ID of the resulting mixed batch.
     * - `source_batch`: ID of a source batch contributing to the mixed batch.
     *
     * **Searching:**
     * - `mixed_batch__batch_number`: Batch number of the mixed batch.
     * - `source_batch__batch_number`: Batch number of the source batch.
     *
     * **Ordering:**
     * - `mixed_batch__batch_number` (default)
     * - `source_batch__batch_number`
     * - `percentage` (default)
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch composition.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/batch-compositions/{id}/',
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
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `mixed_batch`: ID of the resulting mixed batch.
     * - `source_batch`: ID of a source batch contributing to the mixed batch.
     *
     * **Searching:**
     * - `mixed_batch__batch_number`: Batch number of the mixed batch.
     * - `source_batch__batch_number`: Batch number of the source batch.
     *
     * **Ordering:**
     * - `mixed_batch__batch_number` (default)
     * - `source_batch__batch_number`
     * - `percentage` (default)
     * - `population_count`
     * - `biomass_kg`
     * @param id A unique integer value identifying this batch composition.
     * @param requestBody
     * @returns BatchComposition
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsPartialUpdate(
        id: number,
        requestBody?: PatchedBatchComposition,
    ): CancelablePromise<BatchComposition> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/batch-compositions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Batch Transfer Workflows.
     *
     * Batch transfer workflows orchestrate multi-step transfer operations that
     * may take days or weeks to complete. They manage multiple TransferAction
     * instances and track progress, completion, and finance integration.
     *
     * **State Machine:**
     * - DRAFT: Initial creation, can add/modify actions
     * - PLANNED: Finalized, ready to execute actions
     * - IN_PROGRESS: At least one action executed
     * - COMPLETED: All actions completed
     * - CANCELLED: Workflow cancelled
     *
     * **Filtering:**
     * - `batch`: ID of the batch being transferred
     * - `workflow_type`: Type (LIFECYCLE_TRANSITION, CONTAINER_REDISTRIBUTION,
     * etc.)
     * - `status`: Workflow status
     * - `is_intercompany`: Whether crosses subsidiary boundaries
     * - `planned_start_date`: Filter by planned start date
     *
     * **Searching:**
     * - `workflow_number`: Workflow identifier
     * - `batch__batch_number`: Batch number
     * - `notes`: Workflow notes
     *
     * **Ordering:**
     * - `planned_start_date` (default: descending)
     * - `created_at`
     * - `workflow_number`
     * - `status`
     * @param actualStartAfter
     * @param actualStartBefore
     * @param batch
     * @param batchNumber
     * @param completedBy
     * @param completionMax
     * @param completionMin
     * @param destLifecycleStage
     * @param destSubsidiary
     * @param initiatedBy
     * @param isIntercompany
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param plannedStartAfter
     * @param plannedStartBefore
     * @param search A search term.
     * @param sourceLifecycleStage
     * @param sourceSubsidiary
     * @param status * `DRAFT` - Draft - Planning
     * * `PLANNED` - Planned - Ready to Execute
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     * @param statusIn * `DRAFT` - Draft - Planning
     * * `PLANNED` - Planned - Ready to Execute
     * * `IN_PROGRESS` - In Progress
     * * `COMPLETED` - Completed
     * * `CANCELLED` - Cancelled
     * @param workflowType * `LIFECYCLE_TRANSITION` - Lifecycle Stage Transition
     * * `CONTAINER_REDISTRIBUTION` - Container Redistribution
     * * `EMERGENCY_CASCADE` - Emergency Cascading Transfer
     * * `PARTIAL_HARVEST` - Partial Harvest Preparation
     * @param workflowTypeIn * `LIFECYCLE_TRANSITION` - Lifecycle Stage Transition
     * * `CONTAINER_REDISTRIBUTION` - Container Redistribution
     * * `EMERGENCY_CASCADE` - Emergency Cascading Transfer
     * * `PARTIAL_HARVEST` - Partial Harvest Preparation
     * @returns PaginatedBatchTransferWorkflowListList
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsList(
        actualStartAfter?: string,
        actualStartBefore?: string,
        batch?: number,
        batchNumber?: string,
        completedBy?: number,
        completionMax?: number,
        completionMin?: number,
        destLifecycleStage?: number,
        destSubsidiary?: string,
        initiatedBy?: number,
        isIntercompany?: boolean,
        ordering?: string,
        page?: number,
        plannedStartAfter?: string,
        plannedStartBefore?: string,
        search?: string,
        sourceLifecycleStage?: number,
        sourceSubsidiary?: string,
        status?: 'CANCELLED' | 'COMPLETED' | 'DRAFT' | 'IN_PROGRESS' | 'PLANNED',
        statusIn?: Array<'CANCELLED' | 'COMPLETED' | 'DRAFT' | 'IN_PROGRESS' | 'PLANNED'>,
        workflowType?: 'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE' | 'LIFECYCLE_TRANSITION' | 'PARTIAL_HARVEST',
        workflowTypeIn?: Array<'CONTAINER_REDISTRIBUTION' | 'EMERGENCY_CASCADE' | 'LIFECYCLE_TRANSITION' | 'PARTIAL_HARVEST'>,
    ): CancelablePromise<PaginatedBatchTransferWorkflowListList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/transfer-workflows/',
            query: {
                'actual_start_after': actualStartAfter,
                'actual_start_before': actualStartBefore,
                'batch': batch,
                'batch_number': batchNumber,
                'completed_by': completedBy,
                'completion_max': completionMax,
                'completion_min': completionMin,
                'dest_lifecycle_stage': destLifecycleStage,
                'dest_subsidiary': destSubsidiary,
                'initiated_by': initiatedBy,
                'is_intercompany': isIntercompany,
                'ordering': ordering,
                'page': page,
                'planned_start_after': plannedStartAfter,
                'planned_start_before': plannedStartBefore,
                'search': search,
                'source_lifecycle_stage': sourceLifecycleStage,
                'source_subsidiary': sourceSubsidiary,
                'status': status,
                'status_in': statusIn,
                'workflow_type': workflowType,
                'workflow_type_in': workflowTypeIn,
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
     * API endpoint for managing Batch Transfer Workflows.
     *
     * Batch transfer workflows orchestrate multi-step transfer operations that
     * may take days or weeks to complete. They manage multiple TransferAction
     * instances and track progress, completion, and finance integration.
     *
     * **State Machine:**
     * - DRAFT: Initial creation, can add/modify actions
     * - PLANNED: Finalized, ready to execute actions
     * - IN_PROGRESS: At least one action executed
     * - COMPLETED: All actions completed
     * - CANCELLED: Workflow cancelled
     *
     * **Filtering:**
     * - `batch`: ID of the batch being transferred
     * - `workflow_type`: Type (LIFECYCLE_TRANSITION, CONTAINER_REDISTRIBUTION,
     * etc.)
     * - `status`: Workflow status
     * - `is_intercompany`: Whether crosses subsidiary boundaries
     * - `planned_start_date`: Filter by planned start date
     *
     * **Searching:**
     * - `workflow_number`: Workflow identifier
     * - `batch__batch_number`: Batch number
     * - `notes`: Workflow notes
     *
     * **Ordering:**
     * - `planned_start_date` (default: descending)
     * - `created_at`
     * - `workflow_number`
     * - `status`
     * @param requestBody
     * @returns BatchTransferWorkflowCreate
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsCreate(
        requestBody: BatchTransferWorkflowCreate,
    ): CancelablePromise<BatchTransferWorkflowCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-workflows/',
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
     * API endpoint for managing Batch Transfer Workflows.
     *
     * Batch transfer workflows orchestrate multi-step transfer operations that
     * may take days or weeks to complete. They manage multiple TransferAction
     * instances and track progress, completion, and finance integration.
     *
     * **State Machine:**
     * - DRAFT: Initial creation, can add/modify actions
     * - PLANNED: Finalized, ready to execute actions
     * - IN_PROGRESS: At least one action executed
     * - COMPLETED: All actions completed
     * - CANCELLED: Workflow cancelled
     *
     * **Filtering:**
     * - `batch`: ID of the batch being transferred
     * - `workflow_type`: Type (LIFECYCLE_TRANSITION, CONTAINER_REDISTRIBUTION,
     * etc.)
     * - `status`: Workflow status
     * - `is_intercompany`: Whether crosses subsidiary boundaries
     * - `planned_start_date`: Filter by planned start date
     *
     * **Searching:**
     * - `workflow_number`: Workflow identifier
     * - `batch__batch_number`: Batch number
     * - `notes`: Workflow notes
     *
     * **Ordering:**
     * - `planned_start_date` (default: descending)
     * - `created_at`
     * - `workflow_number`
     * - `status`
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @param requestBody
     * @returns BatchTransferWorkflowDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsUpdate(
        id: number,
        requestBody: BatchTransferWorkflowDetail,
    ): CancelablePromise<BatchTransferWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/transfer-workflows/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Batch Transfer Workflows.
     *
     * Batch transfer workflows orchestrate multi-step transfer operations that
     * may take days or weeks to complete. They manage multiple TransferAction
     * instances and track progress, completion, and finance integration.
     *
     * **State Machine:**
     * - DRAFT: Initial creation, can add/modify actions
     * - PLANNED: Finalized, ready to execute actions
     * - IN_PROGRESS: At least one action executed
     * - COMPLETED: All actions completed
     * - CANCELLED: Workflow cancelled
     *
     * **Filtering:**
     * - `batch`: ID of the batch being transferred
     * - `workflow_type`: Type (LIFECYCLE_TRANSITION, CONTAINER_REDISTRIBUTION,
     * etc.)
     * - `status`: Workflow status
     * - `is_intercompany`: Whether crosses subsidiary boundaries
     * - `planned_start_date`: Filter by planned start date
     *
     * **Searching:**
     * - `workflow_number`: Workflow identifier
     * - `batch__batch_number`: Batch number
     * - `notes`: Workflow notes
     *
     * **Ordering:**
     * - `planned_start_date` (default: descending)
     * - `created_at`
     * - `workflow_number`
     * - `status`
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @returns BatchTransferWorkflowDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsRetrieve(
        id: number,
    ): CancelablePromise<BatchTransferWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/transfer-workflows/{id}/',
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
     * API endpoint for managing Batch Transfer Workflows.
     *
     * Batch transfer workflows orchestrate multi-step transfer operations that
     * may take days or weeks to complete. They manage multiple TransferAction
     * instances and track progress, completion, and finance integration.
     *
     * **State Machine:**
     * - DRAFT: Initial creation, can add/modify actions
     * - PLANNED: Finalized, ready to execute actions
     * - IN_PROGRESS: At least one action executed
     * - COMPLETED: All actions completed
     * - CANCELLED: Workflow cancelled
     *
     * **Filtering:**
     * - `batch`: ID of the batch being transferred
     * - `workflow_type`: Type (LIFECYCLE_TRANSITION, CONTAINER_REDISTRIBUTION,
     * etc.)
     * - `status`: Workflow status
     * - `is_intercompany`: Whether crosses subsidiary boundaries
     * - `planned_start_date`: Filter by planned start date
     *
     * **Searching:**
     * - `workflow_number`: Workflow identifier
     * - `batch__batch_number`: Batch number
     * - `notes`: Workflow notes
     *
     * **Ordering:**
     * - `planned_start_date` (default: descending)
     * - `created_at`
     * - `workflow_number`
     * - `status`
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/transfer-workflows/{id}/',
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
     * API endpoint for managing Batch Transfer Workflows.
     *
     * Batch transfer workflows orchestrate multi-step transfer operations that
     * may take days or weeks to complete. They manage multiple TransferAction
     * instances and track progress, completion, and finance integration.
     *
     * **State Machine:**
     * - DRAFT: Initial creation, can add/modify actions
     * - PLANNED: Finalized, ready to execute actions
     * - IN_PROGRESS: At least one action executed
     * - COMPLETED: All actions completed
     * - CANCELLED: Workflow cancelled
     *
     * **Filtering:**
     * - `batch`: ID of the batch being transferred
     * - `workflow_type`: Type (LIFECYCLE_TRANSITION, CONTAINER_REDISTRIBUTION,
     * etc.)
     * - `status`: Workflow status
     * - `is_intercompany`: Whether crosses subsidiary boundaries
     * - `planned_start_date`: Filter by planned start date
     *
     * **Searching:**
     * - `workflow_number`: Workflow identifier
     * - `batch__batch_number`: Batch number
     * - `notes`: Workflow notes
     *
     * **Ordering:**
     * - `planned_start_date` (default: descending)
     * - `created_at`
     * - `workflow_number`
     * - `status`
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @param requestBody
     * @returns BatchTransferWorkflowDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsPartialUpdate(
        id: number,
        requestBody?: PatchedBatchTransferWorkflowDetail,
    ): CancelablePromise<BatchTransferWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/transfer-workflows/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Cancel workflow
     * Cancels workflow with reason. Cannot cancel if already completed or cancelled.
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @param requestBody
     * @returns BatchTransferWorkflowDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsCancelCreate(
        id: number,
        requestBody?: {
            /**
             * Reason for cancellation
             */
            reason: string;
        },
    ): CancelablePromise<BatchTransferWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-workflows/{id}/cancel/',
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
     * Force complete workflow
     * Manually marks workflow as completed. Use only if all actions are done manually.
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @returns BatchTransferWorkflowDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsCompleteCreate(
        id: number,
    ): CancelablePromise<BatchTransferWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-workflows/{id}/complete/',
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
     * Detect intercompany transfer
     * Analyzes workflow actions to determine if transfer crosses subsidiary boundaries.
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @returns any
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsDetectIntercompanyCreate(
        id: number,
    ): CancelablePromise<{
        is_intercompany?: boolean;
        source_subsidiary?: string;
        dest_subsidiary?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-workflows/{id}/detect_intercompany/',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Finalize workflow to PLANNED status
     * Transitions workflow from DRAFT to PLANNED status. Workflow must have at least one action. After planning, actions can be executed.
     * @param id A unique integer value identifying this Batch Transfer Workflow.
     * @returns BatchTransferWorkflowDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferWorkflowsPlanCreate(
        id: number,
    ): CancelablePromise<BatchTransferWorkflowDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-workflows/{id}/plan/',
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
     * API endpoint for managing Transfer Actions.
     *
     * Transfer actions represent individual container-to-container fish
     * movements within a workflow. Each action can be executed independently,
     * tracking mortality, environmental conditions, and execution details.
     *
     * **State Machine:**
     * - PENDING: Created, not yet executed
     * - IN_PROGRESS: Currently being executed
     * - COMPLETED: Successfully executed
     * - FAILED: Execution failed, can be retried
     * - SKIPPED: Manually skipped
     *
     * **Filtering:**
     * - `workflow`: ID of parent workflow
     * - `status`: Action status
     * - `source_assignment`: Source container assignment
     * - `dest_assignment`: Destination container assignment
     * - `planned_date`: Filter by planned date
     *
     * **Searching:**
     * - `workflow__workflow_number`: Workflow identifier
     * - `notes`: Action notes
     *
     * **Ordering:**
     * - `action_number` (default: ascending within workflow)
     * - `planned_date`
     * - `actual_execution_date`
     * - `status`
     * @param biomassMax
     * @param biomassMin
     * @param destAssignment
     * @param destContainer
     * @param executedBy
     * @param executionDateAfter
     * @param executionDateBefore
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param plannedDateAfter
     * @param plannedDateBefore
     * @param search A search term.
     * @param sourceAssignment
     * @param sourceContainer
     * @param status * `PENDING` - Pending - Not Started
     * * `IN_PROGRESS` - In Progress - Being Executed
     * * `COMPLETED` - Completed
     * * `FAILED` - Failed - Rolled Back
     * * `SKIPPED` - Skipped
     * @param statusIn * `PENDING` - Pending - Not Started
     * * `IN_PROGRESS` - In Progress - Being Executed
     * * `COMPLETED` - Completed
     * * `FAILED` - Failed - Rolled Back
     * * `SKIPPED` - Skipped
     * @param transferMethod Method used for transfer
     *
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     * @param transferMethodIn Method used for transfer
     *
     * * `NET` - Net Transfer
     * * `PUMP` - Pump Transfer
     * * `GRAVITY` - Gravity Transfer
     * * `MANUAL` - Manual Bucket Transfer
     * @param transferredCountMax
     * @param transferredCountMin
     * @param workflow
     * @param workflowNumber
     * @param workflowStatus
     * @returns PaginatedTransferActionListList
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsList(
        biomassMax?: number,
        biomassMin?: number,
        destAssignment?: number,
        destContainer?: number,
        executedBy?: number,
        executionDateAfter?: string,
        executionDateBefore?: string,
        ordering?: string,
        page?: number,
        plannedDateAfter?: string,
        plannedDateBefore?: string,
        search?: string,
        sourceAssignment?: number,
        sourceContainer?: number,
        status?: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING' | 'SKIPPED',
        statusIn?: Array<'COMPLETED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING' | 'SKIPPED'>,
        transferMethod?: 'GRAVITY' | 'MANUAL' | 'NET' | 'PUMP' | null,
        transferMethodIn?: Array<'GRAVITY' | 'MANUAL' | 'NET' | 'PUMP' | null>,
        transferredCountMax?: number,
        transferredCountMin?: number,
        workflow?: number,
        workflowNumber?: string,
        workflowStatus?: string,
    ): CancelablePromise<PaginatedTransferActionListList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/transfer-actions/',
            query: {
                'biomass_max': biomassMax,
                'biomass_min': biomassMin,
                'dest_assignment': destAssignment,
                'dest_container': destContainer,
                'executed_by': executedBy,
                'execution_date_after': executionDateAfter,
                'execution_date_before': executionDateBefore,
                'ordering': ordering,
                'page': page,
                'planned_date_after': plannedDateAfter,
                'planned_date_before': plannedDateBefore,
                'search': search,
                'source_assignment': sourceAssignment,
                'source_container': sourceContainer,
                'status': status,
                'status_in': statusIn,
                'transfer_method': transferMethod,
                'transfer_method_in': transferMethodIn,
                'transferred_count_max': transferredCountMax,
                'transferred_count_min': transferredCountMin,
                'workflow': workflow,
                'workflow_number': workflowNumber,
                'workflow_status': workflowStatus,
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
     * API endpoint for managing Transfer Actions.
     *
     * Transfer actions represent individual container-to-container fish
     * movements within a workflow. Each action can be executed independently,
     * tracking mortality, environmental conditions, and execution details.
     *
     * **State Machine:**
     * - PENDING: Created, not yet executed
     * - IN_PROGRESS: Currently being executed
     * - COMPLETED: Successfully executed
     * - FAILED: Execution failed, can be retried
     * - SKIPPED: Manually skipped
     *
     * **Filtering:**
     * - `workflow`: ID of parent workflow
     * - `status`: Action status
     * - `source_assignment`: Source container assignment
     * - `dest_assignment`: Destination container assignment
     * - `planned_date`: Filter by planned date
     *
     * **Searching:**
     * - `workflow__workflow_number`: Workflow identifier
     * - `notes`: Action notes
     *
     * **Ordering:**
     * - `action_number` (default: ascending within workflow)
     * - `planned_date`
     * - `actual_execution_date`
     * - `status`
     * @param requestBody
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsCreate(
        requestBody: TransferActionDetail,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-actions/',
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
     * API endpoint for managing Transfer Actions.
     *
     * Transfer actions represent individual container-to-container fish
     * movements within a workflow. Each action can be executed independently,
     * tracking mortality, environmental conditions, and execution details.
     *
     * **State Machine:**
     * - PENDING: Created, not yet executed
     * - IN_PROGRESS: Currently being executed
     * - COMPLETED: Successfully executed
     * - FAILED: Execution failed, can be retried
     * - SKIPPED: Manually skipped
     *
     * **Filtering:**
     * - `workflow`: ID of parent workflow
     * - `status`: Action status
     * - `source_assignment`: Source container assignment
     * - `dest_assignment`: Destination container assignment
     * - `planned_date`: Filter by planned date
     *
     * **Searching:**
     * - `workflow__workflow_number`: Workflow identifier
     * - `notes`: Action notes
     *
     * **Ordering:**
     * - `action_number` (default: ascending within workflow)
     * - `planned_date`
     * - `actual_execution_date`
     * - `status`
     * @param id A unique integer value identifying this Transfer Action.
     * @param requestBody
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsUpdate(
        id: number,
        requestBody: TransferActionDetail,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/transfer-actions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Transfer Actions.
     *
     * Transfer actions represent individual container-to-container fish
     * movements within a workflow. Each action can be executed independently,
     * tracking mortality, environmental conditions, and execution details.
     *
     * **State Machine:**
     * - PENDING: Created, not yet executed
     * - IN_PROGRESS: Currently being executed
     * - COMPLETED: Successfully executed
     * - FAILED: Execution failed, can be retried
     * - SKIPPED: Manually skipped
     *
     * **Filtering:**
     * - `workflow`: ID of parent workflow
     * - `status`: Action status
     * - `source_assignment`: Source container assignment
     * - `dest_assignment`: Destination container assignment
     * - `planned_date`: Filter by planned date
     *
     * **Searching:**
     * - `workflow__workflow_number`: Workflow identifier
     * - `notes`: Action notes
     *
     * **Ordering:**
     * - `action_number` (default: ascending within workflow)
     * - `planned_date`
     * - `actual_execution_date`
     * - `status`
     * @param id A unique integer value identifying this Transfer Action.
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsRetrieve(
        id: number,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/transfer-actions/{id}/',
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
     * API endpoint for managing Transfer Actions.
     *
     * Transfer actions represent individual container-to-container fish
     * movements within a workflow. Each action can be executed independently,
     * tracking mortality, environmental conditions, and execution details.
     *
     * **State Machine:**
     * - PENDING: Created, not yet executed
     * - IN_PROGRESS: Currently being executed
     * - COMPLETED: Successfully executed
     * - FAILED: Execution failed, can be retried
     * - SKIPPED: Manually skipped
     *
     * **Filtering:**
     * - `workflow`: ID of parent workflow
     * - `status`: Action status
     * - `source_assignment`: Source container assignment
     * - `dest_assignment`: Destination container assignment
     * - `planned_date`: Filter by planned date
     *
     * **Searching:**
     * - `workflow__workflow_number`: Workflow identifier
     * - `notes`: Action notes
     *
     * **Ordering:**
     * - `action_number` (default: ascending within workflow)
     * - `planned_date`
     * - `actual_execution_date`
     * - `status`
     * @param id A unique integer value identifying this Transfer Action.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/transfer-actions/{id}/',
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
     * API endpoint for managing Transfer Actions.
     *
     * Transfer actions represent individual container-to-container fish
     * movements within a workflow. Each action can be executed independently,
     * tracking mortality, environmental conditions, and execution details.
     *
     * **State Machine:**
     * - PENDING: Created, not yet executed
     * - IN_PROGRESS: Currently being executed
     * - COMPLETED: Successfully executed
     * - FAILED: Execution failed, can be retried
     * - SKIPPED: Manually skipped
     *
     * **Filtering:**
     * - `workflow`: ID of parent workflow
     * - `status`: Action status
     * - `source_assignment`: Source container assignment
     * - `dest_assignment`: Destination container assignment
     * - `planned_date`: Filter by planned date
     *
     * **Searching:**
     * - `workflow__workflow_number`: Workflow identifier
     * - `notes`: Action notes
     *
     * **Ordering:**
     * - `action_number` (default: ascending within workflow)
     * - `planned_date`
     * - `actual_execution_date`
     * - `status`
     * @param id A unique integer value identifying this Transfer Action.
     * @param requestBody
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsPartialUpdate(
        id: number,
        requestBody?: PatchedTransferActionDetail,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/transfer-actions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Execute transfer action
     * Executes this transfer action, moving fish from source to destination container. Updates populations, marks action complete, and updates workflow progress.
     * @param id A unique integer value identifying this Transfer Action.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsExecuteCreate(
        id: number,
        requestBody?: TransferActionExecute,
    ): CancelablePromise<{
        action_id?: number;
        action_status?: string;
        workflow_status?: string;
        completion_percentage?: number;
        actions_remaining?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-actions/{id}/execute/',
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
     * Retry failed action
     * Resets failed action to PENDING for retry.
     * @param id A unique integer value identifying this Transfer Action.
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsRetryCreate(
        id: number,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-actions/{id}/retry/',
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
     * Rollback transfer action
     * Marks action as failed. Does NOT reverse database changes - manual intervention required.
     * @param id A unique integer value identifying this Transfer Action.
     * @param requestBody
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsRollbackCreate(
        id: number,
        requestBody: TransferActionRollback,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-actions/{id}/rollback/',
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
     * Skip transfer action
     * Skips this transfer action with a reason. Action is marked as completed but not executed.
     * @param id A unique integer value identifying this Transfer Action.
     * @param requestBody
     * @returns TransferActionDetail
     * @throws ApiError
     */
    public static apiV1BatchTransferActionsSkipCreate(
        id: number,
        requestBody: TransferActionSkip,
    ): CancelablePromise<TransferActionDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfer-actions/{id}/skip/',
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
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `event_date`: Exact date of the mortality event.
     * - `cause`: Suspected cause of mortality (e.g., 'DISEASE', 'PREDATION', 'HANDLING').
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch.
     * - `notes`: Notes associated with the mortality event.
     *
     * **Ordering:**
     * - `event_date` (default: descending)
     * - `batch__batch_number`
     * - `count` (number of mortalities)
     * - `created_at`
     * @param batch
     * @param batchIn Multiple values may be separated by commas.
     * @param batchNumber
     * @param biomassMax
     * @param biomassMin
     * @param cause * `DISEASE` - Disease
     * * `HANDLING` - Handling
     * * `PREDATION` - Predation
     * * `ENVIRONMENTAL` - Environmental
     * * `UNKNOWN` - Unknown
     * * `OTHER` - Other
     * @param causeIn * `DISEASE` - Disease
     * * `HANDLING` - Handling
     * * `PREDATION` - Predation
     * * `ENVIRONMENTAL` - Environmental
     * * `UNKNOWN` - Unknown
     * * `OTHER` - Other
     * @param countMax
     * @param countMin
     * @param eventDate
     * @param eventDateAfter
     * @param eventDateBefore
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedMortalityEventList
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsList(
        batch?: number,
        batchIn?: Array<number>,
        batchNumber?: string,
        biomassMax?: number,
        biomassMin?: number,
        cause?: 'DISEASE' | 'ENVIRONMENTAL' | 'HANDLING' | 'OTHER' | 'PREDATION' | 'UNKNOWN',
        causeIn?: Array<'DISEASE' | 'ENVIRONMENTAL' | 'HANDLING' | 'OTHER' | 'PREDATION' | 'UNKNOWN'>,
        countMax?: number,
        countMin?: number,
        eventDate?: string,
        eventDateAfter?: string,
        eventDateBefore?: string,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedMortalityEventList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/mortality-events/',
            query: {
                'batch': batch,
                'batch__in': batchIn,
                'batch_number': batchNumber,
                'biomass_max': biomassMax,
                'biomass_min': biomassMin,
                'cause': cause,
                'cause_in': causeIn,
                'count_max': countMax,
                'count_min': countMin,
                'event_date': eventDate,
                'event_date_after': eventDateAfter,
                'event_date_before': eventDateBefore,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `event_date`: Exact date of the mortality event.
     * - `cause`: Suspected cause of mortality (e.g., 'DISEASE', 'PREDATION', 'HANDLING').
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch.
     * - `notes`: Notes associated with the mortality event.
     *
     * **Ordering:**
     * - `event_date` (default: descending)
     * - `batch__batch_number`
     * - `count` (number of mortalities)
     * - `created_at`
     * @param requestBody
     * @returns MortalityEvent
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsCreate(
        requestBody: MortalityEvent,
    ): CancelablePromise<MortalityEvent> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/mortality-events/',
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
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `event_date`: Exact date of the mortality event.
     * - `cause`: Suspected cause of mortality (e.g., 'DISEASE', 'PREDATION', 'HANDLING').
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch.
     * - `notes`: Notes associated with the mortality event.
     *
     * **Ordering:**
     * - `event_date` (default: descending)
     * - `batch__batch_number`
     * - `count` (number of mortalities)
     * - `created_at`
     * @param id A unique integer value identifying this mortality event.
     * @param requestBody
     * @returns MortalityEvent
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsUpdate(
        id: number,
        requestBody: MortalityEvent,
    ): CancelablePromise<MortalityEvent> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/mortality-events/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `event_date`: Exact date of the mortality event.
     * - `cause`: Suspected cause of mortality (e.g., 'DISEASE', 'PREDATION', 'HANDLING').
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch.
     * - `notes`: Notes associated with the mortality event.
     *
     * **Ordering:**
     * - `event_date` (default: descending)
     * - `batch__batch_number`
     * - `count` (number of mortalities)
     * - `created_at`
     * @param id A unique integer value identifying this mortality event.
     * @returns MortalityEvent
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsRetrieve(
        id: number,
    ): CancelablePromise<MortalityEvent> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/mortality-events/{id}/',
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
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `event_date`: Exact date of the mortality event.
     * - `cause`: Suspected cause of mortality (e.g., 'DISEASE', 'PREDATION', 'HANDLING').
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch.
     * - `notes`: Notes associated with the mortality event.
     *
     * **Ordering:**
     * - `event_date` (default: descending)
     * - `batch__batch_number`
     * - `count` (number of mortalities)
     * - `created_at`
     * @param id A unique integer value identifying this mortality event.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/mortality-events/{id}/',
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
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events. Uses HistoryReasonMixin
     * to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `event_date`: Exact date of the mortality event.
     * - `cause`: Suspected cause of mortality (e.g., 'DISEASE', 'PREDATION', 'HANDLING').
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch.
     * - `notes`: Notes associated with the mortality event.
     *
     * **Ordering:**
     * - `event_date` (default: descending)
     * - `batch__batch_number`
     * - `count` (number of mortalities)
     * - `created_at`
     * @param id A unique integer value identifying this mortality event.
     * @param requestBody
     * @returns MortalityEvent
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsPartialUpdate(
        id: number,
        requestBody?: PatchedMortalityEvent,
    ): CancelablePromise<MortalityEvent> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/mortality-events/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `assignment__batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param assignmentBatch
     * @param assignmentBatchIn Multiple values may be separated by commas.
     * @param avgLengthMax
     * @param avgLengthMin
     * @param avgWeightMax
     * @param avgWeightMin
     * @param batchNumber
     * @param conditionFactorMax
     * @param conditionFactorMin
     * @param containerName
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param sampleDate
     * @param sampleDateAfter
     * @param sampleDateBefore
     * @param sampleSizeMax
     * @param sampleSizeMin
     * @param search A search term.
     * @returns PaginatedGrowthSampleList
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesList(
        assignmentBatch?: number,
        assignmentBatchIn?: Array<number>,
        avgLengthMax?: number,
        avgLengthMin?: number,
        avgWeightMax?: number,
        avgWeightMin?: number,
        batchNumber?: string,
        conditionFactorMax?: number,
        conditionFactorMin?: number,
        containerName?: string,
        ordering?: string,
        page?: number,
        sampleDate?: string,
        sampleDateAfter?: string,
        sampleDateBefore?: string,
        sampleSizeMax?: number,
        sampleSizeMin?: number,
        search?: string,
    ): CancelablePromise<PaginatedGrowthSampleList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/growth-samples/',
            query: {
                'assignment__batch': assignmentBatch,
                'assignment__batch__in': assignmentBatchIn,
                'avg_length_max': avgLengthMax,
                'avg_length_min': avgLengthMin,
                'avg_weight_max': avgWeightMax,
                'avg_weight_min': avgWeightMin,
                'batch_number': batchNumber,
                'condition_factor_max': conditionFactorMax,
                'condition_factor_min': conditionFactorMin,
                'container_name': containerName,
                'ordering': ordering,
                'page': page,
                'sample_date': sampleDate,
                'sample_date_after': sampleDateAfter,
                'sample_date_before': sampleDateBefore,
                'sample_size_max': sampleSizeMax,
                'sample_size_min': sampleSizeMin,
                'search': search,
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
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `assignment__batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param requestBody
     * @returns GrowthSample
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesCreate(
        requestBody: GrowthSample,
    ): CancelablePromise<GrowthSample> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/growth-samples/',
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
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `assignment__batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param id A unique integer value identifying this growth sample.
     * @param requestBody
     * @returns GrowthSample
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesUpdate(
        id: number,
        requestBody: GrowthSample,
    ): CancelablePromise<GrowthSample> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/growth-samples/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `assignment__batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param id A unique integer value identifying this growth sample.
     * @returns GrowthSample
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesRetrieve(
        id: number,
    ): CancelablePromise<GrowthSample> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/growth-samples/{id}/',
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
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `assignment__batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param id A unique integer value identifying this growth sample.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/growth-samples/{id}/',
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
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples. Uses
     * HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `assignment__batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `assignment__batch__batch_number`: Batch number of the associated batch (via the related BatchContainerAssignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param id A unique integer value identifying this growth sample.
     * @param requestBody
     * @returns GrowthSample
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesPartialUpdate(
        id: number,
        requestBody?: PatchedGrowthSample,
    ): CancelablePromise<GrowthSample> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/growth-samples/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List historical records with enhanced OpenAPI documentation.
     * @param batchNumber
     * @param batchType * `STANDARD` - Standard
     * * `MIXED` - Mixed Population
     * @param dateFrom Filter records from this date onwards (inclusive)
     * @param dateTo Filter records up to this date (inclusive)
     * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
     *
     * * `+` - Created
     * * `~` - Updated
     * * `-` - Deleted
     * @param historyUser Filter by username of the user who made the change
     * @param lifecycleStage
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param species
     * @param status * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     * @returns PaginatedBatchHistoryList
     * @throws ApiError
     */
    public static listBatchBatchHistory(
        batchNumber?: string,
        batchType?: 'MIXED' | 'STANDARD',
        dateFrom?: string,
        dateTo?: string,
        historyType?: '+' | '-' | '~',
        historyUser?: string,
        lifecycleStage?: number,
        ordering?: string,
        page?: number,
        search?: string,
        species?: number,
        status?: 'ACTIVE' | 'COMPLETED' | 'TERMINATED',
    ): CancelablePromise<PaginatedBatchHistoryList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/batches/',
            query: {
                'batch_number': batchNumber,
                'batch_type': batchType,
                'date_from': dateFrom,
                'date_to': dateTo,
                'history_type': historyType,
                'history_user': historyUser,
                'lifecycle_stage': lifecycleStage,
                'ordering': ordering,
                'page': page,
                'search': search,
                'species': species,
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
     * ViewSet for Batch historical records.
     * @param historyId A unique integer value identifying this historical batch.
     * @returns BatchHistory
     * @throws ApiError
     */
    public static retrieveBatchBatchHistoryDetail(
        historyId: number,
    ): CancelablePromise<BatchHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/batches/{history_id}/',
            path: {
                'history_id': historyId,
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
     * List historical records with enhanced OpenAPI documentation.
     * @param batch
     * @param container
     * @param dateFrom Filter records from this date onwards (inclusive)
     * @param dateTo Filter records up to this date (inclusive)
     * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
     *
     * * `+` - Created
     * * `~` - Updated
     * * `-` - Deleted
     * @param historyUser Filter by username of the user who made the change
     * @param lifecycleStage
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedBatchContainerAssignmentHistoryList
     * @throws ApiError
     */
    public static listBatchContainerAssignmentHistory(
        batch?: number,
        container?: number,
        dateFrom?: string,
        dateTo?: string,
        historyType?: '+' | '-' | '~',
        historyUser?: string,
        lifecycleStage?: number,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedBatchContainerAssignmentHistoryList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/container-assignments/',
            query: {
                'batch': batch,
                'container': container,
                'date_from': dateFrom,
                'date_to': dateTo,
                'history_type': historyType,
                'history_user': historyUser,
                'lifecycle_stage': lifecycleStage,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for BatchContainerAssignment historical records.
     * @param historyId A unique integer value identifying this historical batch container assignment.
     * @returns BatchContainerAssignmentHistory
     * @throws ApiError
     */
    public static retrieveBatchContainerAssignmentHistoryDetail(
        historyId: number,
    ): CancelablePromise<BatchContainerAssignmentHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/container-assignments/{history_id}/',
            path: {
                'history_id': historyId,
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
     * List historical records with enhanced OpenAPI documentation.
     * @param batch
     * @param cause * `DISEASE` - Disease
     * * `HANDLING` - Handling
     * * `PREDATION` - Predation
     * * `ENVIRONMENTAL` - Environmental
     * * `UNKNOWN` - Unknown
     * * `OTHER` - Other
     * @param dateFrom Filter records from this date onwards (inclusive)
     * @param dateTo Filter records up to this date (inclusive)
     * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
     *
     * * `+` - Created
     * * `~` - Updated
     * * `-` - Deleted
     * @param historyUser Filter by username of the user who made the change
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedMortalityEventHistoryList
     * @throws ApiError
     */
    public static listBatchMortalityEventHistory(
        batch?: number,
        cause?: 'DISEASE' | 'ENVIRONMENTAL' | 'HANDLING' | 'OTHER' | 'PREDATION' | 'UNKNOWN',
        dateFrom?: string,
        dateTo?: string,
        historyType?: '+' | '-' | '~',
        historyUser?: string,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedMortalityEventHistoryList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/mortality-events/',
            query: {
                'batch': batch,
                'cause': cause,
                'date_from': dateFrom,
                'date_to': dateTo,
                'history_type': historyType,
                'history_user': historyUser,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for MortalityEvent historical records.
     * @param historyId A unique integer value identifying this historical mortality event.
     * @returns MortalityEventHistory
     * @throws ApiError
     */
    public static retrieveBatchMortalityEventHistoryDetail(
        historyId: number,
    ): CancelablePromise<MortalityEventHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/mortality-events/{history_id}/',
            path: {
                'history_id': historyId,
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
     * List historical records with enhanced OpenAPI documentation.
     * @param assignmentBatch
     * @param assignmentContainer
     * @param dateFrom Filter records from this date onwards (inclusive)
     * @param dateTo Filter records up to this date (inclusive)
     * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
     *
     * * `+` - Created
     * * `~` - Updated
     * * `-` - Deleted
     * @param historyUser Filter by username of the user who made the change
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedGrowthSampleHistoryList
     * @throws ApiError
     */
    public static listBatchGrowthSampleHistory(
        assignmentBatch?: number,
        assignmentContainer?: number,
        dateFrom?: string,
        dateTo?: string,
        historyType?: '+' | '-' | '~',
        historyUser?: string,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedGrowthSampleHistoryList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/growth-samples/',
            query: {
                'assignment__batch': assignmentBatch,
                'assignment__container': assignmentContainer,
                'date_from': dateFrom,
                'date_to': dateTo,
                'history_type': historyType,
                'history_user': historyUser,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for GrowthSample historical records.
     * @param historyId A unique integer value identifying this historical growth sample.
     * @returns GrowthSampleHistory
     * @throws ApiError
     */
    public static retrieveBatchGrowthSampleHistoryDetail(
        historyId: number,
    ): CancelablePromise<GrowthSampleHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/history/growth-samples/{history_id}/',
            path: {
                'history_id': historyId,
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
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param brand
     * @param isActive
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedFeedList
     * @throws ApiError
     */
    public static apiV1InventoryFeedsList(
        brand?: string,
        isActive?: boolean,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedFeedList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeds/',
            query: {
                'brand': brand,
                'is_active': isActive,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param requestBody
     * @returns Feed
     * @throws ApiError
     */
    public static apiV1InventoryFeedsCreate(
        requestBody: Feed,
    ): CancelablePromise<Feed> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/inventory/feeds/',
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
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this feed.
     * @param requestBody
     * @returns Feed
     * @throws ApiError
     */
    public static apiV1InventoryFeedsUpdate(
        id: number,
        requestBody: Feed,
    ): CancelablePromise<Feed> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/inventory/feeds/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this feed.
     * @returns Feed
     * @throws ApiError
     */
    public static apiV1InventoryFeedsRetrieve(
        id: number,
    ): CancelablePromise<Feed> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeds/{id}/',
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
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this feed.
     * @returns void
     * @throws ApiError
     */
    public static apiV1InventoryFeedsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/inventory/feeds/{id}/',
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
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations. Uses
     * HistoryReasonMixin to capture audit change reasons.
     * @param id A unique integer value identifying this feed.
     * @param requestBody
     * @returns Feed
     * @throws ApiError
     */
    public static apiV1InventoryFeedsPartialUpdate(
        id: number,
        requestBody?: PatchedFeed,
    ): CancelablePromise<Feed> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/inventory/feeds/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param feed
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param purchaseDate
     * @param search A search term.
     * @param supplier
     * @returns PaginatedFeedPurchaseList
     * @throws ApiError
     */
    public static apiV1InventoryFeedPurchasesList(
        feed?: number,
        ordering?: string,
        page?: number,
        purchaseDate?: string,
        search?: string,
        supplier?: string,
    ): CancelablePromise<PaginatedFeedPurchaseList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feed-purchases/',
            query: {
                'feed': feed,
                'ordering': ordering,
                'page': page,
                'purchase_date': purchaseDate,
                'search': search,
                'supplier': supplier,
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
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param requestBody
     * @returns FeedPurchase
     * @throws ApiError
     */
    public static apiV1InventoryFeedPurchasesCreate(
        requestBody: FeedPurchase,
    ): CancelablePromise<FeedPurchase> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/inventory/feed-purchases/',
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
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this feed purchase.
     * @param requestBody
     * @returns FeedPurchase
     * @throws ApiError
     */
    public static apiV1InventoryFeedPurchasesUpdate(
        id: number,
        requestBody: FeedPurchase,
    ): CancelablePromise<FeedPurchase> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/inventory/feed-purchases/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this feed purchase.
     * @returns FeedPurchase
     * @throws ApiError
     */
    public static apiV1InventoryFeedPurchasesRetrieve(
        id: number,
    ): CancelablePromise<FeedPurchase> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feed-purchases/{id}/',
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
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this feed purchase.
     * @returns void
     * @throws ApiError
     */
    public static apiV1InventoryFeedPurchasesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/inventory/feed-purchases/{id}/',
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
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records. Uses HistoryReasonMixin
     * to capture audit change reasons.
     * @param id A unique integer value identifying this feed purchase.
     * @param requestBody
     * @returns FeedPurchase
     * @throws ApiError
     */
    public static apiV1InventoryFeedPurchasesPartialUpdate(
        id: number,
        requestBody?: PatchedFeedPurchase,
    ): CancelablePromise<FeedPurchase> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/inventory/feed-purchases/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Feeding Events in aquaculture operations.
     *
     * Feeding events record the amount of feed given to batches in specific containers
     * on particular dates. This endpoint provides full CRUD operations for feeding events
     * and uses HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch being fed.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `feed`: ID of the feed type used.
     * - `feed__in`: Filter by multiple Feed IDs (comma-separated).
     * - `container`: ID of the container where feeding occurred.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `feeding_date`: Exact date of feeding.
     * - `method`: Feeding method (e.g., 'MANUAL', 'AUTOMATIC').
     *
     * **Searching:**
     * - `notes`: Notes associated with the feeding event.
     *
     * **Ordering:**
     * - `feeding_date` (default: descending)
     * - `feeding_time`
     * - `amount_kg`
     * @param amountMax Maximum feed amount in kg
     * @param amountMin Minimum feed amount in kg
     * @param area Filter by area ID (via container → area)
     * @param areaIn Filter by multiple area IDs (comma-separated)
     * @param batch
     * @param batchIn Multiple values may be separated by commas.
     * @param batchNumber
     * @param container
     * @param containerIn Multiple values may be separated by commas.
     * @param containerName
     * @param feed
     * @param feedBrand Filter by exact feed brand (case-insensitive)
     * @param feedBrandIcontains Filter by partial brand name (case-insensitive)
     * @param feedBrandIn Filter by multiple brands (comma-separated)
     * @param feedCarbohydratePercentageGte Minimum carbohydrate percentage (0-100)
     * @param feedCarbohydratePercentageLte Maximum carbohydrate percentage (0-100)
     * @param feedFatPercentageGte Minimum fat percentage (0-100)
     * @param feedFatPercentageLte Maximum fat percentage (0-100)
     * @param feedIn Multiple values may be separated by commas.
     * @param feedProteinPercentageGte Minimum protein percentage (0-100)
     * @param feedProteinPercentageLte Maximum protein percentage (0-100)
     * @param feedSizeCategory Filter by feed size category
     *
     * * `MICRO` - Micro
     * * `SMALL` - Small
     * * `MEDIUM` - Medium
     * * `LARGE` - Large
     * @param feedSizeCategoryIn Filter by multiple size categories
     *
     * * `MICRO` - Micro
     * * `SMALL` - Small
     * * `MEDIUM` - Medium
     * * `LARGE` - Large
     * @param feedCostGte Minimum feed cost for the event
     * @param feedCostLte Maximum feed cost for the event
     * @param feedName
     * @param feedingDate
     * @param feedingDateAfter Filter feeding events on or after this date (YYYY-MM-DD)
     * @param feedingDateBefore Filter feeding events on or before this date (YYYY-MM-DD)
     * @param freshwaterStation Filter by freshwater station ID (via container → hall → station)
     * @param freshwaterStationIn Filter by multiple freshwater station IDs (comma-separated)
     * @param geography Filter by geography ID (via container → area → geography)
     * @param geographyIn Filter by multiple geography IDs (comma-separated)
     * @param hall Filter by hall ID (via container → hall)
     * @param hallIn Filter by multiple hall IDs (comma-separated)
     * @param method * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     * @param methodIn * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedFeedingEventList
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsList(
        amountMax?: number,
        amountMin?: number,
        area?: number,
        areaIn?: Array<number>,
        batch?: number,
        batchIn?: Array<number>,
        batchNumber?: string,
        container?: number,
        containerIn?: Array<number>,
        containerName?: string,
        feed?: number,
        feedBrand?: string,
        feedBrandIcontains?: string,
        feedBrandIn?: Array<string>,
        feedCarbohydratePercentageGte?: number,
        feedCarbohydratePercentageLte?: number,
        feedFatPercentageGte?: number,
        feedFatPercentageLte?: number,
        feedIn?: Array<number>,
        feedProteinPercentageGte?: number,
        feedProteinPercentageLte?: number,
        feedSizeCategory?: 'LARGE' | 'MEDIUM' | 'MICRO' | 'SMALL',
        feedSizeCategoryIn?: Array<'LARGE' | 'MEDIUM' | 'MICRO' | 'SMALL'>,
        feedCostGte?: number,
        feedCostLte?: number,
        feedName?: string,
        feedingDate?: string,
        feedingDateAfter?: string,
        feedingDateBefore?: string,
        freshwaterStation?: number,
        freshwaterStationIn?: Array<number>,
        geography?: number,
        geographyIn?: Array<number>,
        hall?: number,
        hallIn?: Array<number>,
        method?: 'AUTOMATIC' | 'BROADCAST' | 'MANUAL',
        methodIn?: Array<'AUTOMATIC' | 'BROADCAST' | 'MANUAL'>,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedFeedingEventList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/',
            query: {
                'amount_max': amountMax,
                'amount_min': amountMin,
                'area': area,
                'area__in': areaIn,
                'batch': batch,
                'batch__in': batchIn,
                'batch_number': batchNumber,
                'container': container,
                'container__in': containerIn,
                'container_name': containerName,
                'feed': feed,
                'feed__brand': feedBrand,
                'feed__brand__icontains': feedBrandIcontains,
                'feed__brand__in': feedBrandIn,
                'feed__carbohydrate_percentage__gte': feedCarbohydratePercentageGte,
                'feed__carbohydrate_percentage__lte': feedCarbohydratePercentageLte,
                'feed__fat_percentage__gte': feedFatPercentageGte,
                'feed__fat_percentage__lte': feedFatPercentageLte,
                'feed__in': feedIn,
                'feed__protein_percentage__gte': feedProteinPercentageGte,
                'feed__protein_percentage__lte': feedProteinPercentageLte,
                'feed__size_category': feedSizeCategory,
                'feed__size_category__in': feedSizeCategoryIn,
                'feed_cost__gte': feedCostGte,
                'feed_cost__lte': feedCostLte,
                'feed_name': feedName,
                'feeding_date': feedingDate,
                'feeding_date_after': feedingDateAfter,
                'feeding_date_before': feedingDateBefore,
                'freshwater_station': freshwaterStation,
                'freshwater_station__in': freshwaterStationIn,
                'geography': geography,
                'geography__in': geographyIn,
                'hall': hall,
                'hall__in': hallIn,
                'method': method,
                'method_in': methodIn,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * API endpoint for managing Feeding Events in aquaculture operations.
     *
     * Feeding events record the amount of feed given to batches in specific containers
     * on particular dates. This endpoint provides full CRUD operations for feeding events
     * and uses HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch being fed.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `feed`: ID of the feed type used.
     * - `feed__in`: Filter by multiple Feed IDs (comma-separated).
     * - `container`: ID of the container where feeding occurred.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `feeding_date`: Exact date of feeding.
     * - `method`: Feeding method (e.g., 'MANUAL', 'AUTOMATIC').
     *
     * **Searching:**
     * - `notes`: Notes associated with the feeding event.
     *
     * **Ordering:**
     * - `feeding_date` (default: descending)
     * - `feeding_time`
     * - `amount_kg`
     * @param requestBody
     * @returns FeedingEvent
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsCreate(
        requestBody: FeedingEvent,
    ): CancelablePromise<FeedingEvent> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/inventory/feeding-events/',
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
     * Get feeding events for a specific batch.
     * @param batchId ID of the batch to fetch feeding events for.
     * @param amountMax Maximum feed amount in kg
     * @param amountMin Minimum feed amount in kg
     * @param area Filter by area ID (via container → area)
     * @param areaIn Filter by multiple area IDs (comma-separated)
     * @param batch
     * @param batchIn Multiple values may be separated by commas.
     * @param batchNumber
     * @param container
     * @param containerIn Multiple values may be separated by commas.
     * @param containerName
     * @param feed
     * @param feedBrand Filter by exact feed brand (case-insensitive)
     * @param feedBrandIcontains Filter by partial brand name (case-insensitive)
     * @param feedBrandIn Filter by multiple brands (comma-separated)
     * @param feedCarbohydratePercentageGte Minimum carbohydrate percentage (0-100)
     * @param feedCarbohydratePercentageLte Maximum carbohydrate percentage (0-100)
     * @param feedFatPercentageGte Minimum fat percentage (0-100)
     * @param feedFatPercentageLte Maximum fat percentage (0-100)
     * @param feedIn Multiple values may be separated by commas.
     * @param feedProteinPercentageGte Minimum protein percentage (0-100)
     * @param feedProteinPercentageLte Maximum protein percentage (0-100)
     * @param feedSizeCategory Filter by feed size category
     *
     * * `MICRO` - Micro
     * * `SMALL` - Small
     * * `MEDIUM` - Medium
     * * `LARGE` - Large
     * @param feedSizeCategoryIn Filter by multiple size categories
     *
     * * `MICRO` - Micro
     * * `SMALL` - Small
     * * `MEDIUM` - Medium
     * * `LARGE` - Large
     * @param feedCostGte Minimum feed cost for the event
     * @param feedCostLte Maximum feed cost for the event
     * @param feedName
     * @param feedingDate
     * @param feedingDateAfter Filter feeding events on or after this date (YYYY-MM-DD)
     * @param feedingDateBefore Filter feeding events on or before this date (YYYY-MM-DD)
     * @param freshwaterStation Filter by freshwater station ID (via container → hall → station)
     * @param freshwaterStationIn Filter by multiple freshwater station IDs (comma-separated)
     * @param geography Filter by geography ID (via container → area → geography)
     * @param geographyIn Filter by multiple geography IDs (comma-separated)
     * @param hall Filter by hall ID (via container → hall)
     * @param hallIn Filter by multiple hall IDs (comma-separated)
     * @param method * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     * @param methodIn * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedFeedingEventList
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsByBatchList(
        batchId: number,
        amountMax?: number,
        amountMin?: number,
        area?: number,
        areaIn?: Array<number>,
        batch?: number,
        batchIn?: Array<number>,
        batchNumber?: string,
        container?: number,
        containerIn?: Array<number>,
        containerName?: string,
        feed?: number,
        feedBrand?: string,
        feedBrandIcontains?: string,
        feedBrandIn?: Array<string>,
        feedCarbohydratePercentageGte?: number,
        feedCarbohydratePercentageLte?: number,
        feedFatPercentageGte?: number,
        feedFatPercentageLte?: number,
        feedIn?: Array<number>,
        feedProteinPercentageGte?: number,
        feedProteinPercentageLte?: number,
        feedSizeCategory?: 'LARGE' | 'MEDIUM' | 'MICRO' | 'SMALL',
        feedSizeCategoryIn?: Array<'LARGE' | 'MEDIUM' | 'MICRO' | 'SMALL'>,
        feedCostGte?: number,
        feedCostLte?: number,
        feedName?: string,
        feedingDate?: string,
        feedingDateAfter?: string,
        feedingDateBefore?: string,
        freshwaterStation?: number,
        freshwaterStationIn?: Array<number>,
        geography?: number,
        geographyIn?: Array<number>,
        hall?: number,
        hallIn?: Array<number>,
        method?: 'AUTOMATIC' | 'BROADCAST' | 'MANUAL',
        methodIn?: Array<'AUTOMATIC' | 'BROADCAST' | 'MANUAL'>,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<Array<PaginatedFeedingEventList>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/by_batch/',
            query: {
                'amount_max': amountMax,
                'amount_min': amountMin,
                'area': area,
                'area__in': areaIn,
                'batch': batch,
                'batch__in': batchIn,
                'batch_id': batchId,
                'batch_number': batchNumber,
                'container': container,
                'container__in': containerIn,
                'container_name': containerName,
                'feed': feed,
                'feed__brand': feedBrand,
                'feed__brand__icontains': feedBrandIcontains,
                'feed__brand__in': feedBrandIn,
                'feed__carbohydrate_percentage__gte': feedCarbohydratePercentageGte,
                'feed__carbohydrate_percentage__lte': feedCarbohydratePercentageLte,
                'feed__fat_percentage__gte': feedFatPercentageGte,
                'feed__fat_percentage__lte': feedFatPercentageLte,
                'feed__in': feedIn,
                'feed__protein_percentage__gte': feedProteinPercentageGte,
                'feed__protein_percentage__lte': feedProteinPercentageLte,
                'feed__size_category': feedSizeCategory,
                'feed__size_category__in': feedSizeCategoryIn,
                'feed_cost__gte': feedCostGte,
                'feed_cost__lte': feedCostLte,
                'feed_name': feedName,
                'feeding_date': feedingDate,
                'feeding_date_after': feedingDateAfter,
                'feeding_date_before': feedingDateBefore,
                'freshwater_station': freshwaterStation,
                'freshwater_station__in': freshwaterStationIn,
                'geography': geography,
                'geography__in': geographyIn,
                'hall': hall,
                'hall__in': hallIn,
                'method': method,
                'method_in': methodIn,
                'ordering': ordering,
                'page': page,
                'search': search,
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
     * Comprehensive finance report with flexible filtering and aggregations
     *
     * Provides detailed feed usage and cost analysis with multi-dimensional filtering.
     *
     * Supports filtering by:
     * - Time periods (date ranges via feeding_date_after/before)
     * - Geography (geography, area, freshwater_station, hall, container)
     * - Feed properties (protein %, fat %, carb %, brand, size category)
     * - Cost ranges (feed_cost)
     * - Feed types (feed, feed__in)
     *
     * Returns aggregated totals and optional breakdowns by selected dimensions.
     * All filters from FeedingEventFilter are supported.
     *
     * @param endDate End date for report period (YYYY-MM-DD) - REQUIRED
     * @param startDate Start date for report period (YYYY-MM-DD) - REQUIRED
     * @param area Filter by area ID
     * @param areaIn Filter by multiple area IDs (comma-separated)
     * @param feed Filter by feed type ID
     * @param feedBrand Filter by exact brand name (case-insensitive)
     * @param feedBrandIcontains Filter by partial brand name (case-insensitive)
     * @param feedFatPercentageGte Minimum fat percentage (0-100)
     * @param feedFatPercentageLte Maximum fat percentage (0-100)
     * @param feedIn Filter by multiple feed type IDs (comma-separated)
     * @param feedProteinPercentageGte Minimum protein percentage (0-100)
     * @param feedProteinPercentageLte Maximum protein percentage (0-100)
     * @param feedSizeCategory Filter by size category (MICRO, SMALL, MEDIUM, LARGE)
     * @param feedCostGte Minimum feed cost per event
     * @param feedCostLte Maximum feed cost per event
     * @param freshwaterStation Filter by freshwater station ID
     * @param geography Filter by geography ID (e.g., 1=Scotland, 2=Faroe Islands)
     * @param geographyIn Filter by multiple geography IDs (comma-separated)
     * @param groupBy Primary grouping for time series: 'day', 'week', or 'month'
     * @param includeBreakdowns Include dimensional breakdowns (default: true)
     * @param includeTimeSeries Include time series data (default: false)
     * @returns any
     * @throws ApiError
     */
    public static feedingEventsFinanceReport(
        endDate: string,
        startDate: string,
        area?: number,
        areaIn?: Array<number>,
        feed?: number,
        feedBrand?: string,
        feedBrandIcontains?: string,
        feedFatPercentageGte?: number,
        feedFatPercentageLte?: number,
        feedIn?: Array<number>,
        feedProteinPercentageGte?: number,
        feedProteinPercentageLte?: number,
        feedSizeCategory?: string,
        feedCostGte?: number,
        feedCostLte?: number,
        freshwaterStation?: number,
        geography?: number,
        geographyIn?: Array<number>,
        groupBy?: string,
        includeBreakdowns?: boolean,
        includeTimeSeries?: boolean,
    ): CancelablePromise<{
        summary?: {
            total_feed_kg?: number;
            total_feed_cost?: number;
            events_count?: number;
            date_range?: {
                start?: string;
                end?: string;
            };
        };
        by_feed_type?: Array<{
            feed_id?: number;
            feed_name?: string;
            brand?: string;
            protein_percentage?: number;
            fat_percentage?: number;
            total_kg?: number;
            total_cost?: number;
            events_count?: number;
        }>;
        by_geography?: any[];
        by_area?: any[];
        by_container?: any[];
        time_series?: any[];
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/finance_report/',
            query: {
                'area': area,
                'area__in': areaIn,
                'end_date': endDate,
                'feed': feed,
                'feed__brand': feedBrand,
                'feed__brand__icontains': feedBrandIcontains,
                'feed__fat_percentage__gte': feedFatPercentageGte,
                'feed__fat_percentage__lte': feedFatPercentageLte,
                'feed__in': feedIn,
                'feed__protein_percentage__gte': feedProteinPercentageGte,
                'feed__protein_percentage__lte': feedProteinPercentageLte,
                'feed__size_category': feedSizeCategory,
                'feed_cost__gte': feedCostGte,
                'feed_cost__lte': feedCostLte,
                'freshwater_station': freshwaterStation,
                'geography': geography,
                'geography__in': geographyIn,
                'group_by': groupBy,
                'include_breakdowns': includeBreakdowns,
                'include_time_series': includeTimeSeries,
                'start_date': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get aggregated feeding events summary with date filtering
     * Returns aggregated statistics for feeding events with support for both single date and date range filtering.
     * @param batch Filter by batch ID.
     * @param container Filter by container ID.
     * @param date Single date to filter feeding events (YYYY-MM-DD) or 'today' (default).
     * @param endDate End date for range filtering (YYYY-MM-DD). Must be provided with start_date.
     * @param startDate Start date for range filtering (YYYY-MM-DD). Must be provided with end_date.
     * @returns any
     * @throws ApiError
     */
    public static feedingEventsSummary(
        batch?: number,
        container?: number,
        date?: string,
        endDate?: string,
        startDate?: string,
    ): CancelablePromise<{
        /**
         * Number of feeding events
         */
        events_count: number;
        /**
         * Total feed amount in kg
         */
        total_feed_kg: number;
        /**
         * Total feed cost
         */
        total_feed_cost: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/summary/',
            query: {
                'batch': batch,
                'container': container,
                'date': date,
                'end_date': endDate,
                'start_date': startDate,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Feeding Events in aquaculture operations.
     *
     * Feeding events record the amount of feed given to batches in specific containers
     * on particular dates. This endpoint provides full CRUD operations for feeding events
     * and uses HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch being fed.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `feed`: ID of the feed type used.
     * - `feed__in`: Filter by multiple Feed IDs (comma-separated).
     * - `container`: ID of the container where feeding occurred.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `feeding_date`: Exact date of feeding.
     * - `method`: Feeding method (e.g., 'MANUAL', 'AUTOMATIC').
     *
     * **Searching:**
     * - `notes`: Notes associated with the feeding event.
     *
     * **Ordering:**
     * - `feeding_date` (default: descending)
     * - `feeding_time`
     * - `amount_kg`
     * @param id A unique integer value identifying this feeding event.
     * @param requestBody
     * @returns FeedingEvent
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsUpdate(
        id: number,
        requestBody: FeedingEvent,
    ): CancelablePromise<FeedingEvent> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/inventory/feeding-events/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * API endpoint for managing Feeding Events in aquaculture operations.
     *
     * Feeding events record the amount of feed given to batches in specific containers
     * on particular dates. This endpoint provides full CRUD operations for feeding events
     * and uses HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch being fed.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `feed`: ID of the feed type used.
     * - `feed__in`: Filter by multiple Feed IDs (comma-separated).
     * - `container`: ID of the container where feeding occurred.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `feeding_date`: Exact date of feeding.
     * - `method`: Feeding method (e.g., 'MANUAL', 'AUTOMATIC').
     *
     * **Searching:**
     * - `notes`: Notes associated with the feeding event.
     *
     * **Ordering:**
     * - `feeding_date` (default: descending)
     * - `feeding_time`
     * - `amount_kg`
     * @param id A unique integer value identifying this feeding event.
     * @returns FeedingEvent
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsRetrieve(
        id: number,
    ): CancelablePromise<FeedingEvent> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/{id}/',
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
     * API endpoint for managing Feeding Events in aquaculture operations.
     *
     * Feeding events record the amount of feed given to batches in specific containers
     * on particular dates. This endpoint provides full CRUD operations for feeding events
     * and uses HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch being fed.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `feed`: ID of the feed type used.
     * - `feed__in`: Filter by multiple Feed IDs (comma-separated).
     * - `container`: ID of the container where feeding occurred.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `feeding_date`: Exact date of feeding.
     * - `method`: Feeding method (e.g., 'MANUAL', 'AUTOMATIC').
     *
     * **Searching:**
     * - `notes`: Notes associated with the feeding event.
     *
     * **Ordering:**
     * - `feeding_date` (default: descending)
     * - `feeding_time`
     * - `amount_kg`
     * @param id A unique integer value identifying this feeding event.
     * @returns void
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/inventory/feeding-events/{id}/',
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
     * API endpoint for managing Feeding Events in aquaculture operations.
     *
     * Feeding events record the amount of feed given to batches in specific containers
     * on particular dates. This endpoint provides full CRUD operations for feeding events
     * and uses HistoryReasonMixin to capture audit change reasons.
     *
     * **Filtering:**
     * - `batch`: ID of the batch being fed.
     * - `batch__in`: Filter by multiple Batch IDs (comma-separated).
     * - `feed`: ID of the feed type used.
     * - `feed__in`: Filter by multiple Feed IDs (comma-separated).
     * - `container`: ID of the container where feeding occurred.
     * - `container__in`: Filter by multiple Container IDs (comma-separated).
     * - `feeding_date`: Exact date of feeding.
     * - `method`: Feeding method (e.g., 'MANUAL', 'AUTOMATIC').
     *
     * **Searching:**
     * - `notes`: Notes associated with the feeding event.
     *
     * **Ordering:**
     * - `feeding_date` (default: descending)
     * - `feeding_time`
     * - `amount_kg`
     * @param id A unique integer value identifying this feeding event.
     * @param requestBody
     * @returns FeedingEvent
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsPartialUpdate(
        id: number,
        requestBody?: PatchedFeedingEvent,
    ): CancelablePromise<FeedingEvent> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/inventory/feeding-events/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request (validation error)`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * ViewSet for BatchFeedingSummary model.
     *
     * Provides read operations for batch feeding summaries with generation
     * capabilities.
     * @param batch
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param periodEnd
     * @param periodStart
     * @returns PaginatedBatchFeedingSummaryList
     * @throws ApiError
     */
    public static apiV1InventoryBatchFeedingSummariesList(
        batch?: number,
        ordering?: string,
        page?: number,
        periodEnd?: string,
        periodStart?: string,
    ): CancelablePromise<PaginatedBatchFeedingSummaryList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/batch-feeding-summaries/',
            query: {
                'batch': batch,
                'ordering': ordering,
                'page': page,
                'period_end': periodEnd,
                'period_start': periodStart,
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
     * Get feeding summaries for a specific batch.
     * @param batchId ID of the batch to retrieve feeding summaries for.
     * @returns BatchFeedingSummary
     * @throws ApiError
     */
    public static apiV1InventoryBatchFeedingSummariesByBatchRetrieve(
        batchId: number,
    ): CancelablePromise<Array<BatchFeedingSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/batch-feeding-summaries/by_batch/',
            query: {
                'batch_id': batchId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Generate a feeding summary for a batch over a specified period.
     * @param requestBody
     * @returns BatchFeedingSummary
     * @throws ApiError
     */
    public static apiV1InventoryBatchFeedingSummariesGenerateCreate(
        requestBody: BatchFeedingSummary,
    ): CancelablePromise<BatchFeedingSummary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/inventory/batch-feeding-summaries/generate/',
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
     * ViewSet for BatchFeedingSummary model.
     *
     * Provides read operations for batch feeding summaries with generation
     * capabilities.
     * @param id A unique integer value identifying this batch feeding summary.
     * @returns BatchFeedingSummary
     * @throws ApiError
     */
    public static apiV1InventoryBatchFeedingSummariesRetrieve(
        id: number,
    ): CancelablePromise<BatchFeedingSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/batch-feeding-summaries/{id}/',
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
     * API endpoint for managing Feed Container Stock.
     *
     * Provides CRUD operations for feed container stock entries,
     * supporting FIFO inventory tracking. Uses HistoryReasonMixin to capture
     * audit change reasons.
     * @param entryDate
     * @param entryDateGte
     * @param entryDateLte
     * @param feedContainer
     * @param feedPurchase
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param quantityKg
     * @param quantityKgGte
     * @param quantityKgLte
     * @param search A search term.
     * @returns PaginatedFeedContainerStockList
     * @throws ApiError
     */
    public static apiV1InventoryFeedContainerStockList(
        entryDate?: string,
        entryDateGte?: string,
        entryDateLte?: string,
        feedContainer?: number,
        feedPurchase?: number,
        ordering?: string,
        page?: number,
        quantityKg?: number,
        quantityKgGte?: number,
        quantityKgLte?: number,
        search?: string,
    ): CancelablePromise<PaginatedFeedContainerStockList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feed-container-stock/',
            query: {
                'entry_date': entryDate,
                'entry_date__gte': entryDateGte,
                'entry_date__lte': entryDateLte,
                'feed_container': feedContainer,
                'feed_purchase': feedPurchase,
                'ordering': ordering,
                'page': page,
                'quantity_kg': quantityKg,
                'quantity_kg__gte': quantityKgGte,
                'quantity_kg__lte': quantityKgLte,
                'search': search,
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
     * API endpoint for managing Feed Container Stock.
     *
     * Provides CRUD operations for feed container stock entries,
     * supporting FIFO inventory tracking. Uses HistoryReasonMixin to capture
     * audit change reasons.
     * @param requestBody
     * @returns FeedContainerStockCreate
     * @throws ApiError
     */
    public static apiV1InventoryFeedContainerStockCreate(
        requestBody: FeedContainerStockCreate,
    ): CancelablePromise<FeedContainerStockCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/inventory/feed-container-stock/',
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
     * Add feed batch to container using FIFO service.
     *
     * Expected payload:
     * {
         * "feed_container_id": 1,
         * "feed_purchase_id": 2,
         * "quantity_kg": "100.00"
         * }
         * @param requestBody
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockAddToContainerCreate(
            requestBody: FeedContainerStock,
        ): CancelablePromise<FeedContainerStock> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/inventory/feed-container-stock/add_to_container/',
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
         * Get feed container stock grouped by container.
         *
         * Query parameters:
         * - container_id: Filter by specific container
         * @param containerId Limit results to a specific feed container.
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockByContainerRetrieve(
            containerId?: number,
        ): CancelablePromise<Array<FeedContainerStock>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/feed-container-stock/by_container/',
                query: {
                    'container_id': containerId,
                },
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Get feed container stock in FIFO order for a specific container.
         *
         * Query parameters:
         * - container_id: Required. Container to get FIFO order for.
         * @param containerId ID of the feed container to fetch FIFO ordered stock for.
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockFifoOrderRetrieve(
            containerId: number,
        ): CancelablePromise<Array<FeedContainerStock>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/feed-container-stock/fifo_order/',
                query: {
                    'container_id': containerId,
                },
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Get comprehensive stock summary with aggregations.
         *
         * Provides:
         * - Total quantity and value across all stock
         * - Breakdown by feed type
         * - Breakdown by container
         *
         * Query parameters:
         * - feed_container_id: Filter by specific container
         * - feed_type_id: Filter by specific feed type
         * @param feedContainerId Filter by specific feed container ID
         * @param feedTypeId Filter by specific feed type ID
         * @returns any
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockSummaryRetrieve(
            feedContainerId?: number,
            feedTypeId?: number,
        ): CancelablePromise<{
            /**
             * Total feed quantity in kg
             */
            total_quantity_kg?: number;
            /**
             * Total value of feed stock
             */
            total_value?: number;
            /**
             * Number of different feed types in stock
             */
            unique_feed_types?: number;
            /**
             * Number of containers with stock
             */
            unique_containers?: number;
            by_feed_type?: Array<{
                feed_id?: number;
                feed_name?: string;
                total_quantity_kg?: number;
                total_value?: number;
                container_count?: number;
            }>;
            by_container?: Array<{
                container_id?: number;
                container_name?: string;
                total_quantity_kg?: number;
                total_value?: number;
                feed_type_count?: number;
            }>;
        }> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/feed-container-stock/summary/',
                query: {
                    'feed_container_id': feedContainerId,
                    'feed_type_id': feedTypeId,
                },
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking. Uses HistoryReasonMixin to capture
         * audit change reasons.
         * @param id A unique integer value identifying this Feed Container Stock.
         * @param requestBody
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockUpdate(
            id: number,
            requestBody: FeedContainerStock,
        ): CancelablePromise<FeedContainerStock> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/inventory/feed-container-stock/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking. Uses HistoryReasonMixin to capture
         * audit change reasons.
         * @param id A unique integer value identifying this Feed Container Stock.
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockRetrieve(
            id: number,
        ): CancelablePromise<FeedContainerStock> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/feed-container-stock/{id}/',
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
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking. Uses HistoryReasonMixin to capture
         * audit change reasons.
         * @param id A unique integer value identifying this Feed Container Stock.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/inventory/feed-container-stock/{id}/',
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
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking. Uses HistoryReasonMixin to capture
         * audit change reasons.
         * @param id A unique integer value identifying this Feed Container Stock.
         * @param requestBody
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockPartialUpdate(
            id: number,
            requestBody?: PatchedFeedContainerStock,
        ): CancelablePromise<FeedContainerStock> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/inventory/feed-container-stock/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * List historical records with enhanced OpenAPI documentation.
         * @param batch
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param feed
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param method * `MANUAL` - Manual
         * * `AUTOMATIC` - Automatic Feeder
         * * `BROADCAST` - Broadcast
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedFeedingEventHistoryList
         * @throws ApiError
         */
        public static listInventoryFeedingEventHistory(
            batch?: number,
            dateFrom?: string,
            dateTo?: string,
            feed?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            method?: 'AUTOMATIC' | 'BROADCAST' | 'MANUAL',
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedFeedingEventHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/history/feeding-events/',
                query: {
                    'batch': batch,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'feed': feed,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'method': method,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for FeedingEvent historical records.
         * @param historyId A unique integer value identifying this historical feeding event.
         * @returns FeedingEventHistory
         * @throws ApiError
         */
        public static retrieveInventoryFeedingEventHistoryDetail(
            historyId: number,
        ): CancelablePromise<FeedingEventHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/history/feeding-events/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param batchId
         * @param category * `observation` - Observation
         * * `issue` - Issue
         * * `action` - Action
         * * `diagnosis` - Diagnosis
         * * `treatment` - Treatment
         * * `vaccination` - Vaccination
         * * `sample` - Sample
         * @param containerId
         * @param entryDate
         * @param entryDateGte
         * @param entryDateLte
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param userId
         * @returns PaginatedJournalEntryList
         * @throws ApiError
         */
        public static apiV1HealthJournalEntriesList(
            batchId?: number,
            category?: 'action' | 'diagnosis' | 'issue' | 'observation' | 'sample' | 'treatment' | 'vaccination',
            containerId?: number,
            entryDate?: string,
            entryDateGte?: string,
            entryDateLte?: string,
            page?: number,
            search?: string,
            userId?: number,
        ): CancelablePromise<PaginatedJournalEntryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/journal-entries/',
                query: {
                    'batch__id': batchId,
                    'category': category,
                    'container__id': containerId,
                    'entry_date': entryDate,
                    'entry_date__gte': entryDateGte,
                    'entry_date__lte': entryDateLte,
                    'page': page,
                    'search': search,
                    'user__id': userId,
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
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns JournalEntry
         * @throws ApiError
         */
        public static apiV1HealthJournalEntriesCreate(
            requestBody: JournalEntry,
        ): CancelablePromise<JournalEntry> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/journal-entries/',
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
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this journal entry.
         * @param requestBody
         * @returns JournalEntry
         * @throws ApiError
         */
        public static apiV1HealthJournalEntriesUpdate(
            id: number,
            requestBody: JournalEntry,
        ): CancelablePromise<JournalEntry> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/journal-entries/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this journal entry.
         * @returns JournalEntry
         * @throws ApiError
         */
        public static apiV1HealthJournalEntriesRetrieve(
            id: number,
        ): CancelablePromise<JournalEntry> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/journal-entries/{id}/',
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
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this journal entry.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthJournalEntriesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/journal-entries/{id}/',
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
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this journal entry.
         * @param requestBody
         * @returns JournalEntry
         * @throws ApiError
         */
        public static apiV1HealthJournalEntriesPartialUpdate(
            id: number,
            requestBody?: PatchedJournalEntry,
        ): CancelablePromise<JournalEntry> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/journal-entries/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in
         * mortality records.
         *
         * Uses HistoryReasonMixin to automatically capture change
         * reasons for audit trails.
         * @param name
         * @param nameIcontains
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedMortalityReasonList
         * @throws ApiError
         */
        public static apiV1HealthMortalityReasonsList(
            name?: string,
            nameIcontains?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedMortalityReasonList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/mortality-reasons/',
                query: {
                    'name': name,
                    'name__icontains': nameIcontains,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in
         * mortality records.
         *
         * Uses HistoryReasonMixin to automatically capture change
         * reasons for audit trails.
         * @param requestBody
         * @returns MortalityReason
         * @throws ApiError
         */
        public static apiV1HealthMortalityReasonsCreate(
            requestBody: MortalityReason,
        ): CancelablePromise<MortalityReason> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/mortality-reasons/',
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
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in
         * mortality records.
         *
         * Uses HistoryReasonMixin to automatically capture change
         * reasons for audit trails.
         * @param id A unique integer value identifying this mortality reason.
         * @param requestBody
         * @returns MortalityReason
         * @throws ApiError
         */
        public static apiV1HealthMortalityReasonsUpdate(
            id: number,
            requestBody: MortalityReason,
        ): CancelablePromise<MortalityReason> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/mortality-reasons/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in
         * mortality records.
         *
         * Uses HistoryReasonMixin to automatically capture change
         * reasons for audit trails.
         * @param id A unique integer value identifying this mortality reason.
         * @returns MortalityReason
         * @throws ApiError
         */
        public static apiV1HealthMortalityReasonsRetrieve(
            id: number,
        ): CancelablePromise<MortalityReason> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/mortality-reasons/{id}/',
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
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in
         * mortality records.
         *
         * Uses HistoryReasonMixin to automatically capture change
         * reasons for audit trails.
         * @param id A unique integer value identifying this mortality reason.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthMortalityReasonsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/mortality-reasons/{id}/',
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
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in
         * mortality records.
         *
         * Uses HistoryReasonMixin to automatically capture change
         * reasons for audit trails.
         * @param id A unique integer value identifying this mortality reason.
         * @param requestBody
         * @returns MortalityReason
         * @throws ApiError
         */
        public static apiV1HealthMortalityReasonsPartialUpdate(
            id: number,
            requestBody?: PatchedMortalityReason,
        ): CancelablePromise<MortalityReason> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/mortality-reasons/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track
         * fish deaths and their causes.
         *
         * Note: UserAssignmentMixin removed as MortalityRecord has
         * no user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param batch
         * @param container
         * @param count
         * @param countGte
         * @param countLte
         * @param eventDate
         * @param eventDateGte
         * @param eventDateLte
         * @param page A page number within the paginated result set.
         * @param reason
         * @param search A search term.
         * @returns PaginatedMortalityRecordList
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsList(
            batch?: number,
            container?: number,
            count?: number,
            countGte?: number,
            countLte?: number,
            eventDate?: string,
            eventDateGte?: string,
            eventDateLte?: string,
            page?: number,
            reason?: number,
            search?: string,
        ): CancelablePromise<PaginatedMortalityRecordList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/mortality-records/',
                query: {
                    'batch': batch,
                    'container': container,
                    'count': count,
                    'count__gte': countGte,
                    'count__lte': countLte,
                    'event_date': eventDate,
                    'event_date__gte': eventDateGte,
                    'event_date__lte': eventDateLte,
                    'page': page,
                    'reason': reason,
                    'search': search,
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
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track
         * fish deaths and their causes.
         *
         * Note: UserAssignmentMixin removed as MortalityRecord has
         * no user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param requestBody
         * @returns MortalityRecord
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsCreate(
            requestBody: MortalityRecord,
        ): CancelablePromise<MortalityRecord> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/mortality-records/',
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
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track
         * fish deaths and their causes.
         *
         * Note: UserAssignmentMixin removed as MortalityRecord has
         * no user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this mortality record.
         * @param requestBody
         * @returns MortalityRecord
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsUpdate(
            id: number,
            requestBody: MortalityRecord,
        ): CancelablePromise<MortalityRecord> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/mortality-records/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track
         * fish deaths and their causes.
         *
         * Note: UserAssignmentMixin removed as MortalityRecord has
         * no user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this mortality record.
         * @returns MortalityRecord
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsRetrieve(
            id: number,
        ): CancelablePromise<MortalityRecord> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/mortality-records/{id}/',
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
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track
         * fish deaths and their causes.
         *
         * Note: UserAssignmentMixin removed as MortalityRecord has
         * no user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this mortality record.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/mortality-records/{id}/',
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
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track
         * fish deaths and their causes.
         *
         * Note: UserAssignmentMixin removed as MortalityRecord has
         * no user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this mortality record.
         * @param requestBody
         * @returns MortalityRecord
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsPartialUpdate(
            id: number,
            requestBody?: PatchedMortalityRecord,
        ): CancelablePromise<MortalityRecord> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/mortality-records/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea
         * lice infestations in fish populations.
         *
         * Note: UserAssignmentMixin is appropriate here as LiceCount
         * has a user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param adultFemaleCount
         * @param adultFemaleCountGte
         * @param adultFemaleCountLte
         * @param adultMaleCount
         * @param adultMaleCountGte
         * @param adultMaleCountLte
         * @param batch
         * @param container
         * @param countDate
         * @param countDateGte
         * @param countDateLte
         * @param countValue
         * @param countValueGte
         * @param countValueLte
         * @param fishSampled
         * @param fishSampledGte
         * @param fishSampledLte
         * @param juvenileCount
         * @param juvenileCountGte
         * @param juvenileCountLte
         * @param liceType
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param user
         * @returns PaginatedLiceCountList
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsList(
            adultFemaleCount?: number,
            adultFemaleCountGte?: number,
            adultFemaleCountLte?: number,
            adultMaleCount?: number,
            adultMaleCountGte?: number,
            adultMaleCountLte?: number,
            batch?: number,
            container?: number,
            countDate?: string,
            countDateGte?: string,
            countDateLte?: string,
            countValue?: number,
            countValueGte?: number,
            countValueLte?: number,
            fishSampled?: number,
            fishSampledGte?: number,
            fishSampledLte?: number,
            juvenileCount?: number,
            juvenileCountGte?: number,
            juvenileCountLte?: number,
            liceType?: number,
            page?: number,
            search?: string,
            user?: number,
        ): CancelablePromise<PaginatedLiceCountList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-counts/',
                query: {
                    'adult_female_count': adultFemaleCount,
                    'adult_female_count__gte': adultFemaleCountGte,
                    'adult_female_count__lte': adultFemaleCountLte,
                    'adult_male_count': adultMaleCount,
                    'adult_male_count__gte': adultMaleCountGte,
                    'adult_male_count__lte': adultMaleCountLte,
                    'batch': batch,
                    'container': container,
                    'count_date': countDate,
                    'count_date__gte': countDateGte,
                    'count_date__lte': countDateLte,
                    'count_value': countValue,
                    'count_value__gte': countValueGte,
                    'count_value__lte': countValueLte,
                    'fish_sampled': fishSampled,
                    'fish_sampled__gte': fishSampledGte,
                    'fish_sampled__lte': fishSampledLte,
                    'juvenile_count': juvenileCount,
                    'juvenile_count__gte': juvenileCountGte,
                    'juvenile_count__lte': juvenileCountLte,
                    'lice_type': liceType,
                    'page': page,
                    'search': search,
                    'user': user,
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
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea
         * lice infestations in fish populations.
         *
         * Note: UserAssignmentMixin is appropriate here as LiceCount
         * has a user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param requestBody
         * @returns LiceCount
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsCreate(
            requestBody: LiceCount,
        ): CancelablePromise<LiceCount> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/lice-counts/',
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
         * Get aggregated lice summary with optional geography, area, and date filtering.
         * @param area Filter by area ID
         * @param endDate End date for filtering (YYYY-MM-DD)
         * @param geography Filter by geography ID
         * @param startDate Start date for filtering (YYYY-MM-DD)
         * @returns any
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsSummaryRetrieve(
            area?: number,
            endDate?: string,
            geography?: number,
            startDate?: string,
        ): CancelablePromise<{
            /**
             * Total lice counted
             */
            total_counts?: number;
            /**
             * Average lice per fish
             */
            average_per_fish?: number;
            /**
             * Total fish sampled
             */
            fish_sampled?: number;
            /**
             * Counts grouped by species
             */
            by_species?: Record<string, number>;
            /**
             * Counts by development stage
             */
            by_development_stage?: Record<string, number>;
            /**
             * Alert level by thresholds
             */
            alert_level?: 'good' | 'warning' | 'critical';
        }> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-counts/summary/',
                query: {
                    'area': area,
                    'end_date': endDate,
                    'geography': geography,
                    'start_date': startDate,
                },
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Get lice count trends over time with weekly or monthly aggregation.
         * @param area Filter by area ID
         * @param endDate End date for trends (YYYY-MM-DD). Defaults to today.
         * @param geography Filter by geography ID
         * @param interval Interval: weekly or monthly
         * @param startDate Start date for trends (YYYY-MM-DD). Defaults to 1 year ago.
         * @returns any
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsTrendsRetrieve(
            area?: number,
            endDate?: string,
            geography?: number,
            interval?: 'monthly' | 'weekly',
            startDate?: string,
        ): CancelablePromise<{
            trends?: Array<{
                /**
                 * Week or month identifier
                 */
                period?: string;
                average_per_fish?: number;
                total_counts?: number;
                fish_sampled?: number;
            }>;
        }> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-counts/trends/',
                query: {
                    'area': area,
                    'end_date': endDate,
                    'geography': geography,
                    'interval': interval,
                    'start_date': startDate,
                },
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea
         * lice infestations in fish populations.
         *
         * Note: UserAssignmentMixin is appropriate here as LiceCount
         * has a user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this lice count.
         * @param requestBody
         * @returns LiceCount
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsUpdate(
            id: number,
            requestBody: LiceCount,
        ): CancelablePromise<LiceCount> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/lice-counts/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea
         * lice infestations in fish populations.
         *
         * Note: UserAssignmentMixin is appropriate here as LiceCount
         * has a user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this lice count.
         * @returns LiceCount
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsRetrieve(
            id: number,
        ): CancelablePromise<LiceCount> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-counts/{id}/',
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
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea
         * lice infestations in fish populations.
         *
         * Note: UserAssignmentMixin is appropriate here as LiceCount
         * has a user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this lice count.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/lice-counts/{id}/',
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
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea
         * lice infestations in fish populations.
         *
         * Note: UserAssignmentMixin is appropriate here as LiceCount
         * has a user field. Uses HistoryReasonMixin to automatically
         * capture change reasons for audit trails.
         * @param id A unique integer value identifying this lice count.
         * @param requestBody
         * @returns LiceCount
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsPartialUpdate(
            id: number,
            requestBody?: PatchedLiceCount,
        ): CancelablePromise<LiceCount> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/lice-counts/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for Lice Type classifications (Read-Only).
         *
         * Provides access to normalized lice type lookup table with
         * species, gender, and development stage classifications. This
         * is a read-only endpoint; new lice types are managed by
         * administrators through Django admin.
         * @param developmentStage
         * @param developmentStageIcontains
         * @param gender Gender classification of the lice.
         *
         * * `male` - Male
         * * `female` - Female
         * * `unknown` - Unknown
         * @param isActive
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param species
         * @param speciesIcontains
         * @returns PaginatedLiceTypeList
         * @throws ApiError
         */
        public static apiV1HealthLiceTypesList(
            developmentStage?: string,
            developmentStageIcontains?: string,
            gender?: 'female' | 'male' | 'unknown',
            isActive?: boolean,
            page?: number,
            search?: string,
            species?: string,
            speciesIcontains?: string,
        ): CancelablePromise<PaginatedLiceTypeList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-types/',
                query: {
                    'development_stage': developmentStage,
                    'development_stage__icontains': developmentStageIcontains,
                    'gender': gender,
                    'is_active': isActive,
                    'page': page,
                    'search': search,
                    'species': species,
                    'species__icontains': speciesIcontains,
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
         * API endpoint for Lice Type classifications (Read-Only).
         *
         * Provides access to normalized lice type lookup table with
         * species, gender, and development stage classifications. This
         * is a read-only endpoint; new lice types are managed by
         * administrators through Django admin.
         * @param id A unique integer value identifying this Lice Type.
         * @returns LiceType
         * @throws ApiError
         */
        public static apiV1HealthLiceTypesRetrieve(
            id: number,
        ): CancelablePromise<LiceType> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-types/{id}/',
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
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param manufacturer
         * @param manufacturerIcontains
         * @param name
         * @param nameIcontains
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedVaccinationTypeList
         * @throws ApiError
         */
        public static apiV1HealthVaccinationTypesList(
            manufacturer?: string,
            manufacturerIcontains?: string,
            name?: string,
            nameIcontains?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedVaccinationTypeList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/vaccination-types/',
                query: {
                    'manufacturer': manufacturer,
                    'manufacturer__icontains': manufacturerIcontains,
                    'name': name,
                    'name__icontains': nameIcontains,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns VaccinationType
         * @throws ApiError
         */
        public static apiV1HealthVaccinationTypesCreate(
            requestBody: VaccinationType,
        ): CancelablePromise<VaccinationType> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/vaccination-types/',
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
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this vaccination type.
         * @param requestBody
         * @returns VaccinationType
         * @throws ApiError
         */
        public static apiV1HealthVaccinationTypesUpdate(
            id: number,
            requestBody: VaccinationType,
        ): CancelablePromise<VaccinationType> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/vaccination-types/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this vaccination type.
         * @returns VaccinationType
         * @throws ApiError
         */
        public static apiV1HealthVaccinationTypesRetrieve(
            id: number,
        ): CancelablePromise<VaccinationType> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/vaccination-types/{id}/',
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
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this vaccination type.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthVaccinationTypesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/vaccination-types/{id}/',
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
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this vaccination type.
         * @param requestBody
         * @returns VaccinationType
         * @throws ApiError
         */
        public static apiV1HealthVaccinationTypesPartialUpdate(
            id: number,
            requestBody?: PatchedVaccinationType,
        ): CancelablePromise<VaccinationType> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/vaccination-types/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param batchId
         * @param batchAssignmentId
         * @param containerId
         * @param outcome Outcome of the treatment.
         *
         * * `pending` - Pending
         * * `successful` - Successful
         * * `partial` - Partially Successful
         * * `unsuccessful` - Unsuccessful
         * @param outcomeIcontains
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param treatmentDate
         * @param treatmentDateGte
         * @param treatmentDateLte
         * @param treatmentType Type of treatment administered.
         *
         * * `medication` - Medication
         * * `vaccination` - Vaccination
         * * `physical` - Physical Treatment
         * * `other` - Other
         * @param userId
         * @param vaccinationTypeId
         * @param withholdingPeriodDays
         * @param withholdingPeriodDaysGte
         * @param withholdingPeriodDaysLte
         * @returns PaginatedTreatmentList
         * @throws ApiError
         */
        public static apiV1HealthTreatmentsList(
            batchId?: number,
            batchAssignmentId?: number,
            containerId?: number,
            outcome?: 'partial' | 'pending' | 'successful' | 'unsuccessful',
            outcomeIcontains?: string,
            page?: number,
            search?: string,
            treatmentDate?: string,
            treatmentDateGte?: string,
            treatmentDateLte?: string,
            treatmentType?: 'medication' | 'other' | 'physical' | 'vaccination',
            userId?: number,
            vaccinationTypeId?: number,
            withholdingPeriodDays?: number,
            withholdingPeriodDaysGte?: number,
            withholdingPeriodDaysLte?: number,
        ): CancelablePromise<PaginatedTreatmentList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/treatments/',
                query: {
                    'batch__id': batchId,
                    'batch_assignment__id': batchAssignmentId,
                    'container__id': containerId,
                    'outcome': outcome,
                    'outcome__icontains': outcomeIcontains,
                    'page': page,
                    'search': search,
                    'treatment_date': treatmentDate,
                    'treatment_date__gte': treatmentDateGte,
                    'treatment_date__lte': treatmentDateLte,
                    'treatment_type': treatmentType,
                    'user__id': userId,
                    'vaccination_type__id': vaccinationTypeId,
                    'withholding_period_days': withholdingPeriodDays,
                    'withholding_period_days__gte': withholdingPeriodDaysGte,
                    'withholding_period_days__lte': withholdingPeriodDaysLte,
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
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns Treatment
         * @throws ApiError
         */
        public static apiV1HealthTreatmentsCreate(
            requestBody: Treatment,
        ): CancelablePromise<Treatment> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/treatments/',
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
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this treatment.
         * @param requestBody
         * @returns Treatment
         * @throws ApiError
         */
        public static apiV1HealthTreatmentsUpdate(
            id: number,
            requestBody: Treatment,
        ): CancelablePromise<Treatment> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/treatments/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this treatment.
         * @returns Treatment
         * @throws ApiError
         */
        public static apiV1HealthTreatmentsRetrieve(
            id: number,
        ): CancelablePromise<Treatment> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/treatments/{id}/',
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
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this treatment.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthTreatmentsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/treatments/{id}/',
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
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this treatment.
         * @param requestBody
         * @returns Treatment
         * @throws ApiError
         */
        public static apiV1HealthTreatmentsPartialUpdate(
            id: number,
            requestBody?: PatchedTreatment,
        ): CancelablePromise<Treatment> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/treatments/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param name
         * @param nameIcontains
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedSampleTypeList
         * @throws ApiError
         */
        public static apiV1HealthSampleTypesList(
            name?: string,
            nameIcontains?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedSampleTypeList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/sample-types/',
                query: {
                    'name': name,
                    'name__icontains': nameIcontains,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns SampleType
         * @throws ApiError
         */
        public static apiV1HealthSampleTypesCreate(
            requestBody: SampleType,
        ): CancelablePromise<SampleType> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/sample-types/',
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
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this sample type.
         * @param requestBody
         * @returns SampleType
         * @throws ApiError
         */
        public static apiV1HealthSampleTypesUpdate(
            id: number,
            requestBody: SampleType,
        ): CancelablePromise<SampleType> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/sample-types/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this sample type.
         * @returns SampleType
         * @throws ApiError
         */
        public static apiV1HealthSampleTypesRetrieve(
            id: number,
        ): CancelablePromise<SampleType> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/sample-types/{id}/',
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
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this sample type.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthSampleTypesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/sample-types/{id}/',
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
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this sample type.
         * @param requestBody
         * @returns SampleType
         * @throws ApiError
         */
        public static apiV1HealthSampleTypesPartialUpdate(
            id: number,
            requestBody?: PatchedSampleType,
        ): CancelablePromise<SampleType> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/sample-types/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * Includes nested score definitions for flexible parameter scoring.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param isActive
         * @param maxScore
         * @param maxScoreGte
         * @param maxScoreLte
         * @param minScore
         * @param minScoreGte
         * @param minScoreLte
         * @param name
         * @param nameIcontains
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedHealthParameterList
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersList(
            isActive?: boolean,
            maxScore?: number,
            maxScoreGte?: number,
            maxScoreLte?: number,
            minScore?: number,
            minScoreGte?: number,
            minScoreLte?: number,
            name?: string,
            nameIcontains?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedHealthParameterList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/health-parameters/',
                query: {
                    'is_active': isActive,
                    'max_score': maxScore,
                    'max_score__gte': maxScoreGte,
                    'max_score__lte': maxScoreLte,
                    'min_score': minScore,
                    'min_score__gte': minScoreGte,
                    'min_score__lte': minScoreLte,
                    'name': name,
                    'name__icontains': nameIcontains,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * Includes nested score definitions for flexible parameter scoring.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns HealthParameter
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersCreate(
            requestBody: HealthParameter,
        ): CancelablePromise<HealthParameter> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/health-parameters/',
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
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * Includes nested score definitions for flexible parameter scoring.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Parameter.
         * @param requestBody
         * @returns HealthParameter
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersUpdate(
            id: number,
            requestBody: HealthParameter,
        ): CancelablePromise<HealthParameter> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/health-parameters/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * Includes nested score definitions for flexible parameter scoring.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Parameter.
         * @returns HealthParameter
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersRetrieve(
            id: number,
        ): CancelablePromise<HealthParameter> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/health-parameters/{id}/',
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
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * Includes nested score definitions for flexible parameter scoring.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Parameter.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/health-parameters/{id}/',
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
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * Includes nested score definitions for flexible parameter scoring.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Parameter.
         * @param requestBody
         * @returns HealthParameter
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersPartialUpdate(
            id: number,
            requestBody?: PatchedHealthParameter,
        ): CancelablePromise<HealthParameter> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/health-parameters/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Parameter Score Definitions.
         *
         * Provides CRUD operations for score definitions that define what each numeric
         * score value means for a health parameter.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param page A page number within the paginated result set.
         * @param parameter
         * @param parameterId
         * @param scoreValue
         * @param scoreValueGte
         * @param scoreValueLte
         * @param search A search term.
         * @returns PaginatedParameterScoreDefinitionList
         * @throws ApiError
         */
        public static apiV1HealthParameterScoreDefinitionsList(
            page?: number,
            parameter?: number,
            parameterId?: number,
            scoreValue?: number,
            scoreValueGte?: number,
            scoreValueLte?: number,
            search?: string,
        ): CancelablePromise<PaginatedParameterScoreDefinitionList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/parameter-score-definitions/',
                query: {
                    'page': page,
                    'parameter': parameter,
                    'parameter__id': parameterId,
                    'score_value': scoreValue,
                    'score_value__gte': scoreValueGte,
                    'score_value__lte': scoreValueLte,
                    'search': search,
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
         * API endpoint for managing Parameter Score Definitions.
         *
         * Provides CRUD operations for score definitions that define what each numeric
         * score value means for a health parameter.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns ParameterScoreDefinition
         * @throws ApiError
         */
        public static apiV1HealthParameterScoreDefinitionsCreate(
            requestBody: ParameterScoreDefinition,
        ): CancelablePromise<ParameterScoreDefinition> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/parameter-score-definitions/',
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
         * API endpoint for managing Parameter Score Definitions.
         *
         * Provides CRUD operations for score definitions that define what each numeric
         * score value means for a health parameter.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Parameter Score Definition.
         * @param requestBody
         * @returns ParameterScoreDefinition
         * @throws ApiError
         */
        public static apiV1HealthParameterScoreDefinitionsUpdate(
            id: number,
            requestBody: ParameterScoreDefinition,
        ): CancelablePromise<ParameterScoreDefinition> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/parameter-score-definitions/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Parameter Score Definitions.
         *
         * Provides CRUD operations for score definitions that define what each numeric
         * score value means for a health parameter.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Parameter Score Definition.
         * @returns ParameterScoreDefinition
         * @throws ApiError
         */
        public static apiV1HealthParameterScoreDefinitionsRetrieve(
            id: number,
        ): CancelablePromise<ParameterScoreDefinition> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/parameter-score-definitions/{id}/',
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
         * API endpoint for managing Parameter Score Definitions.
         *
         * Provides CRUD operations for score definitions that define what each numeric
         * score value means for a health parameter.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Parameter Score Definition.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthParameterScoreDefinitionsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/parameter-score-definitions/{id}/',
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
         * API endpoint for managing Parameter Score Definitions.
         *
         * Provides CRUD operations for score definitions that define what each numeric
         * score value means for a health parameter.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Parameter Score Definition.
         * @param requestBody
         * @returns ParameterScoreDefinition
         * @throws ApiError
         */
        public static apiV1HealthParameterScoreDefinitionsPartialUpdate(
            id: number,
            requestBody?: PatchedParameterScoreDefinition,
        ): CancelablePromise<ParameterScoreDefinition> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/parameter-score-definitions/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param assignmentBatchId
         * @param assignmentContainerId
         * @param page A page number within the paginated result set.
         * @param sampledById
         * @param samplingDate
         * @param samplingDateGte
         * @param samplingDateLte
         * @param search A search term.
         * @returns PaginatedHealthSamplingEventList
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsList(
            assignmentBatchId?: number,
            assignmentContainerId?: number,
            page?: number,
            sampledById?: number,
            samplingDate?: string,
            samplingDateGte?: string,
            samplingDateLte?: string,
            search?: string,
        ): CancelablePromise<PaginatedHealthSamplingEventList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/health-sampling-events/',
                query: {
                    'assignment__batch__id': assignmentBatchId,
                    'assignment__container__id': assignmentContainerId,
                    'page': page,
                    'sampled_by__id': sampledById,
                    'sampling_date': samplingDate,
                    'sampling_date__gte': samplingDateGte,
                    'sampling_date__lte': samplingDateLte,
                    'search': search,
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
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns HealthSamplingEvent
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsCreate(
            requestBody: HealthSamplingEvent,
        ): CancelablePromise<HealthSamplingEvent> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/health-sampling-events/',
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
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Sampling Event.
         * @param requestBody
         * @returns HealthSamplingEvent
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsUpdate(
            id: number,
            requestBody: HealthSamplingEvent,
        ): CancelablePromise<HealthSamplingEvent> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/health-sampling-events/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Sampling Event.
         * @returns HealthSamplingEvent
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsRetrieve(
            id: number,
        ): CancelablePromise<HealthSamplingEvent> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/health-sampling-events/{id}/',
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
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Sampling Event.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/health-sampling-events/{id}/',
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
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Sampling Event.
         * @param requestBody
         * @returns HealthSamplingEvent
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsPartialUpdate(
            id: number,
            requestBody?: PatchedHealthSamplingEvent,
        ): CancelablePromise<HealthSamplingEvent> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/health-sampling-events/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Trigger the calculation of aggregate metrics for a model instance.
         *
         * Args:
         * request: The request object
         * pk: The primary key of the instance
         *
         * Returns:
         * Response: The serialized instance after calculation
         * @param id A unique integer value identifying this Health Sampling Event.
         * @param requestBody
         * @returns HealthSamplingEvent
         * @throws ApiError
         */
        public static apiV1HealthHealthSamplingEventsCalculateAggregatesCreate(
            id: number,
            requestBody: HealthSamplingEvent,
        ): CancelablePromise<HealthSamplingEvent> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/health-sampling-events/{id}/calculate-aggregates/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param fishIdentifier
         * @param fishIdentifierIcontains
         * @param page A page number within the paginated result set.
         * @param samplingEventId
         * @param search A search term.
         * @returns PaginatedIndividualFishObservationList
         * @throws ApiError
         */
        public static apiV1HealthIndividualFishObservationsList(
            fishIdentifier?: string,
            fishIdentifierIcontains?: string,
            page?: number,
            samplingEventId?: number,
            search?: string,
        ): CancelablePromise<PaginatedIndividualFishObservationList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/individual-fish-observations/',
                query: {
                    'fish_identifier': fishIdentifier,
                    'fish_identifier__icontains': fishIdentifierIcontains,
                    'page': page,
                    'sampling_event__id': samplingEventId,
                    'search': search,
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
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns IndividualFishObservation
         * @throws ApiError
         */
        public static apiV1HealthIndividualFishObservationsCreate(
            requestBody: IndividualFishObservation,
        ): CancelablePromise<IndividualFishObservation> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/individual-fish-observations/',
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
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Individual Fish Observation.
         * @param requestBody
         * @returns IndividualFishObservation
         * @throws ApiError
         */
        public static apiV1HealthIndividualFishObservationsUpdate(
            id: number,
            requestBody: IndividualFishObservation,
        ): CancelablePromise<IndividualFishObservation> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/individual-fish-observations/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Individual Fish Observation.
         * @returns IndividualFishObservation
         * @throws ApiError
         */
        public static apiV1HealthIndividualFishObservationsRetrieve(
            id: number,
        ): CancelablePromise<IndividualFishObservation> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/individual-fish-observations/{id}/',
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
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Individual Fish Observation.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthIndividualFishObservationsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/individual-fish-observations/{id}/',
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
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Individual Fish Observation.
         * @param requestBody
         * @returns IndividualFishObservation
         * @throws ApiError
         */
        public static apiV1HealthIndividualFishObservationsPartialUpdate(
            id: number,
            requestBody?: PatchedIndividualFishObservation,
        ): CancelablePromise<IndividualFishObservation> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/individual-fish-observations/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param individualFishObservationId
         * @param page A page number within the paginated result set.
         * @param parameterId
         * @param score
         * @param scoreGte
         * @param scoreLte
         * @param search A search term.
         * @returns PaginatedFishParameterScoreList
         * @throws ApiError
         */
        public static apiV1HealthFishParameterScoresList(
            individualFishObservationId?: number,
            page?: number,
            parameterId?: number,
            score?: number,
            scoreGte?: number,
            scoreLte?: number,
            search?: string,
        ): CancelablePromise<PaginatedFishParameterScoreList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/fish-parameter-scores/',
                query: {
                    'individual_fish_observation__id': individualFishObservationId,
                    'page': page,
                    'parameter__id': parameterId,
                    'score': score,
                    'score__gte': scoreGte,
                    'score__lte': scoreLte,
                    'search': search,
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
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param requestBody
         * @returns FishParameterScore
         * @throws ApiError
         */
        public static apiV1HealthFishParameterScoresCreate(
            requestBody: FishParameterScore,
        ): CancelablePromise<FishParameterScore> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/fish-parameter-scores/',
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
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Fish Parameter Score.
         * @param requestBody
         * @returns FishParameterScore
         * @throws ApiError
         */
        public static apiV1HealthFishParameterScoresUpdate(
            id: number,
            requestBody: FishParameterScore,
        ): CancelablePromise<FishParameterScore> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/fish-parameter-scores/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Fish Parameter Score.
         * @returns FishParameterScore
         * @throws ApiError
         */
        public static apiV1HealthFishParameterScoresRetrieve(
            id: number,
        ): CancelablePromise<FishParameterScore> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/fish-parameter-scores/{id}/',
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
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Fish Parameter Score.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthFishParameterScoresDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/fish-parameter-scores/{id}/',
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
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Fish Parameter Score.
         * @param requestBody
         * @returns FishParameterScore
         * @throws ApiError
         */
        public static apiV1HealthFishParameterScoresPartialUpdate(
            id: number,
            requestBody?: PatchedFishParameterScore,
        ): CancelablePromise<FishParameterScore> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/fish-parameter-scores/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param batchContainerAssignmentBatchId
         * @param batchContainerAssignmentContainerId
         * @param labReferenceId
         * @param labReferenceIdIcontains
         * @param page A page number within the paginated result set.
         * @param recordedById
         * @param sampleDate
         * @param sampleDateGte
         * @param sampleDateLte
         * @param sampleTypeId
         * @param search A search term.
         * @returns PaginatedHealthLabSampleList
         * @throws ApiError
         */
        public static apiV1HealthHealthLabSamplesList(
            batchContainerAssignmentBatchId?: number,
            batchContainerAssignmentContainerId?: number,
            labReferenceId?: string,
            labReferenceIdIcontains?: string,
            page?: number,
            recordedById?: number,
            sampleDate?: string,
            sampleDateGte?: string,
            sampleDateLte?: string,
            sampleTypeId?: number,
            search?: string,
        ): CancelablePromise<PaginatedHealthLabSampleList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/health-lab-samples/',
                query: {
                    'batch_container_assignment__batch__id': batchContainerAssignmentBatchId,
                    'batch_container_assignment__container__id': batchContainerAssignmentContainerId,
                    'lab_reference_id': labReferenceId,
                    'lab_reference_id__icontains': labReferenceIdIcontains,
                    'page': page,
                    'recorded_by__id': recordedById,
                    'sample_date': sampleDate,
                    'sample_date__gte': sampleDateGte,
                    'sample_date__lte': sampleDateLte,
                    'sample_type__id': sampleTypeId,
                    'search': search,
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
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param formData
         * @returns HealthLabSample
         * @throws ApiError
         */
        public static apiV1HealthHealthLabSamplesCreate(
            formData: HealthLabSample,
        ): CancelablePromise<HealthLabSample> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/health/health-lab-samples/',
                formData: formData,
                mediaType: 'multipart/form-data',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Lab Sample.
         * @param formData
         * @returns HealthLabSample
         * @throws ApiError
         */
        public static apiV1HealthHealthLabSamplesUpdate(
            id: number,
            formData: HealthLabSample,
        ): CancelablePromise<HealthLabSample> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/health/health-lab-samples/{id}/',
                path: {
                    'id': id,
                },
                formData: formData,
                mediaType: 'multipart/form-data',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Lab Sample.
         * @returns HealthLabSample
         * @throws ApiError
         */
        public static apiV1HealthHealthLabSamplesRetrieve(
            id: number,
        ): CancelablePromise<HealthLabSample> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/health-lab-samples/{id}/',
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
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Lab Sample.
         * @returns void
         * @throws ApiError
         */
        public static apiV1HealthHealthLabSamplesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/health/health-lab-samples/{id}/',
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
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
         *
         * Uses HistoryReasonMixin to automatically capture change reasons for audit trails.
         * @param id A unique integer value identifying this Health Lab Sample.
         * @param formData
         * @returns HealthLabSample
         * @throws ApiError
         */
        public static apiV1HealthHealthLabSamplesPartialUpdate(
            id: number,
            formData?: PatchedHealthLabSample,
        ): CancelablePromise<HealthLabSample> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/health/health-lab-samples/{id}/',
                path: {
                    'id': id,
                },
                formData: formData,
                mediaType: 'multipart/form-data',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * List historical records with enhanced OpenAPI documentation.
         * @param batch
         * @param category * `observation` - Observation
         * * `issue` - Issue
         * * `action` - Action
         * * `diagnosis` - Diagnosis
         * * `treatment` - Treatment
         * * `vaccination` - Vaccination
         * * `sample` - Sample
         * @param container
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param resolutionStatus
         * @param search A search term.
         * @param severity * `low` - Low
         * * `medium` - Medium
         * * `high` - High
         * @returns PaginatedJournalEntryHistoryList
         * @throws ApiError
         */
        public static listHealthJournalEntryHistory(
            batch?: number,
            category?: 'action' | 'diagnosis' | 'issue' | 'observation' | 'sample' | 'treatment' | 'vaccination',
            container?: number,
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            resolutionStatus?: boolean,
            search?: string,
            severity?: 'high' | 'low' | 'medium' | null,
        ): CancelablePromise<PaginatedJournalEntryHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/journal-entries/',
                query: {
                    'batch': batch,
                    'category': category,
                    'container': container,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'resolution_status': resolutionStatus,
                    'search': search,
                    'severity': severity,
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
         * ViewSet for JournalEntry historical records.
         * @param historyId A unique integer value identifying this historical journal entry.
         * @returns JournalEntryHistory
         * @throws ApiError
         */
        public static retrieveHealthJournalEntryHistoryDetail(
            historyId: number,
        ): CancelablePromise<JournalEntryHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/journal-entries/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param batch
         * @param container
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param reason
         * @param search A search term.
         * @returns PaginatedMortalityRecordHistoryList
         * @throws ApiError
         */
        public static listHealthMortalityRecordHistory(
            batch?: number,
            container?: number,
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            reason?: number,
            search?: string,
        ): CancelablePromise<PaginatedMortalityRecordHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/mortality-records/',
                query: {
                    'batch': batch,
                    'container': container,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'reason': reason,
                    'search': search,
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
         * ViewSet for MortalityRecord historical records.
         * @param historyId A unique integer value identifying this historical mortality record.
         * @returns MortalityRecordHistory
         * @throws ApiError
         */
        public static retrieveHealthMortalityRecordHistoryDetail(
            historyId: number,
        ): CancelablePromise<MortalityRecordHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/mortality-records/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param batch
         * @param container
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param liceType
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedLiceCountHistoryList
         * @throws ApiError
         */
        public static listHealthLiceCountHistory(
            batch?: number,
            container?: number,
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            liceType?: number,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedLiceCountHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/lice-counts/',
                query: {
                    'batch': batch,
                    'container': container,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'lice_type': liceType,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for LiceCount historical records.
         * @param historyId A unique integer value identifying this historical lice count.
         * @returns LiceCountHistory
         * @throws ApiError
         */
        public static retrieveHealthLiceCountHistoryDetail(
            historyId: number,
        ): CancelablePromise<LiceCountHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/lice-counts/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param developmentStage
         * @param gender Gender classification of the lice.
         *
         * * `male` - Male
         * * `female` - Female
         * * `unknown` - Unknown
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param isActive
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param species
         * @returns PaginatedLiceTypeHistoryList
         * @throws ApiError
         */
        public static apiV1HealthHistoryLiceTypesList(
            dateFrom?: string,
            dateTo?: string,
            developmentStage?: string,
            gender?: 'female' | 'male' | 'unknown',
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            isActive?: boolean,
            ordering?: string,
            page?: number,
            search?: string,
            species?: string,
        ): CancelablePromise<PaginatedLiceTypeHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/lice-types/',
                query: {
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'development_stage': developmentStage,
                    'gender': gender,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'is_active': isActive,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'species': species,
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
         * ViewSet for LiceType historical records.
         * @param historyId A unique integer value identifying this historical Lice Type.
         * @returns LiceTypeHistory
         * @throws ApiError
         */
        public static apiV1HealthHistoryLiceTypesRetrieve(
            historyId: number,
        ): CancelablePromise<LiceTypeHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/lice-types/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param batch
         * @param container
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param treatmentType Type of treatment administered.
         *
         * * `medication` - Medication
         * * `vaccination` - Vaccination
         * * `physical` - Physical Treatment
         * * `other` - Other
         * @returns PaginatedTreatmentHistoryList
         * @throws ApiError
         */
        public static listHealthTreatmentHistory(
            batch?: number,
            container?: number,
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            search?: string,
            treatmentType?: 'medication' | 'other' | 'physical' | 'vaccination',
        ): CancelablePromise<PaginatedTreatmentHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/treatments/',
                query: {
                    'batch': batch,
                    'container': container,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'treatment_type': treatmentType,
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
         * ViewSet for Treatment historical records.
         * @param historyId A unique integer value identifying this historical treatment.
         * @returns TreatmentHistory
         * @throws ApiError
         */
        public static retrieveHealthTreatmentHistoryDetail(
            historyId: number,
        ): CancelablePromise<TreatmentHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/treatments/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param batchContainerAssignment
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param recordedBy
         * @param sampleType
         * @param search A search term.
         * @returns PaginatedHealthLabSampleHistoryList
         * @throws ApiError
         */
        public static listHealthHealthLabSampleHistory(
            batchContainerAssignment?: number,
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            recordedBy?: number,
            sampleType?: number,
            search?: string,
        ): CancelablePromise<PaginatedHealthLabSampleHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/health-lab-samples/',
                query: {
                    'batch_container_assignment': batchContainerAssignment,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'recorded_by': recordedBy,
                    'sample_type': sampleType,
                    'search': search,
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
         * ViewSet for HealthLabSample historical records.
         * @param historyId A unique integer value identifying this historical Health Lab Sample.
         * @returns HealthLabSampleHistory
         * @throws ApiError
         */
        public static retrieveHealthHealthLabSampleHistoryDetail(
            historyId: number,
        ): CancelablePromise<HealthLabSampleHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/history/health-lab-samples/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * ViewSet for maintenance tasks. Uses HistoryReasonMixin to capture audit change reasons.
         * @param completedDate
         * @param container
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param taskType Type of maintenance task
         *
         * * `cleaning` - Cleaning
         * * `repair` - Repair
         * * `inspection` - Inspection
         * * `upgrade` - Equipment Upgrade
         * @returns PaginatedMaintenanceTaskList
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksList(
            completedDate?: string,
            container?: number,
            ordering?: string,
            page?: number,
            search?: string,
            taskType?: 'cleaning' | 'inspection' | 'repair' | 'upgrade',
        ): CancelablePromise<PaginatedMaintenanceTaskList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/maintenance-tasks/',
                query: {
                    'completed_date': completedDate,
                    'container': container,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'task_type': taskType,
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
         * ViewSet for maintenance tasks. Uses HistoryReasonMixin to capture audit change reasons.
         * @param requestBody
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksCreate(
            requestBody: MaintenanceTask,
        ): CancelablePromise<MaintenanceTask> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/maintenance-tasks/',
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
         * Get all overdue maintenance tasks.
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksOverdueRetrieve(): CancelablePromise<Array<MaintenanceTask>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/maintenance-tasks/overdue/',
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for maintenance tasks. Uses HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Maintenance Task.
         * @param requestBody
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksUpdate(
            id: number,
            requestBody: MaintenanceTask,
        ): CancelablePromise<MaintenanceTask> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/maintenance-tasks/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for maintenance tasks. Uses HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Maintenance Task.
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksRetrieve(
            id: number,
        ): CancelablePromise<MaintenanceTask> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/maintenance-tasks/{id}/',
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
         * ViewSet for maintenance tasks. Uses HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Maintenance Task.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/maintenance-tasks/{id}/',
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
         * ViewSet for maintenance tasks. Uses HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Maintenance Task.
         * @param requestBody
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksPartialUpdate(
            id: number,
            requestBody?: PatchedMaintenanceTask,
        ): CancelablePromise<MaintenanceTask> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/maintenance-tasks/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Mark a maintenance task as completed.
         * @param id A unique integer value identifying this Maintenance Task.
         * @param requestBody
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksCompleteCreate(
            id: number,
            requestBody: MaintenanceTask,
        ): CancelablePromise<MaintenanceTask> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/maintenance-tasks/{id}/complete/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for broodstock fish with HistoryReasonMixin providing audit change reasons.
         * @param container
         * @param healthStatus Current health status
         *
         * * `healthy` - Healthy
         * * `monitored` - Monitored
         * * `sick` - Sick
         * * `deceased` - Deceased
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedBroodstockFishList
         * @throws ApiError
         */
        public static apiV1BroodstockFishList(
            container?: number,
            healthStatus?: 'deceased' | 'healthy' | 'monitored' | 'sick',
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedBroodstockFishList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish/',
                query: {
                    'container': container,
                    'health_status': healthStatus,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for broodstock fish with HistoryReasonMixin providing audit change reasons.
         * @param requestBody
         * @returns BroodstockFish
         * @throws ApiError
         */
        public static apiV1BroodstockFishCreate(
            requestBody: BroodstockFish,
        ): CancelablePromise<BroodstockFish> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/fish/',
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
         * Get fish grouped by container.
         * @param containerId ID of the container to list broodstock fish for.
         * @param container
         * @param healthStatus Current health status
         *
         * * `healthy` - Healthy
         * * `monitored` - Monitored
         * * `sick` - Sick
         * * `deceased` - Deceased
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedBroodstockFishList
         * @throws ApiError
         */
        public static apiV1BroodstockFishByContainerList(
            containerId: number,
            container?: number,
            healthStatus?: 'deceased' | 'healthy' | 'monitored' | 'sick',
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<Array<PaginatedBroodstockFishList>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish/by_container/',
                query: {
                    'container': container,
                    'container_id': containerId,
                    'health_status': healthStatus,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * Get all healthy broodstock fish.
         * @returns BroodstockFish
         * @throws ApiError
         */
        public static apiV1BroodstockFishHealthyRetrieve(): CancelablePromise<BroodstockFish> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish/healthy/',
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for broodstock fish with HistoryReasonMixin providing audit change reasons.
         * @param id A unique integer value identifying this Broodstock Fish.
         * @param requestBody
         * @returns BroodstockFish
         * @throws ApiError
         */
        public static apiV1BroodstockFishUpdate(
            id: number,
            requestBody: BroodstockFish,
        ): CancelablePromise<BroodstockFish> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/fish/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for broodstock fish with HistoryReasonMixin providing audit change reasons.
         * @param id A unique integer value identifying this Broodstock Fish.
         * @returns BroodstockFish
         * @throws ApiError
         */
        public static apiV1BroodstockFishRetrieve(
            id: number,
        ): CancelablePromise<BroodstockFish> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish/{id}/',
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
         * ViewSet for broodstock fish with HistoryReasonMixin providing audit change reasons.
         * @param id A unique integer value identifying this Broodstock Fish.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockFishDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/fish/{id}/',
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
         * ViewSet for broodstock fish with HistoryReasonMixin providing audit change reasons.
         * @param id A unique integer value identifying this Broodstock Fish.
         * @param requestBody
         * @returns BroodstockFish
         * @throws ApiError
         */
        public static apiV1BroodstockFishPartialUpdate(
            id: number,
            requestBody?: PatchedBroodstockFish,
        ): CancelablePromise<BroodstockFish> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/fish/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for fish movements leveraging HistoryReasonMixin for audit change reasons.
         * @param fish
         * @param fromContainer
         * @param movementDate
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param toContainer
         * @returns PaginatedFishMovementList
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsList(
            fish?: number,
            fromContainer?: number,
            movementDate?: string,
            ordering?: string,
            page?: number,
            search?: string,
            toContainer?: number,
        ): CancelablePromise<PaginatedFishMovementList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish-movements/',
                query: {
                    'fish': fish,
                    'from_container': fromContainer,
                    'movement_date': movementDate,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'to_container': toContainer,
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
         * ViewSet for fish movements leveraging HistoryReasonMixin for audit change reasons.
         * @param requestBody
         * @returns FishMovement
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsCreate(
            requestBody: FishMovement,
        ): CancelablePromise<FishMovement> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/fish-movements/',
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
         * Transfer multiple fish between containers.
         * @param requestBody
         * @returns FishMovement
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsBulkTransferCreate(
            requestBody: FishMovement,
        ): CancelablePromise<FishMovement> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/fish-movements/bulk_transfer/',
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
         * ViewSet for fish movements leveraging HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Fish Movement.
         * @param requestBody
         * @returns FishMovement
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsUpdate(
            id: number,
            requestBody: FishMovement,
        ): CancelablePromise<FishMovement> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/fish-movements/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for fish movements leveraging HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Fish Movement.
         * @returns FishMovement
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsRetrieve(
            id: number,
        ): CancelablePromise<FishMovement> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish-movements/{id}/',
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
         * ViewSet for fish movements leveraging HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Fish Movement.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/fish-movements/{id}/',
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
         * ViewSet for fish movements leveraging HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Fish Movement.
         * @param requestBody
         * @returns FishMovement
         * @throws ApiError
         */
        public static apiV1BroodstockFishMovementsPartialUpdate(
            id: number,
            requestBody?: PatchedFishMovement,
        ): CancelablePromise<FishMovement> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/fish-movements/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding plans with HistoryReasonMixin-driven audit change reasons.
         * @param endDate
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param startDate
         * @returns PaginatedBreedingPlanList
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansList(
            endDate?: string,
            ordering?: string,
            page?: number,
            search?: string,
            startDate?: string,
        ): CancelablePromise<PaginatedBreedingPlanList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/breeding-plans/',
                query: {
                    'end_date': endDate,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'start_date': startDate,
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
         * ViewSet for breeding plans with HistoryReasonMixin-driven audit change reasons.
         * @param requestBody
         * @returns BreedingPlan
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansCreate(
            requestBody: BreedingPlan,
        ): CancelablePromise<BreedingPlan> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/breeding-plans/',
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
         * Get all currently active breeding plans.
         * @returns BreedingPlan
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansActiveRetrieve(): CancelablePromise<Array<BreedingPlan>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/breeding-plans/active/',
                errors: {
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding plans with HistoryReasonMixin-driven audit change reasons.
         * @param id A unique integer value identifying this Breeding Plan.
         * @param requestBody
         * @returns BreedingPlan
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansUpdate(
            id: number,
            requestBody: BreedingPlan,
        ): CancelablePromise<BreedingPlan> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/breeding-plans/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding plans with HistoryReasonMixin-driven audit change reasons.
         * @param id A unique integer value identifying this Breeding Plan.
         * @returns BreedingPlan
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansRetrieve(
            id: number,
        ): CancelablePromise<BreedingPlan> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/breeding-plans/{id}/',
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
         * ViewSet for breeding plans with HistoryReasonMixin-driven audit change reasons.
         * @param id A unique integer value identifying this Breeding Plan.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/breeding-plans/{id}/',
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
         * ViewSet for breeding plans with HistoryReasonMixin-driven audit change reasons.
         * @param id A unique integer value identifying this Breeding Plan.
         * @param requestBody
         * @returns BreedingPlan
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansPartialUpdate(
            id: number,
            requestBody?: PatchedBreedingPlan,
        ): CancelablePromise<BreedingPlan> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/breeding-plans/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding trait priorities with HistoryReasonMixin auditing support.
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param plan
         * @param traitName Trait to prioritize
         *
         * * `growth_rate` - Growth Rate
         * * `disease_resistance` - Disease Resistance
         * * `size` - Size
         * * `fertility` - Fertility
         * @returns PaginatedBreedingTraitPriorityList
         * @throws ApiError
         */
        public static apiV1BroodstockTraitPrioritiesList(
            ordering?: string,
            page?: number,
            plan?: number,
            traitName?: 'disease_resistance' | 'fertility' | 'growth_rate' | 'size',
        ): CancelablePromise<PaginatedBreedingTraitPriorityList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/trait-priorities/',
                query: {
                    'ordering': ordering,
                    'page': page,
                    'plan': plan,
                    'trait_name': traitName,
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
         * ViewSet for breeding trait priorities with HistoryReasonMixin auditing support.
         * @param requestBody
         * @returns BreedingTraitPriority
         * @throws ApiError
         */
        public static apiV1BroodstockTraitPrioritiesCreate(
            requestBody: BreedingTraitPriority,
        ): CancelablePromise<BreedingTraitPriority> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/trait-priorities/',
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
         * ViewSet for breeding trait priorities with HistoryReasonMixin auditing support.
         * @param id A unique integer value identifying this Breeding Trait Priority.
         * @param requestBody
         * @returns BreedingTraitPriority
         * @throws ApiError
         */
        public static apiV1BroodstockTraitPrioritiesUpdate(
            id: number,
            requestBody: BreedingTraitPriority,
        ): CancelablePromise<BreedingTraitPriority> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/trait-priorities/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding trait priorities with HistoryReasonMixin auditing support.
         * @param id A unique integer value identifying this Breeding Trait Priority.
         * @returns BreedingTraitPriority
         * @throws ApiError
         */
        public static apiV1BroodstockTraitPrioritiesRetrieve(
            id: number,
        ): CancelablePromise<BreedingTraitPriority> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/trait-priorities/{id}/',
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
         * ViewSet for breeding trait priorities with HistoryReasonMixin auditing support.
         * @param id A unique integer value identifying this Breeding Trait Priority.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockTraitPrioritiesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/trait-priorities/{id}/',
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
         * ViewSet for breeding trait priorities with HistoryReasonMixin auditing support.
         * @param id A unique integer value identifying this Breeding Trait Priority.
         * @param requestBody
         * @returns BreedingTraitPriority
         * @throws ApiError
         */
        public static apiV1BroodstockTraitPrioritiesPartialUpdate(
            id: number,
            requestBody?: PatchedBreedingTraitPriority,
        ): CancelablePromise<BreedingTraitPriority> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/trait-priorities/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding pairs leveraging HistoryReasonMixin to capture audit change reasons.
         * @param femaleFish
         * @param maleFish
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param pairingDate
         * @param plan
         * @param search A search term.
         * @returns PaginatedBreedingPairList
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsList(
            femaleFish?: number,
            maleFish?: number,
            ordering?: string,
            page?: number,
            pairingDate?: string,
            plan?: number,
            search?: string,
        ): CancelablePromise<PaginatedBreedingPairList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/breeding-pairs/',
                query: {
                    'female_fish': femaleFish,
                    'male_fish': maleFish,
                    'ordering': ordering,
                    'page': page,
                    'pairing_date': pairingDate,
                    'plan': plan,
                    'search': search,
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
         * ViewSet for breeding pairs leveraging HistoryReasonMixin to capture audit change reasons.
         * @param requestBody
         * @returns BreedingPair
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsCreate(
            requestBody: BreedingPair,
        ): CancelablePromise<BreedingPair> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/breeding-pairs/',
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
         * ViewSet for breeding pairs leveraging HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Breeding Pair.
         * @param requestBody
         * @returns BreedingPair
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsUpdate(
            id: number,
            requestBody: BreedingPair,
        ): CancelablePromise<BreedingPair> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/breeding-pairs/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for breeding pairs leveraging HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Breeding Pair.
         * @returns BreedingPair
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsRetrieve(
            id: number,
        ): CancelablePromise<BreedingPair> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/breeding-pairs/{id}/',
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
         * ViewSet for breeding pairs leveraging HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Breeding Pair.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/breeding-pairs/{id}/',
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
         * ViewSet for breeding pairs leveraging HistoryReasonMixin to capture audit change reasons.
         * @param id A unique integer value identifying this Breeding Pair.
         * @param requestBody
         * @returns BreedingPair
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsPartialUpdate(
            id: number,
            requestBody?: PatchedBreedingPair,
        ): CancelablePromise<BreedingPair> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/breeding-pairs/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Record progeny count for a breeding pair.
         * @param id A unique integer value identifying this Breeding Pair.
         * @param requestBody
         * @returns BreedingPair
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPairsRecordProgenyCreate(
            id: number,
            requestBody: BreedingPair,
        ): CancelablePromise<BreedingPair> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/breeding-pairs/{id}/record_progeny/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for egg suppliers using HistoryReasonMixin for audit change reasons.
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedEggSupplierList
         * @throws ApiError
         */
        public static apiV1BroodstockEggSuppliersList(
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedEggSupplierList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/egg-suppliers/',
                query: {
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for egg suppliers using HistoryReasonMixin for audit change reasons.
         * @param requestBody
         * @returns EggSupplier
         * @throws ApiError
         */
        public static apiV1BroodstockEggSuppliersCreate(
            requestBody: EggSupplier,
        ): CancelablePromise<EggSupplier> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/egg-suppliers/',
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
         * ViewSet for egg suppliers using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Egg Supplier.
         * @param requestBody
         * @returns EggSupplier
         * @throws ApiError
         */
        public static apiV1BroodstockEggSuppliersUpdate(
            id: number,
            requestBody: EggSupplier,
        ): CancelablePromise<EggSupplier> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/egg-suppliers/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for egg suppliers using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Egg Supplier.
         * @returns EggSupplier
         * @throws ApiError
         */
        public static apiV1BroodstockEggSuppliersRetrieve(
            id: number,
        ): CancelablePromise<EggSupplier> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/egg-suppliers/{id}/',
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
         * ViewSet for egg suppliers using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Egg Supplier.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockEggSuppliersDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/egg-suppliers/{id}/',
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
         * ViewSet for egg suppliers using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this Egg Supplier.
         * @param requestBody
         * @returns EggSupplier
         * @throws ApiError
         */
        public static apiV1BroodstockEggSuppliersPartialUpdate(
            id: number,
            requestBody?: PatchedEggSupplier,
        ): CancelablePromise<EggSupplier> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/egg-suppliers/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for egg production with HistoryReasonMixin ensuring audit change reasons.
         * @param destinationStation
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param pair
         * @param productionDate
         * @param search A search term.
         * @param sourceType Internal or external source
         *
         * * `internal` - Internal
         * * `external` - External
         * @returns PaginatedEggProductionList
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsList(
            destinationStation?: number,
            ordering?: string,
            page?: number,
            pair?: number,
            productionDate?: string,
            search?: string,
            sourceType?: 'external' | 'internal',
        ): CancelablePromise<PaginatedEggProductionList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/egg-productions/',
                query: {
                    'destination_station': destinationStation,
                    'ordering': ordering,
                    'page': page,
                    'pair': pair,
                    'production_date': productionDate,
                    'search': search,
                    'source_type': sourceType,
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
         * ViewSet for egg production with HistoryReasonMixin ensuring audit change reasons.
         * @param requestBody
         * @returns EggProduction
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsCreate(
            requestBody: EggProduction,
        ): CancelablePromise<EggProduction> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/egg-productions/',
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
         * Create external egg acquisition.
         *
         * Delegates to EggManagementService for proper validation including:
         * - Duplicate batch number prevention
         * - Atomic transaction handling
         * - Unique batch ID generation
         * @param requestBody
         * @returns EggProduction
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsAcquireExternalCreate(
            requestBody: EggProduction,
        ): CancelablePromise<EggProduction> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/egg-productions/acquire_external/',
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
         * Create internal egg production from a breeding pair.
         *
         * Delegates to EggManagementService for proper validation including:
         * - Active breeding plan validation
         * - Fish health status checks
         * - Automatic progeny count updates
         * - Unique batch ID generation
         * @param requestBody
         * @returns EggProduction
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsProduceInternalCreate(
            requestBody: EggProduction,
        ): CancelablePromise<EggProduction> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/egg-productions/produce_internal/',
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
         * ViewSet for egg production with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Egg Production.
         * @param requestBody
         * @returns EggProduction
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsUpdate(
            id: number,
            requestBody: EggProduction,
        ): CancelablePromise<EggProduction> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/egg-productions/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for egg production with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Egg Production.
         * @returns EggProductionDetail
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsRetrieve(
            id: number,
        ): CancelablePromise<EggProductionDetail> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/egg-productions/{id}/',
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
         * ViewSet for egg production with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Egg Production.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/egg-productions/{id}/',
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
         * ViewSet for egg production with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Egg Production.
         * @param requestBody
         * @returns EggProduction
         * @throws ApiError
         */
        public static apiV1BroodstockEggProductionsPartialUpdate(
            id: number,
            requestBody?: PatchedEggProduction,
        ): CancelablePromise<EggProduction> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/egg-productions/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for external egg batches using HistoryReasonMixin for audit change reasons.
         * @param eggProduction
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param supplier
         * @returns PaginatedExternalEggBatchList
         * @throws ApiError
         */
        public static apiV1BroodstockExternalEggBatchesList(
            eggProduction?: number,
            ordering?: string,
            page?: number,
            search?: string,
            supplier?: number,
        ): CancelablePromise<PaginatedExternalEggBatchList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/external-egg-batches/',
                query: {
                    'egg_production': eggProduction,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'supplier': supplier,
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
         * ViewSet for external egg batches using HistoryReasonMixin for audit change reasons.
         * @param requestBody
         * @returns ExternalEggBatch
         * @throws ApiError
         */
        public static apiV1BroodstockExternalEggBatchesCreate(
            requestBody: ExternalEggBatch,
        ): CancelablePromise<ExternalEggBatch> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/external-egg-batches/',
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
         * ViewSet for external egg batches using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this External Egg Batch.
         * @param requestBody
         * @returns ExternalEggBatch
         * @throws ApiError
         */
        public static apiV1BroodstockExternalEggBatchesUpdate(
            id: number,
            requestBody: ExternalEggBatch,
        ): CancelablePromise<ExternalEggBatch> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/external-egg-batches/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for external egg batches using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this External Egg Batch.
         * @returns ExternalEggBatch
         * @throws ApiError
         */
        public static apiV1BroodstockExternalEggBatchesRetrieve(
            id: number,
        ): CancelablePromise<ExternalEggBatch> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/external-egg-batches/{id}/',
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
         * ViewSet for external egg batches using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this External Egg Batch.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockExternalEggBatchesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/external-egg-batches/{id}/',
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
         * ViewSet for external egg batches using HistoryReasonMixin for audit change reasons.
         * @param id A unique integer value identifying this External Egg Batch.
         * @param requestBody
         * @returns ExternalEggBatch
         * @throws ApiError
         */
        public static apiV1BroodstockExternalEggBatchesPartialUpdate(
            id: number,
            requestBody?: PatchedExternalEggBatch,
        ): CancelablePromise<ExternalEggBatch> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/external-egg-batches/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for batch parentage with HistoryReasonMixin ensuring audit change reasons.
         * @param assignmentDate
         * @param batch
         * @param eggProduction
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @returns PaginatedBatchParentageList
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesList(
            assignmentDate?: string,
            batch?: number,
            eggProduction?: number,
            ordering?: string,
            page?: number,
        ): CancelablePromise<PaginatedBatchParentageList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/batch-parentages/',
                query: {
                    'assignment_date': assignmentDate,
                    'batch': batch,
                    'egg_production': eggProduction,
                    'ordering': ordering,
                    'page': page,
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
         * ViewSet for batch parentage with HistoryReasonMixin ensuring audit change reasons.
         * @param requestBody
         * @returns BatchParentage
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesCreate(
            requestBody: BatchParentage,
        ): CancelablePromise<BatchParentage> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/broodstock/batch-parentages/',
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
         * Get complete lineage for a batch.
         * @param batchId ID of the batch to retrieve lineage information for.
         * @param assignmentDate
         * @param batch
         * @param eggProduction
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @returns PaginatedBatchParentageList
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesLineageList(
            batchId: number,
            assignmentDate?: string,
            batch?: number,
            eggProduction?: number,
            ordering?: string,
            page?: number,
        ): CancelablePromise<Array<PaginatedBatchParentageList>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/batch-parentages/lineage/',
                query: {
                    'assignment_date': assignmentDate,
                    'batch': batch,
                    'batch_id': batchId,
                    'egg_production': eggProduction,
                    'ordering': ordering,
                    'page': page,
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
         * ViewSet for batch parentage with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Batch Parentage.
         * @param requestBody
         * @returns BatchParentage
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesUpdate(
            id: number,
            requestBody: BatchParentage,
        ): CancelablePromise<BatchParentage> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/broodstock/batch-parentages/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * ViewSet for batch parentage with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Batch Parentage.
         * @returns BatchParentage
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesRetrieve(
            id: number,
        ): CancelablePromise<BatchParentage> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/batch-parentages/{id}/',
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
         * ViewSet for batch parentage with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Batch Parentage.
         * @returns void
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/broodstock/batch-parentages/{id}/',
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
         * ViewSet for batch parentage with HistoryReasonMixin ensuring audit change reasons.
         * @param id A unique integer value identifying this Batch Parentage.
         * @param requestBody
         * @returns BatchParentage
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesPartialUpdate(
            id: number,
            requestBody?: PatchedBatchParentage,
        ): CancelablePromise<BatchParentage> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/broodstock/batch-parentages/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * List historical records with enhanced OpenAPI documentation.
         * @param container
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param healthStatus Current health status
         *
         * * `healthy` - Healthy
         * * `monitored` - Monitored
         * * `sick` - Sick
         * * `deceased` - Deceased
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedBroodstockFishHistoryList
         * @throws ApiError
         */
        public static listBroodstockBroodstockFishHistory(
            container?: number,
            dateFrom?: string,
            dateTo?: string,
            healthStatus?: 'deceased' | 'healthy' | 'monitored' | 'sick',
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedBroodstockFishHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/fish/',
                query: {
                    'container': container,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'health_status': healthStatus,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for BroodstockFish historical records.
         * @param historyId A unique integer value identifying this historical Broodstock Fish.
         * @returns BroodstockFishHistory
         * @throws ApiError
         */
        public static retrieveBroodstockBroodstockFishHistoryDetail(
            historyId: number,
        ): CancelablePromise<BroodstockFishHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/fish/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param fish
         * @param fromContainer
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param movedBy
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param toContainer
         * @returns PaginatedFishMovementHistoryList
         * @throws ApiError
         */
        public static listBroodstockFishMovementHistory(
            dateFrom?: string,
            dateTo?: string,
            fish?: number,
            fromContainer?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            movedBy?: number,
            ordering?: string,
            page?: number,
            search?: string,
            toContainer?: number,
        ): CancelablePromise<PaginatedFishMovementHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/fish-movements/',
                query: {
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'fish': fish,
                    'from_container': fromContainer,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'moved_by': movedBy,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'to_container': toContainer,
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
         * ViewSet for FishMovement historical records.
         * @param historyId A unique integer value identifying this historical Fish Movement.
         * @returns FishMovementHistory
         * @throws ApiError
         */
        public static retrieveBroodstockFishMovementHistoryDetail(
            historyId: number,
        ): CancelablePromise<FishMovementHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/fish-movements/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param femaleFish
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param maleFish
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param plan
         * @param search A search term.
         * @returns PaginatedBreedingPairHistoryList
         * @throws ApiError
         */
        public static listBroodstockBreedingPairHistory(
            dateFrom?: string,
            dateTo?: string,
            femaleFish?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            maleFish?: number,
            ordering?: string,
            page?: number,
            plan?: number,
            search?: string,
        ): CancelablePromise<PaginatedBreedingPairHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/breeding-pairs/',
                query: {
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'female_fish': femaleFish,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'male_fish': maleFish,
                    'ordering': ordering,
                    'page': page,
                    'plan': plan,
                    'search': search,
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
         * ViewSet for BreedingPair historical records.
         * @param historyId A unique integer value identifying this historical Breeding Pair.
         * @returns BreedingPairHistory
         * @throws ApiError
         */
        public static retrieveBroodstockBreedingPairHistoryDetail(
            historyId: number,
        ): CancelablePromise<BreedingPairHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/breeding-pairs/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param destinationStation
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param pair
         * @param search A search term.
         * @param sourceType Internal or external source
         *
         * * `internal` - Internal
         * * `external` - External
         * @returns PaginatedEggProductionHistoryList
         * @throws ApiError
         */
        public static listBroodstockEggProductionHistory(
            dateFrom?: string,
            dateTo?: string,
            destinationStation?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            pair?: number,
            search?: string,
            sourceType?: 'external' | 'internal',
        ): CancelablePromise<PaginatedEggProductionHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/egg-productions/',
                query: {
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'destination_station': destinationStation,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'pair': pair,
                    'search': search,
                    'source_type': sourceType,
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
         * ViewSet for EggProduction historical records.
         * @param historyId A unique integer value identifying this historical Egg Production.
         * @returns EggProductionHistory
         * @throws ApiError
         */
        public static retrieveBroodstockEggProductionHistoryDetail(
            historyId: number,
        ): CancelablePromise<EggProductionHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/egg-productions/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param batch
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param eggProduction
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedBatchParentageHistoryList
         * @throws ApiError
         */
        public static listBroodstockBatchParentageHistory(
            batch?: number,
            dateFrom?: string,
            dateTo?: string,
            eggProduction?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedBatchParentageHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/batch-parentages/',
                query: {
                    'batch': batch,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'egg_production': eggProduction,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for BatchParentage historical records.
         * @param historyId A unique integer value identifying this historical Batch Parentage.
         * @returns BatchParentageHistory
         * @throws ApiError
         */
        public static retrieveBroodstockBatchParentageHistoryDetail(
            historyId: number,
        ): CancelablePromise<BatchParentageHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/history/batch-parentages/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * API endpoint for managing Geographical locations or zones.
         *
         * Geographies represent defined geographical areas relevant to the aquaculture
         * operations, such as countries, regions, specific water bodies, or custom zones.
         * These can be used to associate other entities (like facilities or environmental
         * readings) with a spatial context.
         * This endpoint allows for full CRUD operations on Geography instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the geography.
         *
         * **Searching:**
         * - `name`: Search by geography name (partial matches).
         * - `description`: Search within the description of the geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `created_at`
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedGeographyList
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesList(
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedGeographyList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/geographies/',
                query: {
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Geographical locations or zones.
         *
         * Geographies represent defined geographical areas relevant to the aquaculture
         * operations, such as countries, regions, specific water bodies, or custom zones.
         * These can be used to associate other entities (like facilities or environmental
         * readings) with a spatial context.
         * This endpoint allows for full CRUD operations on Geography instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the geography.
         *
         * **Searching:**
         * - `name`: Search by geography name (partial matches).
         * - `description`: Search within the description of the geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `created_at`
         * @param requestBody
         * @returns Geography
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesCreate(
            requestBody: Geography,
        ): CancelablePromise<Geography> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/geographies/',
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
         * API endpoint for managing Geographical locations or zones.
         *
         * Geographies represent defined geographical areas relevant to the aquaculture
         * operations, such as countries, regions, specific water bodies, or custom zones.
         * These can be used to associate other entities (like facilities or environmental
         * readings) with a spatial context.
         * This endpoint allows for full CRUD operations on Geography instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the geography.
         *
         * **Searching:**
         * - `name`: Search by geography name (partial matches).
         * - `description`: Search within the description of the geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `created_at`
         * @param id A unique integer value identifying this geography.
         * @param requestBody
         * @returns Geography
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesUpdate(
            id: number,
            requestBody: Geography,
        ): CancelablePromise<Geography> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/geographies/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Geographical locations or zones.
         *
         * Geographies represent defined geographical areas relevant to the aquaculture
         * operations, such as countries, regions, specific water bodies, or custom zones.
         * These can be used to associate other entities (like facilities or environmental
         * readings) with a spatial context.
         * This endpoint allows for full CRUD operations on Geography instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the geography.
         *
         * **Searching:**
         * - `name`: Search by geography name (partial matches).
         * - `description`: Search within the description of the geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `created_at`
         * @param id A unique integer value identifying this geography.
         * @returns Geography
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesRetrieve(
            id: number,
        ): CancelablePromise<Geography> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/geographies/{id}/',
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
         * API endpoint for managing Geographical locations or zones.
         *
         * Geographies represent defined geographical areas relevant to the aquaculture
         * operations, such as countries, regions, specific water bodies, or custom zones.
         * These can be used to associate other entities (like facilities or environmental
         * readings) with a spatial context.
         * This endpoint allows for full CRUD operations on Geography instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the geography.
         *
         * **Searching:**
         * - `name`: Search by geography name (partial matches).
         * - `description`: Search within the description of the geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `created_at`
         * @param id A unique integer value identifying this geography.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/geographies/{id}/',
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
         * API endpoint for managing Geographical locations or zones.
         *
         * Geographies represent defined geographical areas relevant to the aquaculture
         * operations, such as countries, regions, specific water bodies, or custom zones.
         * These can be used to associate other entities (like facilities or environmental
         * readings) with a spatial context.
         * This endpoint allows for full CRUD operations on Geography instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the geography.
         *
         * **Searching:**
         * - `name`: Search by geography name (partial matches).
         * - `description`: Search within the description of the geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `created_at`
         * @param id A unique integer value identifying this geography.
         * @param requestBody
         * @returns Geography
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesPartialUpdate(
            id: number,
            requestBody?: PatchedGeography,
        ): CancelablePromise<Geography> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/geographies/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Return aggregated KPI metrics for a geography.
         *
         * Computes counts and sums for areas, stations, halls, containers,
         * ring containers, capacity, and active biomass within the geography.
         * @param id A unique integer value identifying this geography.
         * @returns Geography
         * @throws ApiError
         */
        public static apiV1InfrastructureGeographiesSummaryRetrieve(
            id: number,
        ): CancelablePromise<Geography> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/geographies/{id}/summary/',
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
         * API endpoint for managing Areas within the aquaculture facility.
         *
         * Areas represent distinct geographical or functional zones within a larger geography
         * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
         * on Area instances. Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the area.
         * - `geography`: Filter by the ID of the parent Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by area name (partial matches).
         * - `geography__name`: Search by the name of the parent Geography (partial matches).
         *
         * **Ordering:**
         * - `name` (default)
         * - `geography__name`
         * - `created_at`
         * @param active
         * @param geography
         * @param geographyIn Multiple values may be separated by commas.
         * @param name
         * @param nameIcontains
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedAreaList
         * @throws ApiError
         */
        public static apiV1InfrastructureAreasList(
            active?: boolean,
            geography?: number,
            geographyIn?: Array<number>,
            name?: string,
            nameIcontains?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedAreaList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/areas/',
                query: {
                    'active': active,
                    'geography': geography,
                    'geography__in': geographyIn,
                    'name': name,
                    'name__icontains': nameIcontains,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Areas within the aquaculture facility.
         *
         * Areas represent distinct geographical or functional zones within a larger geography
         * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
         * on Area instances. Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the area.
         * - `geography`: Filter by the ID of the parent Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by area name (partial matches).
         * - `geography__name`: Search by the name of the parent Geography (partial matches).
         *
         * **Ordering:**
         * - `name` (default)
         * - `geography__name`
         * - `created_at`
         * @param requestBody
         * @returns Area
         * @throws ApiError
         */
        public static apiV1InfrastructureAreasCreate(
            requestBody: Area,
        ): CancelablePromise<Area> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/areas/',
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
         * API endpoint for managing Areas within the aquaculture facility.
         *
         * Areas represent distinct geographical or functional zones within a larger geography
         * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
         * on Area instances. Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the area.
         * - `geography`: Filter by the ID of the parent Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by area name (partial matches).
         * - `geography__name`: Search by the name of the parent Geography (partial matches).
         *
         * **Ordering:**
         * - `name` (default)
         * - `geography__name`
         * - `created_at`
         * @param id A unique integer value identifying this area.
         * @param requestBody
         * @returns Area
         * @throws ApiError
         */
        public static apiV1InfrastructureAreasUpdate(
            id: number,
            requestBody: Area,
        ): CancelablePromise<Area> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/areas/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Areas within the aquaculture facility.
         *
         * Areas represent distinct geographical or functional zones within a larger geography
         * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
         * on Area instances. Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the area.
         * - `geography`: Filter by the ID of the parent Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by area name (partial matches).
         * - `geography__name`: Search by the name of the parent Geography (partial matches).
         *
         * **Ordering:**
         * - `name` (default)
         * - `geography__name`
         * - `created_at`
         * @param id A unique integer value identifying this area.
         * @returns Area
         * @throws ApiError
         */
        public static apiV1InfrastructureAreasRetrieve(
            id: number,
        ): CancelablePromise<Area> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/areas/{id}/',
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
         * API endpoint for managing Areas within the aquaculture facility.
         *
         * Areas represent distinct geographical or functional zones within a larger geography
         * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
         * on Area instances. Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the area.
         * - `geography`: Filter by the ID of the parent Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by area name (partial matches).
         * - `geography__name`: Search by the name of the parent Geography (partial matches).
         *
         * **Ordering:**
         * - `name` (default)
         * - `geography__name`
         * - `created_at`
         * @param id A unique integer value identifying this area.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureAreasDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/areas/{id}/',
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
         * API endpoint for managing Areas within the aquaculture facility.
         *
         * Areas represent distinct geographical or functional zones within a larger geography
         * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
         * on Area instances. Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the area.
         * - `geography`: Filter by the ID of the parent Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by area name (partial matches).
         * - `geography__name`: Search by the name of the parent Geography (partial matches).
         *
         * **Ordering:**
         * - `name` (default)
         * - `geography__name`
         * - `created_at`
         * @param id A unique integer value identifying this area.
         * @param requestBody
         * @returns Area
         * @throws ApiError
         */
        public static apiV1InfrastructureAreasPartialUpdate(
            id: number,
            requestBody?: PatchedArea,
        ): CancelablePromise<Area> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/areas/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Get KPI summary for an area including container counts, biomass, population, and average weight.
         * @param id A unique integer value identifying this area.
         * @param isActive Filter assignments by active status (default: true).
         * @returns any Area KPI metrics
         * @throws ApiError
         */
        public static areaSummary(
            id: number,
            isActive: boolean = true,
        ): CancelablePromise<{
            /**
             * Total number of containers in the area
             */
            container_count: number;
            /**
             * Number of ring/pen containers in the area
             */
            ring_count: number;
            /**
             * Total active biomass in kilograms
             */
            active_biomass_kg: number;
            /**
             * Total population count
             */
            population_count: number;
            /**
             * Average weight in kilograms per fish
             */
            avg_weight_kg: number;
        }> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/areas/{id}/summary/',
                path: {
                    'id': id,
                },
                query: {
                    'is_active': isActive,
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
         * API endpoint for managing Freshwater Stations.
         *
         * Freshwater Stations represent sources of freshwater for the aquaculture facility,
         * such as wells, boreholes, or municipal supplies. They can be categorized by type
         * and associated with a specific geographical location.
         * This endpoint allows for full CRUD operations on FreshwaterStation instances.
         * Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the freshwater station.
         * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
         * - `geography`: Filter by the ID of the associated Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by station name (partial matches).
         * - `description`: Search within the description of the station.
         * - `geography__name`: Search by the name of the associated Geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `station_type`
         * - `geography__name`: Order by the name of the associated Geography.
         * - `created_at`
         * @param active
         * @param geography
         * @param geographyIn Multiple values may be separated by commas.
         * @param name
         * @param nameIcontains
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param stationType * `FRESHWATER` - Freshwater
         * * `BROODSTOCK` - Broodstock
         * @returns PaginatedFreshwaterStationList
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsList(
            active?: boolean,
            geography?: number,
            geographyIn?: Array<number>,
            name?: string,
            nameIcontains?: string,
            ordering?: string,
            page?: number,
            search?: string,
            stationType?: 'BROODSTOCK' | 'FRESHWATER',
        ): CancelablePromise<PaginatedFreshwaterStationList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/freshwater-stations/',
                query: {
                    'active': active,
                    'geography': geography,
                    'geography__in': geographyIn,
                    'name': name,
                    'name__icontains': nameIcontains,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'station_type': stationType,
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
         * API endpoint for managing Freshwater Stations.
         *
         * Freshwater Stations represent sources of freshwater for the aquaculture facility,
         * such as wells, boreholes, or municipal supplies. They can be categorized by type
         * and associated with a specific geographical location.
         * This endpoint allows for full CRUD operations on FreshwaterStation instances.
         * Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the freshwater station.
         * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
         * - `geography`: Filter by the ID of the associated Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by station name (partial matches).
         * - `description`: Search within the description of the station.
         * - `geography__name`: Search by the name of the associated Geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `station_type`
         * - `geography__name`: Order by the name of the associated Geography.
         * - `created_at`
         * @param requestBody
         * @returns FreshwaterStation
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsCreate(
            requestBody: FreshwaterStation,
        ): CancelablePromise<FreshwaterStation> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/freshwater-stations/',
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
         * API endpoint for managing Freshwater Stations.
         *
         * Freshwater Stations represent sources of freshwater for the aquaculture facility,
         * such as wells, boreholes, or municipal supplies. They can be categorized by type
         * and associated with a specific geographical location.
         * This endpoint allows for full CRUD operations on FreshwaterStation instances.
         * Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the freshwater station.
         * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
         * - `geography`: Filter by the ID of the associated Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by station name (partial matches).
         * - `description`: Search within the description of the station.
         * - `geography__name`: Search by the name of the associated Geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `station_type`
         * - `geography__name`: Order by the name of the associated Geography.
         * - `created_at`
         * @param id A unique integer value identifying this freshwater station.
         * @param requestBody
         * @returns FreshwaterStation
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsUpdate(
            id: number,
            requestBody: FreshwaterStation,
        ): CancelablePromise<FreshwaterStation> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/freshwater-stations/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Freshwater Stations.
         *
         * Freshwater Stations represent sources of freshwater for the aquaculture facility,
         * such as wells, boreholes, or municipal supplies. They can be categorized by type
         * and associated with a specific geographical location.
         * This endpoint allows for full CRUD operations on FreshwaterStation instances.
         * Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the freshwater station.
         * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
         * - `geography`: Filter by the ID of the associated Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by station name (partial matches).
         * - `description`: Search within the description of the station.
         * - `geography__name`: Search by the name of the associated Geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `station_type`
         * - `geography__name`: Order by the name of the associated Geography.
         * - `created_at`
         * @param id A unique integer value identifying this freshwater station.
         * @returns FreshwaterStation
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsRetrieve(
            id: number,
        ): CancelablePromise<FreshwaterStation> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/freshwater-stations/{id}/',
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
         * API endpoint for managing Freshwater Stations.
         *
         * Freshwater Stations represent sources of freshwater for the aquaculture facility,
         * such as wells, boreholes, or municipal supplies. They can be categorized by type
         * and associated with a specific geographical location.
         * This endpoint allows for full CRUD operations on FreshwaterStation instances.
         * Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the freshwater station.
         * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
         * - `geography`: Filter by the ID of the associated Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by station name (partial matches).
         * - `description`: Search within the description of the station.
         * - `geography__name`: Search by the name of the associated Geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `station_type`
         * - `geography__name`: Order by the name of the associated Geography.
         * - `created_at`
         * @param id A unique integer value identifying this freshwater station.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/freshwater-stations/{id}/',
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
         * API endpoint for managing Freshwater Stations.
         *
         * Freshwater Stations represent sources of freshwater for the aquaculture facility,
         * such as wells, boreholes, or municipal supplies. They can be categorized by type
         * and associated with a specific geographical location.
         * This endpoint allows for full CRUD operations on FreshwaterStation instances.
         * Uses HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the freshwater station.
         * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
         * - `geography`: Filter by the ID of the associated Geography.
         * - `geography__in`: Filter by multiple Geography IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by station name (partial matches).
         * - `description`: Search within the description of the station.
         * - `geography__name`: Search by the name of the associated Geography.
         *
         * **Ordering:**
         * - `name` (default)
         * - `station_type`
         * - `geography__name`: Order by the name of the associated Geography.
         * - `created_at`
         * @param id A unique integer value identifying this freshwater station.
         * @param requestBody
         * @returns FreshwaterStation
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsPartialUpdate(
            id: number,
            requestBody?: PatchedFreshwaterStation,
        ): CancelablePromise<FreshwaterStation> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/freshwater-stations/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * Return aggregated KPI metrics for a freshwater station.
         *
         * Calculates:
         * - hall_count: Number of halls in this station
         * - container_count: Number of containers in those halls
         * - active_biomass_kg: Sum of biomass from active assignments in those containers
         * - population_count: Sum of population from active assignments in those containers
         * - avg_weight_kg: biomass/population (0 if population=0)
         *
         * Uses database-level aggregation for optimal performance.
         * @param id A unique integer value identifying this freshwater station.
         * @returns FreshwaterStation
         * @throws ApiError
         */
        public static apiV1InfrastructureFreshwaterStationsSummaryRetrieve(
            id: number,
        ): CancelablePromise<FreshwaterStation> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/freshwater-stations/{id}/summary/',
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
         * API endpoint for managing Halls within the aquaculture facility.
         *
         * Halls represent distinct buildings or sections within the facility,
         * often containing multiple containers or systems. They can be associated
         * with a Freshwater Station.
         * This endpoint allows for full CRUD operations on Hall instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the hall.
         * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
         * - `freshwater_station__in`: Filter by multiple Freshwater Station IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by hall name (partial matches).
         * - `description`: Search within the description of the hall.
         * - `freshwater_station__name`: Search by the name of the associated Freshwater Station.
         *
         * **Ordering:**
         * - `name` (default)
         * - `freshwater_station__name`: Order by the name of the associated Freshwater Station.
         * - `created_at`
         * @param active
         * @param freshwaterStation
         * @param freshwaterStationIn Multiple values may be separated by commas.
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedHallList
         * @throws ApiError
         */
        public static apiV1InfrastructureHallsList(
            active?: boolean,
            freshwaterStation?: number,
            freshwaterStationIn?: Array<number>,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedHallList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/halls/',
                query: {
                    'active': active,
                    'freshwater_station': freshwaterStation,
                    'freshwater_station__in': freshwaterStationIn,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Halls within the aquaculture facility.
         *
         * Halls represent distinct buildings or sections within the facility,
         * often containing multiple containers or systems. They can be associated
         * with a Freshwater Station.
         * This endpoint allows for full CRUD operations on Hall instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the hall.
         * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
         * - `freshwater_station__in`: Filter by multiple Freshwater Station IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by hall name (partial matches).
         * - `description`: Search within the description of the hall.
         * - `freshwater_station__name`: Search by the name of the associated Freshwater Station.
         *
         * **Ordering:**
         * - `name` (default)
         * - `freshwater_station__name`: Order by the name of the associated Freshwater Station.
         * - `created_at`
         * @param requestBody
         * @returns Hall
         * @throws ApiError
         */
        public static apiV1InfrastructureHallsCreate(
            requestBody: Hall,
        ): CancelablePromise<Hall> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/halls/',
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
         * API endpoint for managing Halls within the aquaculture facility.
         *
         * Halls represent distinct buildings or sections within the facility,
         * often containing multiple containers or systems. They can be associated
         * with a Freshwater Station.
         * This endpoint allows for full CRUD operations on Hall instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the hall.
         * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
         * - `freshwater_station__in`: Filter by multiple Freshwater Station IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by hall name (partial matches).
         * - `description`: Search within the description of the hall.
         * - `freshwater_station__name`: Search by the name of the associated Freshwater Station.
         *
         * **Ordering:**
         * - `name` (default)
         * - `freshwater_station__name`: Order by the name of the associated Freshwater Station.
         * - `created_at`
         * @param id A unique integer value identifying this hall.
         * @param requestBody
         * @returns Hall
         * @throws ApiError
         */
        public static apiV1InfrastructureHallsUpdate(
            id: number,
            requestBody: Hall,
        ): CancelablePromise<Hall> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/halls/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Halls within the aquaculture facility.
         *
         * Halls represent distinct buildings or sections within the facility,
         * often containing multiple containers or systems. They can be associated
         * with a Freshwater Station.
         * This endpoint allows for full CRUD operations on Hall instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the hall.
         * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
         * - `freshwater_station__in`: Filter by multiple Freshwater Station IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by hall name (partial matches).
         * - `description`: Search within the description of the hall.
         * - `freshwater_station__name`: Search by the name of the associated Freshwater Station.
         *
         * **Ordering:**
         * - `name` (default)
         * - `freshwater_station__name`: Order by the name of the associated Freshwater Station.
         * - `created_at`
         * @param id A unique integer value identifying this hall.
         * @returns Hall
         * @throws ApiError
         */
        public static apiV1InfrastructureHallsRetrieve(
            id: number,
        ): CancelablePromise<Hall> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/halls/{id}/',
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
         * API endpoint for managing Halls within the aquaculture facility.
         *
         * Halls represent distinct buildings or sections within the facility,
         * often containing multiple containers or systems. They can be associated
         * with a Freshwater Station.
         * This endpoint allows for full CRUD operations on Hall instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the hall.
         * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
         * - `freshwater_station__in`: Filter by multiple Freshwater Station IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by hall name (partial matches).
         * - `description`: Search within the description of the hall.
         * - `freshwater_station__name`: Search by the name of the associated Freshwater Station.
         *
         * **Ordering:**
         * - `name` (default)
         * - `freshwater_station__name`: Order by the name of the associated Freshwater Station.
         * - `created_at`
         * @param id A unique integer value identifying this hall.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureHallsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/halls/{id}/',
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
         * API endpoint for managing Halls within the aquaculture facility.
         *
         * Halls represent distinct buildings or sections within the facility,
         * often containing multiple containers or systems. They can be associated
         * with a Freshwater Station.
         * This endpoint allows for full CRUD operations on Hall instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the hall.
         * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
         * - `freshwater_station__in`: Filter by multiple Freshwater Station IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by hall name (partial matches).
         * - `description`: Search within the description of the hall.
         * - `freshwater_station__name`: Search by the name of the associated Freshwater Station.
         *
         * **Ordering:**
         * - `name` (default)
         * - `freshwater_station__name`: Order by the name of the associated Freshwater Station.
         * - `created_at`
         * @param id A unique integer value identifying this hall.
         * @param requestBody
         * @returns Hall
         * @throws ApiError
         */
        public static apiV1InfrastructureHallsPartialUpdate(
            id: number,
            requestBody?: PatchedHall,
        ): CancelablePromise<Hall> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/halls/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Container Types.
         *
         * Container Types define the characteristics and categories of different containers
         * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
         * This endpoint allows for full CRUD operations on ContainerType instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container type.
         * - `category`: Filter by the category of the container type (e.g., TANK, POND, CAGE).
         *
         * **Searching:**
         * - `name`: Search by container type name (partial matches).
         * - `description`: Search within the description of the container type.
         *
         * **Ordering:**
         * - `name` (default)
         * - `category`
         * - `created_at`
         * @param category * `TANK` - Tank
         * * `PEN` - Pen
         * * `TRAY` - Tray
         * * `OTHER` - Other
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedContainerTypeList
         * @throws ApiError
         */
        public static apiV1InfrastructureContainerTypesList(
            category?: 'OTHER' | 'PEN' | 'TANK' | 'TRAY',
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedContainerTypeList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/container-types/',
                query: {
                    'category': category,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Container Types.
         *
         * Container Types define the characteristics and categories of different containers
         * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
         * This endpoint allows for full CRUD operations on ContainerType instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container type.
         * - `category`: Filter by the category of the container type (e.g., TANK, POND, CAGE).
         *
         * **Searching:**
         * - `name`: Search by container type name (partial matches).
         * - `description`: Search within the description of the container type.
         *
         * **Ordering:**
         * - `name` (default)
         * - `category`
         * - `created_at`
         * @param requestBody
         * @returns ContainerType
         * @throws ApiError
         */
        public static apiV1InfrastructureContainerTypesCreate(
            requestBody: ContainerType,
        ): CancelablePromise<ContainerType> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/container-types/',
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
         * API endpoint for managing Container Types.
         *
         * Container Types define the characteristics and categories of different containers
         * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
         * This endpoint allows for full CRUD operations on ContainerType instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container type.
         * - `category`: Filter by the category of the container type (e.g., TANK, POND, CAGE).
         *
         * **Searching:**
         * - `name`: Search by container type name (partial matches).
         * - `description`: Search within the description of the container type.
         *
         * **Ordering:**
         * - `name` (default)
         * - `category`
         * - `created_at`
         * @param id A unique integer value identifying this container type.
         * @param requestBody
         * @returns ContainerType
         * @throws ApiError
         */
        public static apiV1InfrastructureContainerTypesUpdate(
            id: number,
            requestBody: ContainerType,
        ): CancelablePromise<ContainerType> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/container-types/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Container Types.
         *
         * Container Types define the characteristics and categories of different containers
         * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
         * This endpoint allows for full CRUD operations on ContainerType instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container type.
         * - `category`: Filter by the category of the container type (e.g., TANK, POND, CAGE).
         *
         * **Searching:**
         * - `name`: Search by container type name (partial matches).
         * - `description`: Search within the description of the container type.
         *
         * **Ordering:**
         * - `name` (default)
         * - `category`
         * - `created_at`
         * @param id A unique integer value identifying this container type.
         * @returns ContainerType
         * @throws ApiError
         */
        public static apiV1InfrastructureContainerTypesRetrieve(
            id: number,
        ): CancelablePromise<ContainerType> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/container-types/{id}/',
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
         * API endpoint for managing Container Types.
         *
         * Container Types define the characteristics and categories of different containers
         * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
         * This endpoint allows for full CRUD operations on ContainerType instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container type.
         * - `category`: Filter by the category of the container type (e.g., TANK, POND, CAGE).
         *
         * **Searching:**
         * - `name`: Search by container type name (partial matches).
         * - `description`: Search within the description of the container type.
         *
         * **Ordering:**
         * - `name` (default)
         * - `category`
         * - `created_at`
         * @param id A unique integer value identifying this container type.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureContainerTypesDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/container-types/{id}/',
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
         * API endpoint for managing Container Types.
         *
         * Container Types define the characteristics and categories of different containers
         * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
         * This endpoint allows for full CRUD operations on ContainerType instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container type.
         * - `category`: Filter by the category of the container type (e.g., TANK, POND, CAGE).
         *
         * **Searching:**
         * - `name`: Search by container type name (partial matches).
         * - `description`: Search within the description of the container type.
         *
         * **Ordering:**
         * - `name` (default)
         * - `category`
         * - `created_at`
         * @param id A unique integer value identifying this container type.
         * @param requestBody
         * @returns ContainerType
         * @throws ApiError
         */
        public static apiV1InfrastructureContainerTypesPartialUpdate(
            id: number,
            requestBody?: PatchedContainerType,
        ): CancelablePromise<ContainerType> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/container-types/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Containers within the aquaculture facility.
         *
         * Containers represent physical units (e.g., tanks, ponds, cages) used for
         * holding aquatic organisms. They are associated with a specific container type,
         * and can be located within a Hall and an Area. This endpoint allows for
         * full CRUD operations on Container instances. Uses HistoryReasonMixin to capture
         * audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container.
         * - `container_type`: Filter by the ID of the ContainerType.
         * - `hall`: Filter by the ID of the parent Hall.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by container name (partial matches).
         * - `container_type__name`: Search by the name of the ContainerType.
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type__name`
         * - `created_at`
         * @param active
         * @param area
         * @param areaIn Multiple values may be separated by commas.
         * @param containerType
         * @param hall
         * @param hallIn Multiple values may be separated by commas.
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedContainerList
         * @throws ApiError
         */
        public static apiV1InfrastructureContainersList(
            active?: boolean,
            area?: number,
            areaIn?: Array<number>,
            containerType?: number,
            hall?: number,
            hallIn?: Array<number>,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedContainerList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/containers/',
                query: {
                    'active': active,
                    'area': area,
                    'area__in': areaIn,
                    'container_type': containerType,
                    'hall': hall,
                    'hall__in': hallIn,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Containers within the aquaculture facility.
         *
         * Containers represent physical units (e.g., tanks, ponds, cages) used for
         * holding aquatic organisms. They are associated with a specific container type,
         * and can be located within a Hall and an Area. This endpoint allows for
         * full CRUD operations on Container instances. Uses HistoryReasonMixin to capture
         * audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container.
         * - `container_type`: Filter by the ID of the ContainerType.
         * - `hall`: Filter by the ID of the parent Hall.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by container name (partial matches).
         * - `container_type__name`: Search by the name of the ContainerType.
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type__name`
         * - `created_at`
         * @param requestBody
         * @returns Container
         * @throws ApiError
         */
        public static apiV1InfrastructureContainersCreate(
            requestBody: Container,
        ): CancelablePromise<Container> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/containers/',
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
         * API endpoint for managing Containers within the aquaculture facility.
         *
         * Containers represent physical units (e.g., tanks, ponds, cages) used for
         * holding aquatic organisms. They are associated with a specific container type,
         * and can be located within a Hall and an Area. This endpoint allows for
         * full CRUD operations on Container instances. Uses HistoryReasonMixin to capture
         * audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container.
         * - `container_type`: Filter by the ID of the ContainerType.
         * - `hall`: Filter by the ID of the parent Hall.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by container name (partial matches).
         * - `container_type__name`: Search by the name of the ContainerType.
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type__name`
         * - `created_at`
         * @param id A unique integer value identifying this container.
         * @param requestBody
         * @returns Container
         * @throws ApiError
         */
        public static apiV1InfrastructureContainersUpdate(
            id: number,
            requestBody: Container,
        ): CancelablePromise<Container> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/containers/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Containers within the aquaculture facility.
         *
         * Containers represent physical units (e.g., tanks, ponds, cages) used for
         * holding aquatic organisms. They are associated with a specific container type,
         * and can be located within a Hall and an Area. This endpoint allows for
         * full CRUD operations on Container instances. Uses HistoryReasonMixin to capture
         * audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container.
         * - `container_type`: Filter by the ID of the ContainerType.
         * - `hall`: Filter by the ID of the parent Hall.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by container name (partial matches).
         * - `container_type__name`: Search by the name of the ContainerType.
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type__name`
         * - `created_at`
         * @param id A unique integer value identifying this container.
         * @returns Container
         * @throws ApiError
         */
        public static apiV1InfrastructureContainersRetrieve(
            id: number,
        ): CancelablePromise<Container> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/containers/{id}/',
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
         * API endpoint for managing Containers within the aquaculture facility.
         *
         * Containers represent physical units (e.g., tanks, ponds, cages) used for
         * holding aquatic organisms. They are associated with a specific container type,
         * and can be located within a Hall and an Area. This endpoint allows for
         * full CRUD operations on Container instances. Uses HistoryReasonMixin to capture
         * audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container.
         * - `container_type`: Filter by the ID of the ContainerType.
         * - `hall`: Filter by the ID of the parent Hall.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by container name (partial matches).
         * - `container_type__name`: Search by the name of the ContainerType.
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type__name`
         * - `created_at`
         * @param id A unique integer value identifying this container.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureContainersDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/containers/{id}/',
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
         * API endpoint for managing Containers within the aquaculture facility.
         *
         * Containers represent physical units (e.g., tanks, ponds, cages) used for
         * holding aquatic organisms. They are associated with a specific container type,
         * and can be located within a Hall and an Area. This endpoint allows for
         * full CRUD operations on Container instances. Uses HistoryReasonMixin to capture
         * audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the container.
         * - `container_type`: Filter by the ID of the ContainerType.
         * - `hall`: Filter by the ID of the parent Hall.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by container name (partial matches).
         * - `container_type__name`: Search by the name of the ContainerType.
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type__name`
         * - `created_at`
         * @param id A unique integer value identifying this container.
         * @param requestBody
         * @returns Container
         * @throws ApiError
         */
        public static apiV1InfrastructureContainersPartialUpdate(
            id: number,
            requestBody?: PatchedContainer,
        ): CancelablePromise<Container> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/containers/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Sensors within the aquaculture facility.
         *
         * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
         * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
         * type, have a unique serial number, and be associated with a manufacturer.
         * This endpoint allows for full CRUD operations on Sensor instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the sensor.
         * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
         * - `container`: Filter by the ID of the Container where the sensor is installed.
         * - `container__in`: Filter by multiple Container IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by sensor name (partial matches).
         * - `serial_number`: Search by the sensor's serial number.
         * - `manufacturer`: Search by the sensor's manufacturer.
         * - `container__name`: Search by the name of the Container where the sensor is installed.
         *
         * **Ordering:**
         * - `name` (default)
         * - `sensor_type`
         * - `container__name`: Order by the name of the associated Container.
         * - `created_at`
         * @param active
         * @param container
         * @param containerIn Multiple values may be separated by commas.
         * @param name
         * @param nameIcontains
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param sensorType * `TEMPERATURE` - Temperature
         * * `OXYGEN` - Oxygen
         * * `PH` - pH
         * * `SALINITY` - Salinity
         * * `CO2` - CO2
         * * `OTHER` - Other
         * @returns PaginatedSensorList
         * @throws ApiError
         */
        public static apiV1InfrastructureSensorsList(
            active?: boolean,
            container?: number,
            containerIn?: Array<number>,
            name?: string,
            nameIcontains?: string,
            ordering?: string,
            page?: number,
            search?: string,
            sensorType?: 'CO2' | 'OTHER' | 'OXYGEN' | 'PH' | 'SALINITY' | 'TEMPERATURE',
        ): CancelablePromise<PaginatedSensorList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/sensors/',
                query: {
                    'active': active,
                    'container': container,
                    'container__in': containerIn,
                    'name': name,
                    'name__icontains': nameIcontains,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'sensor_type': sensorType,
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
         * API endpoint for managing Sensors within the aquaculture facility.
         *
         * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
         * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
         * type, have a unique serial number, and be associated with a manufacturer.
         * This endpoint allows for full CRUD operations on Sensor instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the sensor.
         * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
         * - `container`: Filter by the ID of the Container where the sensor is installed.
         * - `container__in`: Filter by multiple Container IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by sensor name (partial matches).
         * - `serial_number`: Search by the sensor's serial number.
         * - `manufacturer`: Search by the sensor's manufacturer.
         * - `container__name`: Search by the name of the Container where the sensor is installed.
         *
         * **Ordering:**
         * - `name` (default)
         * - `sensor_type`
         * - `container__name`: Order by the name of the associated Container.
         * - `created_at`
         * @param requestBody
         * @returns Sensor
         * @throws ApiError
         */
        public static apiV1InfrastructureSensorsCreate(
            requestBody: Sensor,
        ): CancelablePromise<Sensor> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/sensors/',
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
         * API endpoint for managing Sensors within the aquaculture facility.
         *
         * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
         * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
         * type, have a unique serial number, and be associated with a manufacturer.
         * This endpoint allows for full CRUD operations on Sensor instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the sensor.
         * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
         * - `container`: Filter by the ID of the Container where the sensor is installed.
         * - `container__in`: Filter by multiple Container IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by sensor name (partial matches).
         * - `serial_number`: Search by the sensor's serial number.
         * - `manufacturer`: Search by the sensor's manufacturer.
         * - `container__name`: Search by the name of the Container where the sensor is installed.
         *
         * **Ordering:**
         * - `name` (default)
         * - `sensor_type`
         * - `container__name`: Order by the name of the associated Container.
         * - `created_at`
         * @param id A unique integer value identifying this sensor.
         * @param requestBody
         * @returns Sensor
         * @throws ApiError
         */
        public static apiV1InfrastructureSensorsUpdate(
            id: number,
            requestBody: Sensor,
        ): CancelablePromise<Sensor> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/sensors/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Sensors within the aquaculture facility.
         *
         * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
         * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
         * type, have a unique serial number, and be associated with a manufacturer.
         * This endpoint allows for full CRUD operations on Sensor instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the sensor.
         * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
         * - `container`: Filter by the ID of the Container where the sensor is installed.
         * - `container__in`: Filter by multiple Container IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by sensor name (partial matches).
         * - `serial_number`: Search by the sensor's serial number.
         * - `manufacturer`: Search by the sensor's manufacturer.
         * - `container__name`: Search by the name of the Container where the sensor is installed.
         *
         * **Ordering:**
         * - `name` (default)
         * - `sensor_type`
         * - `container__name`: Order by the name of the associated Container.
         * - `created_at`
         * @param id A unique integer value identifying this sensor.
         * @returns Sensor
         * @throws ApiError
         */
        public static apiV1InfrastructureSensorsRetrieve(
            id: number,
        ): CancelablePromise<Sensor> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/sensors/{id}/',
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
         * API endpoint for managing Sensors within the aquaculture facility.
         *
         * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
         * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
         * type, have a unique serial number, and be associated with a manufacturer.
         * This endpoint allows for full CRUD operations on Sensor instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the sensor.
         * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
         * - `container`: Filter by the ID of the Container where the sensor is installed.
         * - `container__in`: Filter by multiple Container IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by sensor name (partial matches).
         * - `serial_number`: Search by the sensor's serial number.
         * - `manufacturer`: Search by the sensor's manufacturer.
         * - `container__name`: Search by the name of the Container where the sensor is installed.
         *
         * **Ordering:**
         * - `name` (default)
         * - `sensor_type`
         * - `container__name`: Order by the name of the associated Container.
         * - `created_at`
         * @param id A unique integer value identifying this sensor.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureSensorsDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/sensors/{id}/',
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
         * API endpoint for managing Sensors within the aquaculture facility.
         *
         * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
         * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
         * type, have a unique serial number, and be associated with a manufacturer.
         * This endpoint allows for full CRUD operations on Sensor instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the sensor.
         * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
         * - `container`: Filter by the ID of the Container where the sensor is installed.
         * - `container__in`: Filter by multiple Container IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by sensor name (partial matches).
         * - `serial_number`: Search by the sensor's serial number.
         * - `manufacturer`: Search by the sensor's manufacturer.
         * - `container__name`: Search by the name of the Container where the sensor is installed.
         *
         * **Ordering:**
         * - `name` (default)
         * - `sensor_type`
         * - `container__name`: Order by the name of the associated Container.
         * - `created_at`
         * @param id A unique integer value identifying this sensor.
         * @param requestBody
         * @returns Sensor
         * @throws ApiError
         */
        public static apiV1InfrastructureSensorsPartialUpdate(
            id: number,
            requestBody?: PatchedSensor,
        ): CancelablePromise<Sensor> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/sensors/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Feed Containers within the aquaculture facility.
         *
         * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
         * storing feed. They can be associated with a specific container type (defining
         * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
         * This endpoint allows for full CRUD operations on FeedContainer instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the feed container.
         * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
         * - `container_type__in`: Filter by multiple Container Type IDs (comma-separated).
         * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area where the feed container is located.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by feed container name (partial matches).
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type`: Order by the type of the feed container.
         * - `created_at`
         * @param active
         * @param area
         * @param areaIn Multiple values may be separated by commas.
         * @param containerType * `SILO` - Silo
         * * `BARGE` - Barge
         * * `TANK` - Tank
         * * `OTHER` - Other
         * @param containerTypeIn Multiple values may be separated by commas.
         * @param hall
         * @param hallIn Multiple values may be separated by commas.
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedFeedContainerList
         * @throws ApiError
         */
        public static apiV1InfrastructureFeedContainersList(
            active?: boolean,
            area?: number,
            areaIn?: Array<number>,
            containerType?: 'BARGE' | 'OTHER' | 'SILO' | 'TANK',
            containerTypeIn?: Array<string>,
            hall?: number,
            hallIn?: Array<number>,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedFeedContainerList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/feed-containers/',
                query: {
                    'active': active,
                    'area': area,
                    'area__in': areaIn,
                    'container_type': containerType,
                    'container_type__in': containerTypeIn,
                    'hall': hall,
                    'hall__in': hallIn,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * API endpoint for managing Feed Containers within the aquaculture facility.
         *
         * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
         * storing feed. They can be associated with a specific container type (defining
         * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
         * This endpoint allows for full CRUD operations on FeedContainer instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the feed container.
         * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
         * - `container_type__in`: Filter by multiple Container Type IDs (comma-separated).
         * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area where the feed container is located.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by feed container name (partial matches).
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type`: Order by the type of the feed container.
         * - `created_at`
         * @param requestBody
         * @returns FeedContainer
         * @throws ApiError
         */
        public static apiV1InfrastructureFeedContainersCreate(
            requestBody: FeedContainer,
        ): CancelablePromise<FeedContainer> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/infrastructure/feed-containers/',
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
         * API endpoint for managing Feed Containers within the aquaculture facility.
         *
         * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
         * storing feed. They can be associated with a specific container type (defining
         * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
         * This endpoint allows for full CRUD operations on FeedContainer instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the feed container.
         * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
         * - `container_type__in`: Filter by multiple Container Type IDs (comma-separated).
         * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area where the feed container is located.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by feed container name (partial matches).
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type`: Order by the type of the feed container.
         * - `created_at`
         * @param id A unique integer value identifying this feed container.
         * @param requestBody
         * @returns FeedContainer
         * @throws ApiError
         */
        public static apiV1InfrastructureFeedContainersUpdate(
            id: number,
            requestBody: FeedContainer,
        ): CancelablePromise<FeedContainer> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/v1/infrastructure/feed-containers/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * API endpoint for managing Feed Containers within the aquaculture facility.
         *
         * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
         * storing feed. They can be associated with a specific container type (defining
         * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
         * This endpoint allows for full CRUD operations on FeedContainer instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the feed container.
         * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
         * - `container_type__in`: Filter by multiple Container Type IDs (comma-separated).
         * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area where the feed container is located.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by feed container name (partial matches).
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type`: Order by the type of the feed container.
         * - `created_at`
         * @param id A unique integer value identifying this feed container.
         * @returns FeedContainer
         * @throws ApiError
         */
        public static apiV1InfrastructureFeedContainersRetrieve(
            id: number,
        ): CancelablePromise<FeedContainer> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/feed-containers/{id}/',
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
         * API endpoint for managing Feed Containers within the aquaculture facility.
         *
         * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
         * storing feed. They can be associated with a specific container type (defining
         * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
         * This endpoint allows for full CRUD operations on FeedContainer instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the feed container.
         * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
         * - `container_type__in`: Filter by multiple Container Type IDs (comma-separated).
         * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area where the feed container is located.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by feed container name (partial matches).
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type`: Order by the type of the feed container.
         * - `created_at`
         * @param id A unique integer value identifying this feed container.
         * @returns void
         * @throws ApiError
         */
        public static apiV1InfrastructureFeedContainersDestroy(
            id: number,
        ): CancelablePromise<void> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/api/v1/infrastructure/feed-containers/{id}/',
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
         * API endpoint for managing Feed Containers within the aquaculture facility.
         *
         * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
         * storing feed. They can be associated with a specific container type (defining
         * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
         * This endpoint allows for full CRUD operations on FeedContainer instances. Uses
         * HistoryReasonMixin to capture audit change reasons.
         *
         * **Filtering:**
         * - `name`: Filter by the exact name of the feed container.
         * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
         * - `container_type__in`: Filter by multiple Container Type IDs (comma-separated).
         * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
         * - `hall__in`: Filter by multiple Hall IDs (comma-separated).
         * - `area`: Filter by the ID of the parent Area where the feed container is located.
         * - `area__in`: Filter by multiple Area IDs (comma-separated).
         * - `active`: Filter by active status (boolean).
         *
         * **Searching:**
         * - `name`: Search by feed container name (partial matches).
         * - `hall__name`: Search by the name of the parent Hall.
         * - `area__name`: Search by the name of the parent Area.
         *
         * **Ordering:**
         * - `name` (default)
         * - `container_type`: Order by the type of the feed container.
         * - `created_at`
         * @param id A unique integer value identifying this feed container.
         * @param requestBody
         * @returns FeedContainer
         * @throws ApiError
         */
        public static apiV1InfrastructureFeedContainersPartialUpdate(
            id: number,
            requestBody?: PatchedFeedContainer,
        ): CancelablePromise<FeedContainer> {
            return __request(OpenAPI, {
                method: 'PATCH',
                url: '/api/v1/infrastructure/feed-containers/{id}/',
                path: {
                    'id': id,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Bad request (validation error)`,
                    401: `Unauthorized`,
                    403: `Forbidden`,
                    404: `Not Found`,
                    500: `Internal Server Error`,
                },
            });
        }
        /**
         * List historical records with enhanced OpenAPI documentation.
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param description
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedGeographyHistoryList
         * @throws ApiError
         */
        public static listInfrastructureGeographyHistory(
            dateFrom?: string,
            dateTo?: string,
            description?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedGeographyHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/geographies/',
                query: {
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'description': description,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for Geography historical records.
         * @param historyId A unique integer value identifying this historical geography.
         * @returns GeographyHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureGeographyHistoryDetail(
            historyId: number,
        ): CancelablePromise<GeographyHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/geographies/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param active
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param geography
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedAreaHistoryList
         * @throws ApiError
         */
        public static listInfrastructureAreaHistory(
            active?: boolean,
            dateFrom?: string,
            dateTo?: string,
            geography?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedAreaHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/areas/',
                query: {
                    'active': active,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'geography': geography,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for Area historical records.
         * @param historyId A unique integer value identifying this historical area.
         * @returns AreaHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureAreaHistoryDetail(
            historyId: number,
        ): CancelablePromise<AreaHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/areas/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param active
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param geography
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param stationType * `FRESHWATER` - Freshwater
         * * `BROODSTOCK` - Broodstock
         * @returns PaginatedFreshwaterStationHistoryList
         * @throws ApiError
         */
        public static listInfrastructureFreshwaterStationHistory(
            active?: boolean,
            dateFrom?: string,
            dateTo?: string,
            geography?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
            stationType?: 'BROODSTOCK' | 'FRESHWATER',
        ): CancelablePromise<PaginatedFreshwaterStationHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/freshwater-stations/',
                query: {
                    'active': active,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'geography': geography,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'station_type': stationType,
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
         * ViewSet for FreshwaterStation historical records.
         * @param historyId A unique integer value identifying this historical freshwater station.
         * @returns FreshwaterStationHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureFreshwaterStationHistoryDetail(
            historyId: number,
        ): CancelablePromise<FreshwaterStationHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/freshwater-stations/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param active
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param freshwaterStation
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedHallHistoryList
         * @throws ApiError
         */
        public static listInfrastructureHallHistory(
            active?: boolean,
            dateFrom?: string,
            dateTo?: string,
            freshwaterStation?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedHallHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/halls/',
                query: {
                    'active': active,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'freshwater_station': freshwaterStation,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for Hall historical records.
         * @param historyId A unique integer value identifying this historical hall.
         * @returns HallHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureHallHistoryDetail(
            historyId: number,
        ): CancelablePromise<HallHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/halls/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param category * `TANK` - Tank
         * * `PEN` - Pen
         * * `TRAY` - Tray
         * * `OTHER` - Other
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedContainerTypeHistoryList
         * @throws ApiError
         */
        public static listInfrastructureContainerTypeHistory(
            category?: 'OTHER' | 'PEN' | 'TANK' | 'TRAY',
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedContainerTypeHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/container-types/',
                query: {
                    'category': category,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for ContainerType historical records.
         * @param historyId A unique integer value identifying this historical container type.
         * @returns ContainerTypeHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureContainerTypeHistoryDetail(
            historyId: number,
        ): CancelablePromise<ContainerTypeHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/container-types/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param active
         * @param area
         * @param containerType
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param hall
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedContainerHistoryList
         * @throws ApiError
         */
        public static listInfrastructureContainerHistory(
            active?: boolean,
            area?: number,
            containerType?: number,
            dateFrom?: string,
            dateTo?: string,
            hall?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedContainerHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/containers/',
                query: {
                    'active': active,
                    'area': area,
                    'container_type': containerType,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'hall': hall,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for Container historical records.
         * @param historyId A unique integer value identifying this historical container.
         * @returns ContainerHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureContainerHistoryDetail(
            historyId: number,
        ): CancelablePromise<ContainerHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/containers/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param active
         * @param container
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param sensorType * `TEMPERATURE` - Temperature
         * * `OXYGEN` - Oxygen
         * * `PH` - pH
         * * `SALINITY` - Salinity
         * * `CO2` - CO2
         * * `OTHER` - Other
         * @returns PaginatedSensorHistoryList
         * @throws ApiError
         */
        public static listInfrastructureSensorHistory(
            active?: boolean,
            container?: number,
            dateFrom?: string,
            dateTo?: string,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
            sensorType?: 'CO2' | 'OTHER' | 'OXYGEN' | 'PH' | 'SALINITY' | 'TEMPERATURE',
        ): CancelablePromise<PaginatedSensorHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/sensors/',
                query: {
                    'active': active,
                    'container': container,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
                    'sensor_type': sensorType,
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
         * ViewSet for Sensor historical records.
         * @param historyId A unique integer value identifying this historical sensor.
         * @returns SensorHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureSensorHistoryDetail(
            historyId: number,
        ): CancelablePromise<SensorHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/sensors/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * List historical records with enhanced OpenAPI documentation.
         * @param active
         * @param area
         * @param containerType * `SILO` - Silo
         * * `BARGE` - Barge
         * * `TANK` - Tank
         * * `OTHER` - Other
         * @param dateFrom Filter records from this date onwards (inclusive)
         * @param dateTo Filter records up to this date (inclusive)
         * @param hall
         * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
         *
         * * `+` - Created
         * * `~` - Updated
         * * `-` - Deleted
         * @param historyUser Filter by username of the user who made the change
         * @param name
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedFeedContainerHistoryList
         * @throws ApiError
         */
        public static listInfrastructureFeedContainerHistory(
            active?: boolean,
            area?: number,
            containerType?: 'BARGE' | 'OTHER' | 'SILO' | 'TANK',
            dateFrom?: string,
            dateTo?: string,
            hall?: number,
            historyType?: '+' | '-' | '~',
            historyUser?: string,
            name?: string,
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedFeedContainerHistoryList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/feed-containers/',
                query: {
                    'active': active,
                    'area': area,
                    'container_type': containerType,
                    'date_from': dateFrom,
                    'date_to': dateTo,
                    'hall': hall,
                    'history_type': historyType,
                    'history_user': historyUser,
                    'name': name,
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for FeedContainer historical records.
         * @param historyId A unique integer value identifying this historical feed container.
         * @returns FeedContainerHistory
         * @throws ApiError
         */
        public static retrieveInfrastructureFeedContainerHistoryDetail(
            historyId: number,
        ): CancelablePromise<FeedContainerHistory> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/infrastructure/history/feed-containers/{history_id}/',
                path: {
                    'history_id': historyId,
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
         * ViewSet for temperature profiles with audit trail support.
         * @param ordering Which field to use when ordering the results.
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedTemperatureProfileList
         * @throws ApiError
         */
        public static apiV1ScenarioTemperatureProfilesList(
            ordering?: string,
            page?: number,
            search?: string,
        ): CancelablePromise<PaginatedTemperatureProfileList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/scenario/temperature-profiles/',
                query: {
                    'ordering': ordering,
                    'page': page,
                    'search': search,
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
         * ViewSet for temperature profiles with audit trail support.
         * @param requestBody
         * @returns TemperatureProfile
         * @throws ApiError
         */
        public static apiV1ScenarioTemperatureProfilesCreate(
            requestBody: TemperatureProfile,
        ): CancelablePromise<TemperatureProfile> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/v1/scenario/temperature-profiles/',
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
         * Create temperature profile from date ranges.
         *
         * Example request:
         * {
             * "profile_name": "Winter 2024",
             * "ranges": [
                 * {"start_date": "2024-01-01", "end_date": "2024-01-31", "value": 8.5},
                 * {"start_date": "2024-02-01", "end_date": "2024-02-28", "value": 9.0}
                 * ],
                 * "merge_adjacent": true,
                 * "fill_gaps": true,
                 * "interpolation_method": "linear"
                 * }
                 * @param requestBody
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesBulkDateRangesCreate(
                    requestBody: TemperatureProfile,
                ): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/temperature-profiles/bulk_date_ranges/',
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
                 * Download CSV template for temperature data.
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesDownloadTemplateRetrieve(): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/temperature-profiles/download_template/',
                        errors: {
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Upload temperature data from CSV file.
                 *
                 * Expected CSV format:
                 * date,temperature
                 * 2024-01-01,8.5
                 * 2024-01-02,8.7
                 * @param formData
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesUploadCsvCreate(
                    formData: TemperatureProfile,
                ): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/temperature-profiles/upload_csv/',
                        formData: formData,
                        mediaType: 'multipart/form-data',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * ViewSet for temperature profiles with audit trail support.
                 * @param profileId A unique integer value identifying this Temperature Profile.
                 * @param requestBody
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesUpdate(
                    profileId: number,
                    requestBody: TemperatureProfile,
                ): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'PUT',
                        url: '/api/v1/scenario/temperature-profiles/{profile_id}/',
                        path: {
                            'profile_id': profileId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * ViewSet for temperature profiles with audit trail support.
                 * @param profileId A unique integer value identifying this Temperature Profile.
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesRetrieve(
                    profileId: number,
                ): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/temperature-profiles/{profile_id}/',
                        path: {
                            'profile_id': profileId,
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
                 * ViewSet for temperature profiles with audit trail support.
                 * @param profileId A unique integer value identifying this Temperature Profile.
                 * @returns void
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesDestroy(
                    profileId: number,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/api/v1/scenario/temperature-profiles/{profile_id}/',
                        path: {
                            'profile_id': profileId,
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
                 * ViewSet for temperature profiles with audit trail support.
                 * @param profileId A unique integer value identifying this Temperature Profile.
                 * @param requestBody
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesPartialUpdate(
                    profileId: number,
                    requestBody?: PatchedTemperatureProfile,
                ): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'PATCH',
                        url: '/api/v1/scenario/temperature-profiles/{profile_id}/',
                        path: {
                            'profile_id': profileId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Get temperature statistics for a profile.
                 * @param profileId A unique integer value identifying this Temperature Profile.
                 * @returns TemperatureProfile
                 * @throws ApiError
                 */
                public static apiV1ScenarioTemperatureProfilesStatisticsRetrieve(
                    profileId: number,
                ): CancelablePromise<TemperatureProfile> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/temperature-profiles/{profile_id}/statistics/',
                        path: {
                            'profile_id': profileId,
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
                 * Enhanced ViewSet for TGC models with audit trail support.
                 * @param location
                 * @param ordering Which field to use when ordering the results.
                 * @param page A page number within the paginated result set.
                 * @param releasePeriod
                 * @param search A search term.
                 * @returns PaginatedTGCModelList
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsList(
                    location?: string,
                    ordering?: string,
                    page?: number,
                    releasePeriod?: string,
                    search?: string,
                ): CancelablePromise<PaginatedTGCModelList> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/tgc-models/',
                        query: {
                            'location': location,
                            'ordering': ordering,
                            'page': page,
                            'release_period': releasePeriod,
                            'search': search,
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
                 * Enhanced ViewSet for TGC models with audit trail support.
                 * @param requestBody
                 * @returns TGCModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsCreate(
                    requestBody: TGCModel,
                ): CancelablePromise<TGCModel> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/tgc-models/',
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
                 * Get predefined TGC model templates.
                 * @returns TGCModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsTemplatesRetrieve(): CancelablePromise<TGCModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/tgc-models/templates/',
                        errors: {
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models with audit trail support.
                 * @param modelId A unique integer value identifying this TGC Model.
                 * @param requestBody
                 * @returns TGCModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsUpdate(
                    modelId: number,
                    requestBody: TGCModel,
                ): CancelablePromise<TGCModel> {
                    return __request(OpenAPI, {
                        method: 'PUT',
                        url: '/api/v1/scenario/tgc-models/{model_id}/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models with audit trail support.
                 * @param modelId A unique integer value identifying this TGC Model.
                 * @returns TGCModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsRetrieve(
                    modelId: number,
                ): CancelablePromise<TGCModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/tgc-models/{model_id}/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for TGC models with audit trail support.
                 * @param modelId A unique integer value identifying this TGC Model.
                 * @returns void
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsDestroy(
                    modelId: number,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/api/v1/scenario/tgc-models/{model_id}/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for TGC models with audit trail support.
                 * @param modelId A unique integer value identifying this TGC Model.
                 * @param requestBody
                 * @returns TGCModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsPartialUpdate(
                    modelId: number,
                    requestBody?: PatchedTGCModel,
                ): CancelablePromise<TGCModel> {
                    return __request(OpenAPI, {
                        method: 'PATCH',
                        url: '/api/v1/scenario/tgc-models/{model_id}/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Duplicate a TGC model with a new name.
                 * @param modelId A unique integer value identifying this TGC Model.
                 * @param requestBody
                 * @returns TGCModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioTgcModelsDuplicateCreate(
                    modelId: number,
                    requestBody: TGCModel,
                ): CancelablePromise<TGCModel> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/tgc-models/{model_id}/duplicate/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models with audit trail support.
                 * @param ordering Which field to use when ordering the results.
                 * @param page A page number within the paginated result set.
                 * @param search A search term.
                 * @returns PaginatedFCRModelList
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsList(
                    ordering?: string,
                    page?: number,
                    search?: string,
                ): CancelablePromise<PaginatedFCRModelList> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/fcr-models/',
                        query: {
                            'ordering': ordering,
                            'page': page,
                            'search': search,
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
                 * Enhanced ViewSet for FCR models with audit trail support.
                 * @param requestBody
                 * @returns FCRModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsCreate(
                    requestBody: FCRModel,
                ): CancelablePromise<FCRModel> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/fcr-models/',
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
                 * Get predefined FCR model templates.
                 * @returns FCRModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsTemplatesRetrieve(): CancelablePromise<FCRModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/fcr-models/templates/',
                        errors: {
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models with audit trail support.
                 * @param modelId A unique integer value identifying this FCR Model.
                 * @param requestBody
                 * @returns FCRModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsUpdate(
                    modelId: number,
                    requestBody: FCRModel,
                ): CancelablePromise<FCRModel> {
                    return __request(OpenAPI, {
                        method: 'PUT',
                        url: '/api/v1/scenario/fcr-models/{model_id}/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models with audit trail support.
                 * @param modelId A unique integer value identifying this FCR Model.
                 * @returns FCRModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsRetrieve(
                    modelId: number,
                ): CancelablePromise<FCRModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/fcr-models/{model_id}/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for FCR models with audit trail support.
                 * @param modelId A unique integer value identifying this FCR Model.
                 * @returns void
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsDestroy(
                    modelId: number,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/api/v1/scenario/fcr-models/{model_id}/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for FCR models with audit trail support.
                 * @param modelId A unique integer value identifying this FCR Model.
                 * @param requestBody
                 * @returns FCRModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsPartialUpdate(
                    modelId: number,
                    requestBody?: PatchedFCRModel,
                ): CancelablePromise<FCRModel> {
                    return __request(OpenAPI, {
                        method: 'PATCH',
                        url: '/api/v1/scenario/fcr-models/{model_id}/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Get summary of stages for an FCR model.
                 * @param modelId A unique integer value identifying this FCR Model.
                 * @returns FCRModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioFcrModelsStageSummaryRetrieve(
                    modelId: number,
                ): CancelablePromise<FCRModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/fcr-models/{model_id}/stage_summary/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for mortality models with audit trail support.
                 * @param frequency Rate application frequency
                 *
                 * * `daily` - Daily
                 * * `weekly` - Weekly
                 * @param ordering Which field to use when ordering the results.
                 * @param page A page number within the paginated result set.
                 * @param search A search term.
                 * @returns PaginatedMortalityModelList
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsList(
                    frequency?: 'daily' | 'weekly',
                    ordering?: string,
                    page?: number,
                    search?: string,
                ): CancelablePromise<PaginatedMortalityModelList> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/mortality-models/',
                        query: {
                            'frequency': frequency,
                            'ordering': ordering,
                            'page': page,
                            'search': search,
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
                 * Enhanced ViewSet for mortality models with audit trail support.
                 * @param requestBody
                 * @returns MortalityModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsCreate(
                    requestBody: MortalityModel,
                ): CancelablePromise<MortalityModel> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/mortality-models/',
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
                 * Get predefined mortality model templates.
                 * @returns MortalityModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsTemplatesRetrieve(): CancelablePromise<MortalityModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/mortality-models/templates/',
                        errors: {
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models with audit trail support.
                 * @param modelId A unique integer value identifying this Mortality Model.
                 * @param requestBody
                 * @returns MortalityModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsUpdate(
                    modelId: number,
                    requestBody: MortalityModel,
                ): CancelablePromise<MortalityModel> {
                    return __request(OpenAPI, {
                        method: 'PUT',
                        url: '/api/v1/scenario/mortality-models/{model_id}/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models with audit trail support.
                 * @param modelId A unique integer value identifying this Mortality Model.
                 * @returns MortalityModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsRetrieve(
                    modelId: number,
                ): CancelablePromise<MortalityModel> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/mortality-models/{model_id}/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for mortality models with audit trail support.
                 * @param modelId A unique integer value identifying this Mortality Model.
                 * @returns void
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsDestroy(
                    modelId: number,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/api/v1/scenario/mortality-models/{model_id}/',
                        path: {
                            'model_id': modelId,
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
                 * Enhanced ViewSet for mortality models with audit trail support.
                 * @param modelId A unique integer value identifying this Mortality Model.
                 * @param requestBody
                 * @returns MortalityModel
                 * @throws ApiError
                 */
                public static apiV1ScenarioMortalityModelsPartialUpdate(
                    modelId: number,
                    requestBody?: PatchedMortalityModel,
                ): CancelablePromise<MortalityModel> {
                    return __request(OpenAPI, {
                        method: 'PATCH',
                        url: '/api/v1/scenario/mortality-models/{model_id}/',
                        path: {
                            'model_id': modelId,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * ViewSet for biological constraints with audit trail support.
                 * @param isActive
                 * @param page A page number within the paginated result set.
                 * @param search A search term.
                 * @returns PaginatedBiologicalConstraintsList
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsList(
                    isActive?: boolean,
                    page?: number,
                    search?: string,
                ): CancelablePromise<PaginatedBiologicalConstraintsList> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/biological-constraints/',
                        query: {
                            'is_active': isActive,
                            'page': page,
                            'search': search,
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
                 * ViewSet for biological constraints with audit trail support.
                 * @param requestBody
                 * @returns BiologicalConstraints
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsCreate(
                    requestBody: BiologicalConstraints,
                ): CancelablePromise<BiologicalConstraints> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/biological-constraints/',
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
                 * Get all active constraint sets.
                 * @returns BiologicalConstraints
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsActiveRetrieve(): CancelablePromise<Array<BiologicalConstraints>> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/biological-constraints/active/',
                        errors: {
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * ViewSet for biological constraints with audit trail support.
                 * @param id A unique integer value identifying this Biological Constraint Set.
                 * @param requestBody
                 * @returns BiologicalConstraints
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsUpdate(
                    id: number,
                    requestBody: BiologicalConstraints,
                ): CancelablePromise<BiologicalConstraints> {
                    return __request(OpenAPI, {
                        method: 'PUT',
                        url: '/api/v1/scenario/biological-constraints/{id}/',
                        path: {
                            'id': id,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * ViewSet for biological constraints with audit trail support.
                 * @param id A unique integer value identifying this Biological Constraint Set.
                 * @returns BiologicalConstraints
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsRetrieve(
                    id: number,
                ): CancelablePromise<BiologicalConstraints> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/biological-constraints/{id}/',
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
                 * ViewSet for biological constraints with audit trail support.
                 * @param id A unique integer value identifying this Biological Constraint Set.
                 * @returns void
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsDestroy(
                    id: number,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/api/v1/scenario/biological-constraints/{id}/',
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
                 * ViewSet for biological constraints with audit trail support.
                 * @param id A unique integer value identifying this Biological Constraint Set.
                 * @param requestBody
                 * @returns BiologicalConstraints
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsPartialUpdate(
                    id: number,
                    requestBody?: PatchedBiologicalConstraints,
                ): CancelablePromise<BiologicalConstraints> {
                    return __request(OpenAPI, {
                        method: 'PATCH',
                        url: '/api/v1/scenario/biological-constraints/{id}/',
                        path: {
                            'id': id,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `Bad request (validation error)`,
                            401: `Unauthorized`,
                            403: `Forbidden`,
                            404: `Not Found`,
                            500: `Internal Server Error`,
                        },
                    });
                }
                /**
                 * Enhanced ViewSet for scenarios with audit trail support.
                 * @param createdBy
                 * @param ordering Which field to use when ordering the results.
                 * @param page A page number within the paginated result set.
                 * @param search A search term.
                 * @param startDate
                 * @param tgcModelLocation
                 * @returns PaginatedScenarioList
                 * @throws ApiError
                 */
                public static apiV1ScenarioScenariosList(
                    createdBy?: number,
                    ordering?: string,
                    page?: number,
                    search?: string,
                    startDate?: string,
                    tgcModelLocation?: string,
                ): CancelablePromise<PaginatedScenarioList> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/scenarios/',
                        query: {
                            'created_by': createdBy,
                            'ordering': ordering,
                            'page': page,
                            'search': search,
                            'start_date': startDate,
                            'tgc_model__location': tgcModelLocation,
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
                 * Enhanced ViewSet for scenarios with audit trail support.
                 * @param requestBody
                 * @returns Scenario
                 * @throws ApiError
                 */
                public static apiV1ScenarioScenariosCreate(
                    requestBody: Scenario,
                ): CancelablePromise<Scenario> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/v1/scenario/scenarios/',
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
                 * Compare multiple scenarios.
                 *
                 * Request body:
                 * {
                     * "scenario_ids": [1, 2, 3],
                     * "comparison_metrics": ["final_weight", "final_biomass", "fcr_overall"]
                     * }
                     * @param requestBody
                     * @returns Scenario
                     * @throws ApiError
                     */
                    public static apiV1ScenarioScenariosCompareCreate(
                        requestBody: Scenario,
                    ): CancelablePromise<Scenario> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/v1/scenario/scenarios/compare/',
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
                     * Create a scenario initialized from a batch.
                     *
                     * Request body:
                     * {
                         * "batch_id": 123,
                         * "scenario_name": "Batch 123 Projection",
                         * "duration_days": 600,
                         * "use_current_models": true
                         * }
                         * @param requestBody
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosFromBatchCreate(
                            requestBody: Scenario,
                        ): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'POST',
                                url: '/api/v1/scenario/scenarios/from_batch/',
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
                         * Get summary statistics for user's scenarios.
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosSummaryStatsRetrieve(): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'GET',
                                url: '/api/v1/scenario/scenarios/summary_stats/',
                                errors: {
                                    401: `Unauthorized`,
                                    403: `Forbidden`,
                                    500: `Internal Server Error`,
                                },
                            });
                        }
                        /**
                         * Enhanced ViewSet for scenarios with audit trail support.
                         * @param scenarioId A unique integer value identifying this Scenario.
                         * @param requestBody
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosUpdate(
                            scenarioId: number,
                            requestBody: Scenario,
                        ): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'PUT',
                                url: '/api/v1/scenario/scenarios/{scenario_id}/',
                                path: {
                                    'scenario_id': scenarioId,
                                },
                                body: requestBody,
                                mediaType: 'application/json',
                                errors: {
                                    400: `Bad request (validation error)`,
                                    401: `Unauthorized`,
                                    403: `Forbidden`,
                                    404: `Not Found`,
                                    500: `Internal Server Error`,
                                },
                            });
                        }
                        /**
                         * Enhanced ViewSet for scenarios with audit trail support.
                         * @param scenarioId A unique integer value identifying this Scenario.
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosRetrieve(
                            scenarioId: number,
                        ): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'GET',
                                url: '/api/v1/scenario/scenarios/{scenario_id}/',
                                path: {
                                    'scenario_id': scenarioId,
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
                         * Enhanced ViewSet for scenarios with audit trail support.
                         * @param scenarioId A unique integer value identifying this Scenario.
                         * @returns void
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosDestroy(
                            scenarioId: number,
                        ): CancelablePromise<void> {
                            return __request(OpenAPI, {
                                method: 'DELETE',
                                url: '/api/v1/scenario/scenarios/{scenario_id}/',
                                path: {
                                    'scenario_id': scenarioId,
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
                         * Enhanced ViewSet for scenarios with audit trail support.
                         * @param scenarioId A unique integer value identifying this Scenario.
                         * @param requestBody
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosPartialUpdate(
                            scenarioId: number,
                            requestBody?: PatchedScenario,
                        ): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'PATCH',
                                url: '/api/v1/scenario/scenarios/{scenario_id}/',
                                path: {
                                    'scenario_id': scenarioId,
                                },
                                body: requestBody,
                                mediaType: 'application/json',
                                errors: {
                                    400: `Bad request (validation error)`,
                                    401: `Unauthorized`,
                                    403: `Forbidden`,
                                    404: `Not Found`,
                                    500: `Internal Server Error`,
                                },
                            });
                        }
                        /**
                         * Get projection data formatted for charts.
                         * @param scenarioId A unique integer value identifying this Scenario.
                         * @param aggregation Temporal aggregation for chart data (daily, weekly, monthly).
                         * @param chartType Chart visualization type (line, area, or bar).
                         * @param metrics Comma-separated metrics to include (weight, population, biomass, feed, temperature).
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosChartDataRetrieve(
                            scenarioId: number,
                            aggregation: 'daily' | 'monthly' | 'weekly' = 'daily',
                            chartType: 'area' | 'bar' | 'line' = 'line',
                            metrics?: string,
                        ): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'GET',
                                url: '/api/v1/scenario/scenarios/{scenario_id}/chart_data/',
                                path: {
                                    'scenario_id': scenarioId,
                                },
                                query: {
                                    'aggregation': aggregation,
                                    'chart_type': chartType,
                                    'metrics': metrics,
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
                         * Duplicate a scenario with a new name.
                         *
                         * Request body:
                         * {
                             * "new_name": "Scenario Copy",
                             * "include_projections": false,
                             * "include_model_changes": true
                             * }
                             * @param scenarioId A unique integer value identifying this Scenario.
                             * @param requestBody
                             * @returns Scenario
                             * @throws ApiError
                             */
                            public static apiV1ScenarioScenariosDuplicateCreate(
                                scenarioId: number,
                                requestBody: Scenario,
                            ): CancelablePromise<Scenario> {
                                return __request(OpenAPI, {
                                    method: 'POST',
                                    url: '/api/v1/scenario/scenarios/{scenario_id}/duplicate/',
                                    path: {
                                        'scenario_id': scenarioId,
                                    },
                                    body: requestBody,
                                    mediaType: 'application/json',
                                    errors: {
                                        400: `Bad request (validation error)`,
                                        401: `Unauthorized`,
                                        403: `Forbidden`,
                                        404: `Not Found`,
                                        500: `Internal Server Error`,
                                    },
                                });
                            }
                            /**
                             * Export projections as CSV.
                             * @param scenarioId A unique integer value identifying this Scenario.
                             * @returns Scenario
                             * @throws ApiError
                             */
                            public static apiV1ScenarioScenariosExportProjectionsRetrieve(
                                scenarioId: number,
                            ): CancelablePromise<Scenario> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/v1/scenario/scenarios/{scenario_id}/export_projections/',
                                    path: {
                                        'scenario_id': scenarioId,
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
                             * Get projections for a scenario with optional filtering.
                             * @param scenarioId A unique integer value identifying this Scenario.
                             * @param aggregation Aggregation granularity for projections (daily, weekly, monthly).
                             * @param createdBy
                             * @param endDate Filter projections at or before this date (YYYY-MM-DD).
                             * @param ordering Which field to use when ordering the results.
                             * @param page A page number within the paginated result set.
                             * @param search A search term.
                             * @param startDate Filter projections at or after this date (YYYY-MM-DD).
                             * @param tgcModelLocation
                             * @returns PaginatedScenarioProjectionList
                             * @throws ApiError
                             */
                            public static apiV1ScenarioScenariosProjectionsList(
                                scenarioId: number,
                                aggregation: 'daily' | 'monthly' | 'weekly' = 'daily',
                                createdBy?: number,
                                endDate?: string,
                                ordering?: string,
                                page?: number,
                                search?: string,
                                startDate?: string,
                                tgcModelLocation?: string,
                            ): CancelablePromise<PaginatedScenarioProjectionList> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/v1/scenario/scenarios/{scenario_id}/projections/',
                                    path: {
                                        'scenario_id': scenarioId,
                                    },
                                    query: {
                                        'aggregation': aggregation,
                                        'created_by': createdBy,
                                        'end_date': endDate,
                                        'ordering': ordering,
                                        'page': page,
                                        'search': search,
                                        'start_date': startDate,
                                        'tgc_model__location': tgcModelLocation,
                                    },
                                    errors: {
                                        400: `Bad request (validation error)`,
                                        401: `Unauthorized`,
                                        403: `Forbidden`,
                                        404: `Not Found`,
                                        500: `Internal Server Error`,
                                    },
                                });
                            }
                            /**
                             * Run projection calculation for a scenario.
                             *
                             * Returns projection summary and saves results to database.
                             * @param scenarioId A unique integer value identifying this Scenario.
                             * @param requestBody
                             * @returns Scenario
                             * @throws ApiError
                             */
                            public static apiV1ScenarioScenariosRunProjectionCreate(
                                scenarioId: number,
                                requestBody: Scenario,
                            ): CancelablePromise<Scenario> {
                                return __request(OpenAPI, {
                                    method: 'POST',
                                    url: '/api/v1/scenario/scenarios/{scenario_id}/run_projection/',
                                    path: {
                                        'scenario_id': scenarioId,
                                    },
                                    body: requestBody,
                                    mediaType: 'application/json',
                                    errors: {
                                        400: `Bad request (validation error)`,
                                        401: `Unauthorized`,
                                        403: `Forbidden`,
                                        404: `Not Found`,
                                        500: `Internal Server Error`,
                                    },
                                });
                            }
                            /**
                             * Run sensitivity analysis on a scenario parameter.
                             *
                             * Request body:
                             * {
                                 * "parameter": "tgc",  // or "fcr" or "mortality"
                                 * "variations": [-10, -5, 0, 5, 10]  // percentage variations
                                 * }
                                 * @param scenarioId A unique integer value identifying this Scenario.
                                 * @param requestBody
                                 * @returns Scenario
                                 * @throws ApiError
                                 */
                                public static apiV1ScenarioScenariosSensitivityAnalysisCreate(
                                    scenarioId: number,
                                    requestBody: Scenario,
                                ): CancelablePromise<Scenario> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/scenario/scenarios/{scenario_id}/sensitivity_analysis/',
                                        path: {
                                            'scenario_id': scenarioId,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `Bad request (validation error)`,
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            404: `Not Found`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Download CSV template for specified data type.
                                 *
                                 * Query params:
                                 * - data_type: 'temperature', 'fcr', or 'mortality'
                                 * - include_sample_data: true/false
                                 * @param dataType Type of template to download (temperature, fcr, mortality).
                                 * @param includeSampleData Include sample rows in the generated template.
                                 * @returns any CSV template file
                                 * @throws ApiError
                                 */
                                public static apiV1ScenarioDataEntryCsvTemplateRetrieve(
                                    dataType: 'fcr' | 'mortality' | 'temperature',
                                    includeSampleData: boolean = false,
                                ): CancelablePromise<any> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/scenario/data-entry/csv_template/',
                                        query: {
                                            'data_type': dataType,
                                            'include_sample_data': includeSampleData,
                                        },
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Check status of recent imports.
                                 * @returns CSVUpload
                                 * @throws ApiError
                                 */
                                public static apiV1ScenarioDataEntryImportStatusRetrieve(): CancelablePromise<CSVUpload> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/scenario/data-entry/import_status/',
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Validate CSV file without saving.
                                 *
                                 * Returns preview data and any validation errors/warnings.
                                 * @param requestBody
                                 * @returns CSVUpload
                                 * @throws ApiError
                                 */
                                public static apiV1ScenarioDataEntryValidateCsvCreate(
                                    requestBody: CSVUpload,
                                ): CancelablePromise<CSVUpload> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/scenario/data-entry/validate_csv/',
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
                                 * Get FCR trends for a specific container assignment.
                                 *
                                 * Args:
                                 * assignment_id: Assignment ID from URL path
                                 * @param assignmentId Container assignment ID to retrieve FCR trends for.
                                 * @param endDate End date for the trend analysis (YYYY-MM-DD).
                                 * @param includePredicted Include predicted FCR values (default: true).
                                 * @param interval Aggregation interval (DAILY, WEEKLY, or MONTHLY).
                                 * @param startDate Start date for the trend analysis (YYYY-MM-DD).
                                 * @returns FCRTrends
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalFcrTrendsAssignmentTrendsRetrieve(
                                    assignmentId: number,
                                    endDate?: string,
                                    includePredicted: boolean = true,
                                    interval: 'DAILY' | 'MONTHLY' | 'WEEKLY' = 'DAILY',
                                    startDate?: string,
                                ): CancelablePromise<FCRTrends> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/fcr-trends/assignment_trends/',
                                        query: {
                                            'assignment_id': assignmentId,
                                            'end_date': endDate,
                                            'include_predicted': includePredicted,
                                            'interval': interval,
                                            'start_date': startDate,
                                        },
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Get FCR trends for a specific batch.
                                 *
                                 * Args:
                                 * batch_id: Batch ID from URL path
                                 * @param batchId Batch ID to retrieve FCR trends for.
                                 * @param endDate End date for the trend analysis (YYYY-MM-DD).
                                 * @param includePredicted Include predicted FCR values (default: true).
                                 * @param interval Aggregation interval (DAILY, WEEKLY, or MONTHLY).
                                 * @param startDate Start date for the trend analysis (YYYY-MM-DD).
                                 * @returns FCRTrends
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalFcrTrendsBatchTrendsRetrieve(
                                    batchId: number,
                                    endDate?: string,
                                    includePredicted: boolean = true,
                                    interval: 'DAILY' | 'MONTHLY' | 'WEEKLY' = 'DAILY',
                                    startDate?: string,
                                ): CancelablePromise<FCRTrends> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/fcr-trends/batch_trends/',
                                        query: {
                                            'batch_id': batchId,
                                            'end_date': endDate,
                                            'include_predicted': includePredicted,
                                            'interval': interval,
                                            'start_date': startDate,
                                        },
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Get FCR trends for a specific geography.
                                 *
                                 * Args:
                                 * geography_id: Geography ID from URL path
                                 * @param geographyId Geography ID to retrieve FCR trends for.
                                 * @param endDate End date for the trend analysis (YYYY-MM-DD).
                                 * @param includePredicted Include predicted FCR values (default: true).
                                 * @param interval Aggregation interval (DAILY, WEEKLY, or MONTHLY).
                                 * @param startDate Start date for the trend analysis (YYYY-MM-DD).
                                 * @returns FCRTrends
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalFcrTrendsGeographyTrendsRetrieve(
                                    geographyId: number,
                                    endDate?: string,
                                    includePredicted: boolean = true,
                                    interval: 'DAILY' | 'MONTHLY' | 'WEEKLY' = 'DAILY',
                                    startDate?: string,
                                ): CancelablePromise<FCRTrends> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/fcr-trends/geography_trends/',
                                        query: {
                                            'end_date': endDate,
                                            'geography_id': geographyId,
                                            'include_predicted': includePredicted,
                                            'interval': interval,
                                            'start_date': startDate,
                                        },
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * List harvest events
                                 * Retrieve harvest events with optional filtering by batch, assignment, destination, date range, or document reference.
                                 * @param assignment Filter events by assignment ID.
                                 * @param batch Filter events by batch ID.
                                 * @param dateFrom Include events on or after this ISO 8601 timestamp.
                                 * @param dateTo Include events on or before this ISO 8601 timestamp.
                                 * @param destGeography Filter events by destination geography ID.
                                 * @param destSubsidiary Filter events by destination subsidiary code.
                                 * @param documentRef Filter events whose document reference contains this value (case-insensitive).
                                 * @param ordering Which field to use when ordering the results.
                                 * @param page A page number within the paginated result set.
                                 * @param search A search term.
                                 * @returns PaginatedHarvestEventList
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalHarvestEventsList(
                                    assignment?: number,
                                    batch?: number,
                                    dateFrom?: string,
                                    dateTo?: string,
                                    destGeography?: number,
                                    destSubsidiary?: string,
                                    documentRef?: string,
                                    ordering?: string,
                                    page?: number,
                                    search?: string,
                                ): CancelablePromise<PaginatedHarvestEventList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/harvest-events/',
                                        query: {
                                            'assignment': assignment,
                                            'batch': batch,
                                            'date_from': dateFrom,
                                            'date_to': dateTo,
                                            'dest_geography': destGeography,
                                            'dest_subsidiary': destSubsidiary,
                                            'document_ref': documentRef,
                                            'ordering': ordering,
                                            'page': page,
                                            'search': search,
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
                                 * Read-only access to harvest events.
                                 * @param id A unique integer value identifying this harvest event.
                                 * @returns HarvestEvent
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalHarvestEventsRetrieve(
                                    id: number,
                                ): CancelablePromise<HarvestEvent> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/harvest-events/{id}/',
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
                                 * List harvest lots
                                 * Retrieve harvest lots with optional filtering by event or product grade.
                                 * @param event Filter lots by harvest event ID.
                                 * @param grade Filter lots by product grade code (case insensitive).
                                 * @param ordering Which field to use when ordering the results.
                                 * @param page A page number within the paginated result set.
                                 * @param productGrade Filter lots by product grade ID.
                                 * @param search A search term.
                                 * @returns PaginatedHarvestLotList
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalHarvestLotsList(
                                    event?: number,
                                    grade?: string,
                                    ordering?: string,
                                    page?: number,
                                    productGrade?: number,
                                    search?: string,
                                ): CancelablePromise<PaginatedHarvestLotList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/harvest-lots/',
                                        query: {
                                            'event': event,
                                            'grade': grade,
                                            'ordering': ordering,
                                            'page': page,
                                            'product_grade': productGrade,
                                            'search': search,
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
                                 * Read-only access to harvest lots.
                                 * @param id A unique integer value identifying this harvest lot.
                                 * @returns HarvestLot
                                 * @throws ApiError
                                 */
                                public static apiV1OperationalHarvestLotsRetrieve(
                                    id: number,
                                ): CancelablePromise<HarvestLot> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/operational/harvest-lots/{id}/',
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
                                 * List finance harvest facts
                                 * Retrieve projected harvest facts with optional filters.
                                 * @param batch Filter by originating batch ID.
                                 * @param company Filter by finance company ID.
                                 * @param dateFrom Inclusive lower bound for event date.
                                 * @param dateTo Inclusive upper bound for event date.
                                 * @param grade Filter by product grade code (case insensitive).
                                 * @param ordering Ordering fields, e.g. '-event_date' or 'event_date'.
                                 * @param page A page number within the paginated result set.
                                 * @param pageSize Number of results to return per page.
                                 * @param site Filter by finance site ID.
                                 * @returns PaginatedFactHarvestList
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceFactsHarvestsList(
                                    batch?: number,
                                    company?: number,
                                    dateFrom?: string,
                                    dateTo?: string,
                                    grade?: string,
                                    ordering?: string,
                                    page?: number,
                                    pageSize?: number,
                                    site?: number,
                                ): CancelablePromise<PaginatedFactHarvestList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/finance/facts/harvests/',
                                        query: {
                                            'batch': batch,
                                            'company': company,
                                            'date_from': dateFrom,
                                            'date_to': dateTo,
                                            'grade': grade,
                                            'ordering': ordering,
                                            'page': page,
                                            'page_size': pageSize,
                                            'site': site,
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
                                 * Read-only access to finance harvest facts.
                                 * @param factId Unique finance fact identifier.
                                 * @returns FactHarvest
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceFactsHarvestsRetrieve(
                                    factId: number,
                                ): CancelablePromise<FactHarvest> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/finance/facts/harvests/{fact_id}/',
                                        path: {
                                            'fact_id': factId,
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
                                 * List intercompany transactions
                                 * Retrieve detected intercompany transactions with optional filters.
                                 * @param company Filter by finance company ID participating in the policy.
                                 * @param dateFrom Inclusive lower bound for posting date.
                                 * @param dateTo Inclusive upper bound for posting date.
                                 * @param ordering Ordering fields, e.g. '-posting_date'.
                                 * @param page A page number within the paginated result set.
                                 * @param pageSize Number of results to return per page.
                                 * @param state Filter by transaction state (pending, exported, posted).
                                 * @returns PaginatedIntercompanyTransactionList
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceIntercompanyTransactionsList(
                                    company?: number,
                                    dateFrom?: string,
                                    dateTo?: string,
                                    ordering?: string,
                                    page?: number,
                                    pageSize?: number,
                                    state?: string,
                                ): CancelablePromise<PaginatedIntercompanyTransactionList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/finance/intercompany/transactions/',
                                        query: {
                                            'company': company,
                                            'date_from': dateFrom,
                                            'date_to': dateTo,
                                            'ordering': ordering,
                                            'page': page,
                                            'page_size': pageSize,
                                            'state': state,
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
                                 * List pending approvals
                                 * Get all transactions in PENDING state awaiting approval. Useful for approval dashboards.
                                 * @param company Matches either from or to finance company ID
                                 * @param dateFrom Start of posting date range (inclusive)
                                 * @param dateTo End of posting date range (inclusive)
                                 * @param ordering Which field to use when ordering the results.
                                 * @param page A page number within the paginated result set.
                                 * @param pageSize Number of results to return per page.
                                 * @param state Transaction state
                                 * @returns PaginatedIntercompanyTransactionList
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceIntercompanyTransactionsPendingApprovalsList(
                                    company?: number,
                                    dateFrom?: string,
                                    dateTo?: string,
                                    ordering?: string,
                                    page?: number,
                                    pageSize?: number,
                                    state?: string,
                                ): CancelablePromise<PaginatedIntercompanyTransactionList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/finance/intercompany/transactions/pending-approvals/',
                                        query: {
                                            'company': company,
                                            'date_from': dateFrom,
                                            'date_to': dateTo,
                                            'ordering': ordering,
                                            'page': page,
                                            'page_size': pageSize,
                                            'state': state,
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
                                 * Read-only access to intercompany transactions.
                                 * @param txId Unique intercompany transaction identifier.
                                 * @returns IntercompanyTransaction
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceIntercompanyTransactionsRetrieve(
                                    txId: number,
                                ): CancelablePromise<IntercompanyTransaction> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/finance/intercompany/transactions/{tx_id}/',
                                        path: {
                                            'tx_id': txId,
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
                                 * Approve intercompany transaction
                                 * Approve a pending intercompany transaction. Transitions state from PENDING to POSTED. Only Finance Managers can approve transactions.
                                 * @param txId A unique integer value identifying this intercompany transaction.
                                 * @returns IntercompanyTransaction
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceIntercompanyTransactionsApproveCreate(
                                    txId: number,
                                ): CancelablePromise<IntercompanyTransaction> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/finance/intercompany/transactions/{tx_id}/approve/',
                                        path: {
                                            'tx_id': txId,
                                        },
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Create NAV export batch
                                 * Batch pending intercompany transactions into a NAV journal.
                                 * @param requestBody
                                 * @param force Set true to regenerate an existing batch for the same filters.
                                 * @returns NavExportBatch
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceNavExportsCreate(
                                    requestBody: NavExportBatchCreate,
                                    force?: boolean,
                                ): CancelablePromise<NavExportBatch> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/finance/nav-exports/',
                                        query: {
                                            'force': force,
                                        },
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
                                 * Download NAV export batch
                                 * Create NAV export batches and stream journal files.
                                 * @param batchId A unique integer value identifying this nav export batch.
                                 * @returns binary CSV journal file
                                 * @throws ApiError
                                 */
                                public static apiV1FinanceNavExportsDownloadRetrieve(
                                    batchId: number,
                                ): CancelablePromise<Blob> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/finance/nav-exports/{batch_id}/download/',
                                        path: {
                                            'batch_id': batchId,
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
                                 * Custom JWT token view that returns user information with tokens.
                                 *
                                 * Extends the standard JWT token endpoint to include user information
                                 * in the response.
                                 * @param requestBody
                                 * @returns CustomTokenObtainPair
                                 * @throws ApiError
                                 */
                                public static apiV1UsersAuthTokenCreate(
                                    requestBody: CustomTokenObtainPair,
                                ): CancelablePromise<CustomTokenObtainPair> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/users/auth/token/',
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
                                 * Takes a refresh type JSON web token and returns an access type JSON web
                                 * token if the refresh token is valid.
                                 * @param requestBody
                                 * @returns TokenRefresh
                                 * @throws ApiError
                                 */
                                public static apiV1UsersAuthTokenRefreshCreate(
                                    requestBody: TokenRefresh,
                                ): CancelablePromise<TokenRefresh> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/users/auth/token/refresh/',
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
                                 * API endpoint to view and update the user's profile with audit change reasons.
                                 *
                                 * Allows users to view and update their own profile information.
                                 * @returns UserProfile
                                 * @throws ApiError
                                 */
                                public static apiV1UsersAuthProfileRetrieve(): CancelablePromise<UserProfile> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/auth/profile/',
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * API endpoint to view and update the user's profile with audit change reasons.
                                 *
                                 * Allows users to view and update their own profile information.
                                 * @param requestBody
                                 * @returns UserProfileUpdate
                                 * @throws ApiError
                                 */
                                public static apiV1UsersAuthProfileUpdate(
                                    requestBody?: UserProfileUpdate,
                                ): CancelablePromise<UserProfileUpdate> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/v1/users/auth/profile/',
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
                                 * API endpoint to view and update the user's profile with audit change reasons.
                                 *
                                 * Allows users to view and update their own profile information.
                                 * @param requestBody
                                 * @returns UserProfileUpdate
                                 * @throws ApiError
                                 */
                                public static apiV1UsersAuthProfilePartialUpdate(
                                    requestBody?: PatchedUserProfileUpdate,
                                ): CancelablePromise<UserProfileUpdate> {
                                    return __request(OpenAPI, {
                                        method: 'PATCH',
                                        url: '/api/v1/users/auth/profile/',
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
                                 * API endpoint that allows users to be viewed, created, edited or deleted while capturing audit change reasons.
                                 *
                                 * Provides CRUD operations for users with appropriate permission checks.
                                 * @param ordering Which field to use when ordering the results.
                                 * @param page A page number within the paginated result set.
                                 * @param search A search term.
                                 * @returns PaginatedUserList
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersList(
                                    ordering?: string,
                                    page?: number,
                                    search?: string,
                                ): CancelablePromise<PaginatedUserList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/users/',
                                        query: {
                                            'ordering': ordering,
                                            'page': page,
                                            'search': search,
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
                                 * API endpoint that allows users to be viewed, created, edited or deleted while capturing audit change reasons.
                                 *
                                 * Provides CRUD operations for users with appropriate permission checks.
                                 * @param requestBody
                                 * @returns UserCreate
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersCreate(
                                    requestBody: UserCreate,
                                ): CancelablePromise<UserCreate> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/v1/users/users/',
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
                                 * Endpoint to change user's password.
                                 *
                                 * Validates old password and updates with new password.
                                 *
                                 * Returns:
                                 * Response: Success or error message
                                 * @param requestBody
                                 * @returns User
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersChangePasswordUpdate(
                                    requestBody: User,
                                ): CancelablePromise<User> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/v1/users/users/change_password/',
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
                                 * Endpoint to retrieve the currently authenticated user.
                                 *
                                 * Returns:
                                 * Response: Serialized data of the current user
                                 * @returns User
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersMeRetrieve(): CancelablePromise<User> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/users/me/',
                                        errors: {
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted while capturing audit change reasons.
                                 *
                                 * Provides CRUD operations for users with appropriate permission checks.
                                 * @param id A unique integer value identifying this user.
                                 * @param requestBody
                                 * @returns User
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersUpdate(
                                    id: number,
                                    requestBody: User,
                                ): CancelablePromise<User> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/v1/users/users/{id}/',
                                        path: {
                                            'id': id,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `Bad request (validation error)`,
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            404: `Not Found`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted while capturing audit change reasons.
                                 *
                                 * Provides CRUD operations for users with appropriate permission checks.
                                 * @param id A unique integer value identifying this user.
                                 * @returns User
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersRetrieve(
                                    id: number,
                                ): CancelablePromise<User> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/users/{id}/',
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
                                 * API endpoint that allows users to be viewed, created, edited or deleted while capturing audit change reasons.
                                 *
                                 * Provides CRUD operations for users with appropriate permission checks.
                                 * @param id A unique integer value identifying this user.
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersDestroy(
                                    id: number,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/v1/users/users/{id}/',
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
                                 * API endpoint that allows users to be viewed, created, edited or deleted while capturing audit change reasons.
                                 *
                                 * Provides CRUD operations for users with appropriate permission checks.
                                 * @param id A unique integer value identifying this user.
                                 * @param requestBody
                                 * @returns User
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersPartialUpdate(
                                    id: number,
                                    requestBody?: PatchedUser,
                                ): CancelablePromise<User> {
                                    return __request(OpenAPI, {
                                        method: 'PATCH',
                                        url: '/api/v1/users/users/{id}/',
                                        path: {
                                            'id': id,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `Bad request (validation error)`,
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            404: `Not Found`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * Admin-only endpoint to update user profile including RBAC fields.
                                 *
                                 * Allows administrators to modify role, geography, and subsidiary
                                 * fields which are restricted for regular users to prevent
                                 * privilege escalation.
                                 *
                                 * Args:
                                 * pk: User ID to update
                                 *
                                 * Returns:
                                 * Response: Updated user profile data or error messages
                                 * @param id A unique integer value identifying this user.
                                 * @param requestBody
                                 * @returns User
                                 * @throws ApiError
                                 */
                                public static apiV1UsersUsersAdminUpdatePartialUpdate(
                                    id: number,
                                    requestBody?: PatchedUser,
                                ): CancelablePromise<User> {
                                    return __request(OpenAPI, {
                                        method: 'PATCH',
                                        url: '/api/v1/users/users/{id}/admin_update/',
                                        path: {
                                            'id': id,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `Bad request (validation error)`,
                                            401: `Unauthorized`,
                                            403: `Forbidden`,
                                            404: `Not Found`,
                                            500: `Internal Server Error`,
                                        },
                                    });
                                }
                                /**
                                 * List historical records with enhanced OpenAPI documentation.
                                 * @param dateFrom Filter records from this date onwards (inclusive)
                                 * @param dateTo Filter records up to this date (inclusive)
                                 * @param geography Geographic region access level
                                 *
                                 * * `FO` - Faroe Islands
                                 * * `SC` - Scotland
                                 * * `ALL` - All Geographies
                                 * @param historyType Filter by type of change: + (Created), ~ (Updated), - (Deleted)
                                 *
                                 * * `+` - Created
                                 * * `~` - Updated
                                 * * `-` - Deleted
                                 * @param historyUser Filter by username of the user who made the change
                                 * @param ordering Which field to use when ordering the results.
                                 * @param page A page number within the paginated result set.
                                 * @param role User role and permission level
                                 *
                                 * * `ADMIN` - Administrator
                                 * * `MGR` - Manager
                                 * * `OPR` - Operator
                                 * * `VET` - Veterinarian
                                 * * `QA` - Quality Assurance
                                 * * `FIN` - Finance
                                 * * `VIEW` - Viewer
                                 * @param search A search term.
                                 * @param subsidiary Subsidiary access level
                                 *
                                 * * `BS` - Broodstock
                                 * * `FW` - Freshwater
                                 * * `FM` - Farming
                                 * * `LG` - Logistics
                                 * * `ALL` - All Subsidiaries
                                 * @param user
                                 * @returns PaginatedUserProfileHistoryList
                                 * @throws ApiError
                                 */
                                public static listUsersUserProfileHistory(
                                    dateFrom?: string,
                                    dateTo?: string,
                                    geography?: 'ALL' | 'FO' | 'SC',
                                    historyType?: '+' | '-' | '~',
                                    historyUser?: string,
                                    ordering?: string,
                                    page?: number,
                                    role?: 'ADMIN' | 'FIN' | 'MGR' | 'OPR' | 'QA' | 'VET' | 'VIEW',
                                    search?: string,
                                    subsidiary?: 'ALL' | 'BS' | 'FM' | 'FW' | 'LG',
                                    user?: number,
                                ): CancelablePromise<PaginatedUserProfileHistoryList> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/history/user-profiles/',
                                        query: {
                                            'date_from': dateFrom,
                                            'date_to': dateTo,
                                            'geography': geography,
                                            'history_type': historyType,
                                            'history_user': historyUser,
                                            'ordering': ordering,
                                            'page': page,
                                            'role': role,
                                            'search': search,
                                            'subsidiary': subsidiary,
                                            'user': user,
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
                                 * ViewSet for UserProfile historical records.
                                 * @param historyId A unique integer value identifying this historical user profile.
                                 * @returns UserProfileHistory
                                 * @throws ApiError
                                 */
                                public static retrieveUsersUserProfileHistoryDetail(
                                    historyId: number,
                                ): CancelablePromise<UserProfileHistory> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/history/user-profiles/{history_id}/',
                                        path: {
                                            'history_id': historyId,
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
                                 * Takes a set of user credentials and returns an access and refresh JSON web
                                 * token pair to prove the authentication of those credentials.
                                 * @param requestBody
                                 * @returns TokenObtainPair
                                 * @throws ApiError
                                 */
                                public static apiTokenCreate(
                                    requestBody: TokenObtainPair,
                                ): CancelablePromise<TokenObtainPair> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/token/',
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
                                 * Takes a refresh type JSON web token and returns an access type JSON web
                                 * token if the refresh token is valid.
                                 * @param requestBody
                                 * @returns TokenRefresh
                                 * @throws ApiError
                                 */
                                public static apiTokenRefreshCreate(
                                    requestBody: TokenRefresh,
                                ): CancelablePromise<TokenRefresh> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/token/refresh/',
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
                            }
