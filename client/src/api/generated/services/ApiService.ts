/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Area } from '../models/Area';
import type { Batch } from '../models/Batch';
import type { BatchComposition } from '../models/BatchComposition';
import type { BatchContainerAssignment } from '../models/BatchContainerAssignment';
import type { BatchFeedingSummary } from '../models/BatchFeedingSummary';
import type { BatchParentage } from '../models/BatchParentage';
import type { BatchTransfer } from '../models/BatchTransfer';
import type { BiologicalConstraints } from '../models/BiologicalConstraints';
import type { BreedingPair } from '../models/BreedingPair';
import type { BreedingPlan } from '../models/BreedingPlan';
import type { BreedingTraitPriority } from '../models/BreedingTraitPriority';
import type { BroodstockFish } from '../models/BroodstockFish';
import type { Container } from '../models/Container';
import type { ContainerType } from '../models/ContainerType';
import type { CSVUpload } from '../models/CSVUpload';
import type { CustomTokenObtainPair } from '../models/CustomTokenObtainPair';
import type { EggProduction } from '../models/EggProduction';
import type { EggProductionDetail } from '../models/EggProductionDetail';
import type { EggSupplier } from '../models/EggSupplier';
import type { EnvironmentalParameter } from '../models/EnvironmentalParameter';
import type { EnvironmentalReading } from '../models/EnvironmentalReading';
import type { ExternalEggBatch } from '../models/ExternalEggBatch';
import type { FCRModel } from '../models/FCRModel';
import type { Feed } from '../models/Feed';
import type { FeedContainer } from '../models/FeedContainer';
import type { FeedContainerStock } from '../models/FeedContainerStock';
import type { FeedContainerStockCreate } from '../models/FeedContainerStockCreate';
import type { FeedingEvent } from '../models/FeedingEvent';
import type { FeedPurchase } from '../models/FeedPurchase';
import type { FeedStock } from '../models/FeedStock';
import type { FishMovement } from '../models/FishMovement';
import type { FishParameterScore } from '../models/FishParameterScore';
import type { FreshwaterStation } from '../models/FreshwaterStation';
import type { Geography } from '../models/Geography';
import type { GrowthSample } from '../models/GrowthSample';
import type { Hall } from '../models/Hall';
import type { HealthLabSample } from '../models/HealthLabSample';
import type { HealthParameter } from '../models/HealthParameter';
import type { HealthSamplingEvent } from '../models/HealthSamplingEvent';
import type { IndividualFishObservation } from '../models/IndividualFishObservation';
import type { JournalEntry } from '../models/JournalEntry';
import type { LiceCount } from '../models/LiceCount';
import type { LifeCycleStage } from '../models/LifeCycleStage';
import type { MaintenanceTask } from '../models/MaintenanceTask';
import type { MortalityEvent } from '../models/MortalityEvent';
import type { MortalityModel } from '../models/MortalityModel';
import type { MortalityReason } from '../models/MortalityReason';
import type { MortalityRecord } from '../models/MortalityRecord';
import type { PaginatedAreaList } from '../models/PaginatedAreaList';
import type { PaginatedBatchCompositionList } from '../models/PaginatedBatchCompositionList';
import type { PaginatedBatchContainerAssignmentList } from '../models/PaginatedBatchContainerAssignmentList';
import type { PaginatedBatchFeedingSummaryList } from '../models/PaginatedBatchFeedingSummaryList';
import type { PaginatedBatchList } from '../models/PaginatedBatchList';
import type { PaginatedBatchParentageList } from '../models/PaginatedBatchParentageList';
import type { PaginatedBatchTransferList } from '../models/PaginatedBatchTransferList';
import type { PaginatedBiologicalConstraintsList } from '../models/PaginatedBiologicalConstraintsList';
import type { PaginatedBreedingPairList } from '../models/PaginatedBreedingPairList';
import type { PaginatedBreedingPlanList } from '../models/PaginatedBreedingPlanList';
import type { PaginatedBreedingTraitPriorityList } from '../models/PaginatedBreedingTraitPriorityList';
import type { PaginatedBroodstockFishList } from '../models/PaginatedBroodstockFishList';
import type { PaginatedContainerList } from '../models/PaginatedContainerList';
import type { PaginatedContainerTypeList } from '../models/PaginatedContainerTypeList';
import type { PaginatedEggProductionList } from '../models/PaginatedEggProductionList';
import type { PaginatedEggSupplierList } from '../models/PaginatedEggSupplierList';
import type { PaginatedEnvironmentalParameterList } from '../models/PaginatedEnvironmentalParameterList';
import type { PaginatedEnvironmentalReadingList } from '../models/PaginatedEnvironmentalReadingList';
import type { PaginatedExternalEggBatchList } from '../models/PaginatedExternalEggBatchList';
import type { PaginatedFCRModelList } from '../models/PaginatedFCRModelList';
import type { PaginatedFeedContainerList } from '../models/PaginatedFeedContainerList';
import type { PaginatedFeedContainerStockList } from '../models/PaginatedFeedContainerStockList';
import type { PaginatedFeedingEventList } from '../models/PaginatedFeedingEventList';
import type { PaginatedFeedList } from '../models/PaginatedFeedList';
import type { PaginatedFeedPurchaseList } from '../models/PaginatedFeedPurchaseList';
import type { PaginatedFeedStockList } from '../models/PaginatedFeedStockList';
import type { PaginatedFishMovementList } from '../models/PaginatedFishMovementList';
import type { PaginatedFishParameterScoreList } from '../models/PaginatedFishParameterScoreList';
import type { PaginatedFreshwaterStationList } from '../models/PaginatedFreshwaterStationList';
import type { PaginatedGeographyList } from '../models/PaginatedGeographyList';
import type { PaginatedGrowthSampleList } from '../models/PaginatedGrowthSampleList';
import type { PaginatedHallList } from '../models/PaginatedHallList';
import type { PaginatedHealthLabSampleList } from '../models/PaginatedHealthLabSampleList';
import type { PaginatedHealthParameterList } from '../models/PaginatedHealthParameterList';
import type { PaginatedHealthSamplingEventList } from '../models/PaginatedHealthSamplingEventList';
import type { PaginatedIndividualFishObservationList } from '../models/PaginatedIndividualFishObservationList';
import type { PaginatedJournalEntryList } from '../models/PaginatedJournalEntryList';
import type { PaginatedLiceCountList } from '../models/PaginatedLiceCountList';
import type { PaginatedLifeCycleStageList } from '../models/PaginatedLifeCycleStageList';
import type { PaginatedMaintenanceTaskList } from '../models/PaginatedMaintenanceTaskList';
import type { PaginatedMortalityEventList } from '../models/PaginatedMortalityEventList';
import type { PaginatedMortalityModelList } from '../models/PaginatedMortalityModelList';
import type { PaginatedMortalityReasonList } from '../models/PaginatedMortalityReasonList';
import type { PaginatedMortalityRecordList } from '../models/PaginatedMortalityRecordList';
import type { PaginatedPhotoperiodDataList } from '../models/PaginatedPhotoperiodDataList';
import type { PaginatedSampleTypeList } from '../models/PaginatedSampleTypeList';
import type { PaginatedScenarioList } from '../models/PaginatedScenarioList';
import type { PaginatedSensorList } from '../models/PaginatedSensorList';
import type { PaginatedSpeciesList } from '../models/PaginatedSpeciesList';
import type { PaginatedStageTransitionEnvironmentalList } from '../models/PaginatedStageTransitionEnvironmentalList';
import type { PaginatedTemperatureProfileList } from '../models/PaginatedTemperatureProfileList';
import type { PaginatedTGCModelList } from '../models/PaginatedTGCModelList';
import type { PaginatedTreatmentList } from '../models/PaginatedTreatmentList';
import type { PaginatedUserList } from '../models/PaginatedUserList';
import type { PaginatedVaccinationTypeList } from '../models/PaginatedVaccinationTypeList';
import type { PaginatedWeatherDataList } from '../models/PaginatedWeatherDataList';
import type { PatchedArea } from '../models/PatchedArea';
import type { PatchedBatch } from '../models/PatchedBatch';
import type { PatchedBatchComposition } from '../models/PatchedBatchComposition';
import type { PatchedBatchContainerAssignment } from '../models/PatchedBatchContainerAssignment';
import type { PatchedBatchParentage } from '../models/PatchedBatchParentage';
import type { PatchedBatchTransfer } from '../models/PatchedBatchTransfer';
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
import type { PatchedFeedStock } from '../models/PatchedFeedStock';
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
import type { PatchedPhotoperiodData } from '../models/PatchedPhotoperiodData';
import type { PatchedSampleType } from '../models/PatchedSampleType';
import type { PatchedScenario } from '../models/PatchedScenario';
import type { PatchedSensor } from '../models/PatchedSensor';
import type { PatchedSpecies } from '../models/PatchedSpecies';
import type { PatchedStageTransitionEnvironmental } from '../models/PatchedStageTransitionEnvironmental';
import type { PatchedTemperatureProfile } from '../models/PatchedTemperatureProfile';
import type { PatchedTGCModel } from '../models/PatchedTGCModel';
import type { PatchedTreatment } from '../models/PatchedTreatment';
import type { PatchedUser } from '../models/PatchedUser';
import type { PatchedUserProfileUpdate } from '../models/PatchedUserProfileUpdate';
import type { PatchedVaccinationType } from '../models/PatchedVaccinationType';
import type { PatchedWeatherData } from '../models/PatchedWeatherData';
import type { PhotoperiodData } from '../models/PhotoperiodData';
import type { SampleType } from '../models/SampleType';
import type { Scenario } from '../models/Scenario';
import type { Sensor } from '../models/Sensor';
import type { Species } from '../models/Species';
import type { StageTransitionEnvironmental } from '../models/StageTransitionEnvironmental';
import type { TemperatureProfile } from '../models/TemperatureProfile';
import type { TGCModel } from '../models/TGCModel';
import type { TokenObtainPair } from '../models/TokenObtainPair';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { Treatment } from '../models/Treatment';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserProfile } from '../models/UserProfile';
import type { UserProfileUpdate } from '../models/UserProfileUpdate';
import type { VaccinationType } from '../models/VaccinationType';
import type { WeatherData } from '../models/WeatherData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiService {
    /**
     * API endpoint for managing Geographical locations or zones.
     *
     * Geographies represent defined geographical areas relevant to the aquaculture
     * operations, such as countries, regions, specific water bodies, or custom zones.
     * These can be used to associate other entities (like facilities or environmental
     * readings) with a spatial context.
     * This endpoint allows for full CRUD operations on Geography instances.
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
        });
    }
    /**
     * API endpoint for managing Geographical locations or zones.
     *
     * Geographies represent defined geographical areas relevant to the aquaculture
     * operations, such as countries, regions, specific water bodies, or custom zones.
     * These can be used to associate other entities (like facilities or environmental
     * readings) with a spatial context.
     * This endpoint allows for full CRUD operations on Geography instances.
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
        });
    }
    /**
     * API endpoint for managing Geographical locations or zones.
     *
     * Geographies represent defined geographical areas relevant to the aquaculture
     * operations, such as countries, regions, specific water bodies, or custom zones.
     * These can be used to associate other entities (like facilities or environmental
     * readings) with a spatial context.
     * This endpoint allows for full CRUD operations on Geography instances.
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
        });
    }
    /**
     * API endpoint for managing Geographical locations or zones.
     *
     * Geographies represent defined geographical areas relevant to the aquaculture
     * operations, such as countries, regions, specific water bodies, or custom zones.
     * These can be used to associate other entities (like facilities or environmental
     * readings) with a spatial context.
     * This endpoint allows for full CRUD operations on Geography instances.
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
        });
    }
    /**
     * API endpoint for managing Geographical locations or zones.
     *
     * Geographies represent defined geographical areas relevant to the aquaculture
     * operations, such as countries, regions, specific water bodies, or custom zones.
     * These can be used to associate other entities (like facilities or environmental
     * readings) with a spatial context.
     * This endpoint allows for full CRUD operations on Geography instances.
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
        });
    }
    /**
     * API endpoint for managing Geographical locations or zones.
     *
     * Geographies represent defined geographical areas relevant to the aquaculture
     * operations, such as countries, regions, specific water bodies, or custom zones.
     * These can be used to associate other entities (like facilities or environmental
     * readings) with a spatial context.
     * This endpoint allows for full CRUD operations on Geography instances.
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
        });
    }
    /**
     * API endpoint for managing Areas within the aquaculture facility.
     *
     * Areas represent distinct geographical or functional zones within a larger geography
     * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
     * on Area instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the area.
     * - `geography`: Filter by the ID of the parent Geography.
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
     * @param name
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedAreaList
     * @throws ApiError
     */
    public static apiV1InfrastructureAreasList(
        active?: boolean,
        geography?: number,
        name?: string,
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
                'name': name,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Areas within the aquaculture facility.
     *
     * Areas represent distinct geographical or functional zones within a larger geography
     * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
     * on Area instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the area.
     * - `geography`: Filter by the ID of the parent Geography.
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
        });
    }
    /**
     * API endpoint for managing Areas within the aquaculture facility.
     *
     * Areas represent distinct geographical or functional zones within a larger geography
     * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
     * on Area instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the area.
     * - `geography`: Filter by the ID of the parent Geography.
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
        });
    }
    /**
     * API endpoint for managing Areas within the aquaculture facility.
     *
     * Areas represent distinct geographical or functional zones within a larger geography
     * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
     * on Area instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the area.
     * - `geography`: Filter by the ID of the parent Geography.
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
        });
    }
    /**
     * API endpoint for managing Areas within the aquaculture facility.
     *
     * Areas represent distinct geographical or functional zones within a larger geography
     * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
     * on Area instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the area.
     * - `geography`: Filter by the ID of the parent Geography.
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
        });
    }
    /**
     * API endpoint for managing Areas within the aquaculture facility.
     *
     * Areas represent distinct geographical or functional zones within a larger geography
     * (e.g., a specific section of a farm). This endpoint allows for full CRUD operations
     * on Area instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the area.
     * - `geography`: Filter by the ID of the parent Geography.
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
        });
    }
    /**
     * API endpoint for managing Freshwater Stations.
     *
     * Freshwater Stations represent sources of freshwater for the aquaculture facility,
     * such as wells, boreholes, or municipal supplies. They can be categorized by type
     * and associated with a specific geographical location.
     * This endpoint allows for full CRUD operations on FreshwaterStation instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the freshwater station.
     * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
     * - `geography`: Filter by the ID of the associated Geography.
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
     * @param name
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
        name?: string,
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
                'name': name,
                'ordering': ordering,
                'page': page,
                'search': search,
                'station_type': stationType,
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
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the freshwater station.
     * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
     * - `geography`: Filter by the ID of the associated Geography.
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
        });
    }
    /**
     * API endpoint for managing Freshwater Stations.
     *
     * Freshwater Stations represent sources of freshwater for the aquaculture facility,
     * such as wells, boreholes, or municipal supplies. They can be categorized by type
     * and associated with a specific geographical location.
     * This endpoint allows for full CRUD operations on FreshwaterStation instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the freshwater station.
     * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
     * - `geography`: Filter by the ID of the associated Geography.
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
        });
    }
    /**
     * API endpoint for managing Freshwater Stations.
     *
     * Freshwater Stations represent sources of freshwater for the aquaculture facility,
     * such as wells, boreholes, or municipal supplies. They can be categorized by type
     * and associated with a specific geographical location.
     * This endpoint allows for full CRUD operations on FreshwaterStation instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the freshwater station.
     * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
     * - `geography`: Filter by the ID of the associated Geography.
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
        });
    }
    /**
     * API endpoint for managing Freshwater Stations.
     *
     * Freshwater Stations represent sources of freshwater for the aquaculture facility,
     * such as wells, boreholes, or municipal supplies. They can be categorized by type
     * and associated with a specific geographical location.
     * This endpoint allows for full CRUD operations on FreshwaterStation instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the freshwater station.
     * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
     * - `geography`: Filter by the ID of the associated Geography.
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
        });
    }
    /**
     * API endpoint for managing Freshwater Stations.
     *
     * Freshwater Stations represent sources of freshwater for the aquaculture facility,
     * such as wells, boreholes, or municipal supplies. They can be categorized by type
     * and associated with a specific geographical location.
     * This endpoint allows for full CRUD operations on FreshwaterStation instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the freshwater station.
     * - `station_type`: Filter by the type of station (e.g., WELL, BOREHOLE, MUNICIPAL).
     * - `geography`: Filter by the ID of the associated Geography.
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
        });
    }
    /**
     * API endpoint for managing Halls within the aquaculture facility.
     *
     * Halls represent distinct buildings or sections within the facility,
     * often containing multiple containers or systems. They can be associated
     * with a Freshwater Station.
     * This endpoint allows for full CRUD operations on Hall instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the hall.
     * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
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
                'name': name,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Halls within the aquaculture facility.
     *
     * Halls represent distinct buildings or sections within the facility,
     * often containing multiple containers or systems. They can be associated
     * with a Freshwater Station.
     * This endpoint allows for full CRUD operations on Hall instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the hall.
     * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
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
        });
    }
    /**
     * API endpoint for managing Halls within the aquaculture facility.
     *
     * Halls represent distinct buildings or sections within the facility,
     * often containing multiple containers or systems. They can be associated
     * with a Freshwater Station.
     * This endpoint allows for full CRUD operations on Hall instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the hall.
     * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
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
        });
    }
    /**
     * API endpoint for managing Halls within the aquaculture facility.
     *
     * Halls represent distinct buildings or sections within the facility,
     * often containing multiple containers or systems. They can be associated
     * with a Freshwater Station.
     * This endpoint allows for full CRUD operations on Hall instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the hall.
     * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
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
        });
    }
    /**
     * API endpoint for managing Halls within the aquaculture facility.
     *
     * Halls represent distinct buildings or sections within the facility,
     * often containing multiple containers or systems. They can be associated
     * with a Freshwater Station.
     * This endpoint allows for full CRUD operations on Hall instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the hall.
     * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
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
        });
    }
    /**
     * API endpoint for managing Halls within the aquaculture facility.
     *
     * Halls represent distinct buildings or sections within the facility,
     * often containing multiple containers or systems. They can be associated
     * with a Freshwater Station.
     * This endpoint allows for full CRUD operations on Hall instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the hall.
     * - `freshwater_station`: Filter by the ID of the associated Freshwater Station.
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
        });
    }
    /**
     * API endpoint for managing Container Types.
     *
     * Container Types define the characteristics and categories of different containers
     * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
     * This endpoint allows for full CRUD operations on ContainerType instances.
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
        });
    }
    /**
     * API endpoint for managing Container Types.
     *
     * Container Types define the characteristics and categories of different containers
     * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
     * This endpoint allows for full CRUD operations on ContainerType instances.
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
        });
    }
    /**
     * API endpoint for managing Container Types.
     *
     * Container Types define the characteristics and categories of different containers
     * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
     * This endpoint allows for full CRUD operations on ContainerType instances.
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
        });
    }
    /**
     * API endpoint for managing Container Types.
     *
     * Container Types define the characteristics and categories of different containers
     * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
     * This endpoint allows for full CRUD operations on ContainerType instances.
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
        });
    }
    /**
     * API endpoint for managing Container Types.
     *
     * Container Types define the characteristics and categories of different containers
     * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
     * This endpoint allows for full CRUD operations on ContainerType instances.
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
        });
    }
    /**
     * API endpoint for managing Container Types.
     *
     * Container Types define the characteristics and categories of different containers
     * used in the aquaculture facility (e.g., "Circular Tank - 5000L", "Rectangular Pond - 1 Ha").
     * This endpoint allows for full CRUD operations on ContainerType instances.
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
        });
    }
    /**
     * API endpoint for managing Containers within the aquaculture facility.
     *
     * Containers represent physical units (e.g., tanks, ponds, cages) used for
     * holding aquatic organisms. They are associated with a specific container type,
     * and can be located within a Hall and an Area. This endpoint allows for
     * full CRUD operations on Container instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the container.
     * - `container_type`: Filter by the ID of the ContainerType.
     * - `hall`: Filter by the ID of the parent Hall.
     * - `area`: Filter by the ID of the parent Area.
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
     * @param containerType
     * @param hall
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
        containerType?: number,
        hall?: number,
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
                'container_type': containerType,
                'hall': hall,
                'name': name,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Containers within the aquaculture facility.
     *
     * Containers represent physical units (e.g., tanks, ponds, cages) used for
     * holding aquatic organisms. They are associated with a specific container type,
     * and can be located within a Hall and an Area. This endpoint allows for
     * full CRUD operations on Container instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the container.
     * - `container_type`: Filter by the ID of the ContainerType.
     * - `hall`: Filter by the ID of the parent Hall.
     * - `area`: Filter by the ID of the parent Area.
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
        });
    }
    /**
     * API endpoint for managing Containers within the aquaculture facility.
     *
     * Containers represent physical units (e.g., tanks, ponds, cages) used for
     * holding aquatic organisms. They are associated with a specific container type,
     * and can be located within a Hall and an Area. This endpoint allows for
     * full CRUD operations on Container instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the container.
     * - `container_type`: Filter by the ID of the ContainerType.
     * - `hall`: Filter by the ID of the parent Hall.
     * - `area`: Filter by the ID of the parent Area.
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
        });
    }
    /**
     * API endpoint for managing Containers within the aquaculture facility.
     *
     * Containers represent physical units (e.g., tanks, ponds, cages) used for
     * holding aquatic organisms. They are associated with a specific container type,
     * and can be located within a Hall and an Area. This endpoint allows for
     * full CRUD operations on Container instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the container.
     * - `container_type`: Filter by the ID of the ContainerType.
     * - `hall`: Filter by the ID of the parent Hall.
     * - `area`: Filter by the ID of the parent Area.
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
        });
    }
    /**
     * API endpoint for managing Containers within the aquaculture facility.
     *
     * Containers represent physical units (e.g., tanks, ponds, cages) used for
     * holding aquatic organisms. They are associated with a specific container type,
     * and can be located within a Hall and an Area. This endpoint allows for
     * full CRUD operations on Container instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the container.
     * - `container_type`: Filter by the ID of the ContainerType.
     * - `hall`: Filter by the ID of the parent Hall.
     * - `area`: Filter by the ID of the parent Area.
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
        });
    }
    /**
     * API endpoint for managing Containers within the aquaculture facility.
     *
     * Containers represent physical units (e.g., tanks, ponds, cages) used for
     * holding aquatic organisms. They are associated with a specific container type,
     * and can be located within a Hall and an Area. This endpoint allows for
     * full CRUD operations on Container instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the container.
     * - `container_type`: Filter by the ID of the ContainerType.
     * - `hall`: Filter by the ID of the parent Hall.
     * - `area`: Filter by the ID of the parent Area.
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
        });
    }
    /**
     * API endpoint for managing Sensors within the aquaculture facility.
     *
     * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
     * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
     * type, have a unique serial number, and be associated with a manufacturer.
     * This endpoint allows for full CRUD operations on Sensor instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the sensor.
     * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
     * - `container`: Filter by the ID of the Container where the sensor is installed.
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
     * @returns PaginatedSensorList
     * @throws ApiError
     */
    public static apiV1InfrastructureSensorsList(
        active?: boolean,
        container?: number,
        name?: string,
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
                'name': name,
                'ordering': ordering,
                'page': page,
                'search': search,
                'sensor_type': sensorType,
            },
        });
    }
    /**
     * API endpoint for managing Sensors within the aquaculture facility.
     *
     * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
     * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
     * type, have a unique serial number, and be associated with a manufacturer.
     * This endpoint allows for full CRUD operations on Sensor instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the sensor.
     * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
     * - `container`: Filter by the ID of the Container where the sensor is installed.
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
        });
    }
    /**
     * API endpoint for managing Sensors within the aquaculture facility.
     *
     * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
     * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
     * type, have a unique serial number, and be associated with a manufacturer.
     * This endpoint allows for full CRUD operations on Sensor instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the sensor.
     * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
     * - `container`: Filter by the ID of the Container where the sensor is installed.
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
        });
    }
    /**
     * API endpoint for managing Sensors within the aquaculture facility.
     *
     * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
     * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
     * type, have a unique serial number, and be associated with a manufacturer.
     * This endpoint allows for full CRUD operations on Sensor instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the sensor.
     * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
     * - `container`: Filter by the ID of the Container where the sensor is installed.
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
        });
    }
    /**
     * API endpoint for managing Sensors within the aquaculture facility.
     *
     * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
     * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
     * type, have a unique serial number, and be associated with a manufacturer.
     * This endpoint allows for full CRUD operations on Sensor instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the sensor.
     * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
     * - `container`: Filter by the ID of the Container where the sensor is installed.
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
        });
    }
    /**
     * API endpoint for managing Sensors within the aquaculture facility.
     *
     * Sensors are devices used to monitor various environmental parameters (e.g., temperature,
     * pH, dissolved oxygen) within specific containers. Each sensor can be of a particular
     * type, have a unique serial number, and be associated with a manufacturer.
     * This endpoint allows for full CRUD operations on Sensor instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the sensor.
     * - `sensor_type`: Filter by the type of the sensor (e.g., TEMPERATURE, PH, DO).
     * - `container`: Filter by the ID of the Container where the sensor is installed.
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
        });
    }
    /**
     * API endpoint for managing Feed Containers within the aquaculture facility.
     *
     * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
     * storing feed. They can be associated with a specific container type (defining
     * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
     * This endpoint allows for full CRUD operations on FeedContainer instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the feed container.
     * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
     * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
     * - `area`: Filter by the ID of the parent Area where the feed container is located.
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
     * @param containerType * `SILO` - Silo
     * * `BARGE` - Barge
     * * `TANK` - Tank
     * * `OTHER` - Other
     * @param hall
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
        containerType?: 'BARGE' | 'OTHER' | 'SILO' | 'TANK',
        hall?: number,
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
                'container_type': containerType,
                'hall': hall,
                'name': name,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Feed Containers within the aquaculture facility.
     *
     * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
     * storing feed. They can be associated with a specific container type (defining
     * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
     * This endpoint allows for full CRUD operations on FeedContainer instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the feed container.
     * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
     * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
     * - `area`: Filter by the ID of the parent Area where the feed container is located.
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
        });
    }
    /**
     * API endpoint for managing Feed Containers within the aquaculture facility.
     *
     * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
     * storing feed. They can be associated with a specific container type (defining
     * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
     * This endpoint allows for full CRUD operations on FeedContainer instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the feed container.
     * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
     * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
     * - `area`: Filter by the ID of the parent Area where the feed container is located.
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
        });
    }
    /**
     * API endpoint for managing Feed Containers within the aquaculture facility.
     *
     * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
     * storing feed. They can be associated with a specific container type (defining
     * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
     * This endpoint allows for full CRUD operations on FeedContainer instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the feed container.
     * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
     * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
     * - `area`: Filter by the ID of the parent Area where the feed container is located.
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
        });
    }
    /**
     * API endpoint for managing Feed Containers within the aquaculture facility.
     *
     * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
     * storing feed. They can be associated with a specific container type (defining
     * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
     * This endpoint allows for full CRUD operations on FeedContainer instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the feed container.
     * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
     * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
     * - `area`: Filter by the ID of the parent Area where the feed container is located.
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
        });
    }
    /**
     * API endpoint for managing Feed Containers within the aquaculture facility.
     *
     * Feed Containers represent physical units (e.g., silos, hoppers, bags) used for
     * storing feed. They can be associated with a specific container type (defining
     * its nature, e.g., "Silo - 10 Ton"), and can be located within a Hall and an Area.
     * This endpoint allows for full CRUD operations on FeedContainer instances.
     *
     * **Filtering:**
     * - `name`: Filter by the exact name of the feed container.
     * - `container_type`: Filter by the ID of the feed container's type (e.g., Silo, Hopper).
     * - `hall`: Filter by the ID of the parent Hall where the feed container is located.
     * - `area`: Filter by the ID of the parent Area where the feed container is located.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
     * @param name
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param unit
     * @returns PaginatedEnvironmentalParameterList
     * @throws ApiError
     */
    public static apiV1EnvironmentalParametersList(
        name?: string,
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
                'ordering': ordering,
                'page': page,
                'search': search,
                'unit': unit,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalParameter instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * @param batch
     * @param container
     * @param isManual
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param parameter
     * @param search A search term.
     * @param sensor
     * @returns PaginatedEnvironmentalReadingList
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsList(
        batch?: number,
        container?: number,
        isManual?: boolean,
        ordering?: string,
        page?: number,
        parameter?: number,
        search?: string,
        sensor?: number,
    ): CancelablePromise<PaginatedEnvironmentalReadingList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/',
            query: {
                'batch': batch,
                'container': container,
                'is_manual': isManual,
                'ordering': ordering,
                'page': page,
                'parameter': parameter,
                'search': search,
                'sensor': sensor,
            },
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * Return the most recent readings for each parameter-container combination.
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsRecentRetrieve(): CancelablePromise<EnvironmentalReading> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/recent/',
        });
    }
    /**
     * Return aggregated statistics for readings based on query parameters.
     * @returns EnvironmentalReading
     * @throws ApiError
     */
    public static apiV1EnvironmentalReadingsStatsRetrieve(): CancelablePromise<EnvironmentalReading> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/readings/stats/',
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing EnvironmentalReading instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
     * @param area
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
                'date': date,
                'is_interpolated': isInterpolated,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing PhotoperiodData instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
     * @param area
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedWeatherDataList
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherList(
        area?: number,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedWeatherDataList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/weather/',
            query: {
                'area': area,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * Return the most recent weather data for each area.
     * @returns WeatherData
     * @throws ApiError
     */
    public static apiV1EnvironmentalWeatherRecentRetrieve(): CancelablePromise<WeatherData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/weather/recent/',
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing WeatherData instances.
     *
     * Includes special filtering and aggregation methods for time-series data.
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
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
     * @param batchTransfer
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedStageTransitionEnvironmentalList
     * @throws ApiError
     */
    public static apiV1EnvironmentalStageTransitionsList(
        batchTransfer?: number,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedStageTransitionEnvironmentalList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/environmental/stage-transitions/',
            query: {
                'batch_transfer': batchTransfer,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
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
        });
    }
    /**
     * ViewSet for viewing and editing StageTransitionEnvironmental instances.
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
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date.
     * @param name
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param scientificName
     * @param search A search term.
     * @returns PaginatedSpeciesList
     * @throws ApiError
     */
    public static apiV1BatchSpeciesList(
        name?: string,
        ordering?: string,
        page?: number,
        scientificName?: string,
        search?: string,
    ): CancelablePromise<PaginatedSpeciesList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/species/',
            query: {
                'name': name,
                'ordering': ordering,
                'page': page,
                'scientific_name': scientificName,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing aquaculture Species.
     *
     * Provides CRUD operations for species, including filtering by name
     * and scientific name, searching across name, scientific name, and description,
     * and ordering by name, scientific name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date.
     * @param name
     * @param order
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param species
     * @returns PaginatedLifeCycleStageList
     * @throws ApiError
     */
    public static apiV1BatchLifecycleStagesList(
        name?: string,
        order?: number,
        ordering?: string,
        page?: number,
        search?: string,
        species?: number,
    ): CancelablePromise<PaginatedLifeCycleStageList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/lifecycle-stages/',
            query: {
                'name': name,
                'order': order,
                'ordering': ordering,
                'page': page,
                'search': search,
                'species': species,
            },
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date.
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
        });
    }
    /**
     * API endpoint for managing Species Life Cycle Stages.
     *
     * Provides CRUD operations for life cycle stages, specific to a species.
     * Allows filtering by name, species, and order.
     * Supports searching across name, description, and species name.
     * Ordering can be done by species name, order, name, or creation date.
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
        });
    }
    /**
     * Retrieve a list of batches.
     *
     * Supports filtering by fields like `batch_number`, `species`, `lifecycle_stage`, `status`, and `batch_type`.
     * Supports searching across `batch_number`, `species__name`, `lifecycle_stage__name`, `notes`, and `batch_type`.
     * Supports ordering by `batch_number`, `start_date`, `species__name`, `lifecycle_stage__name`, and `created_at`.
     * @param batchNumber
     * @param batchType * `STANDARD` - Standard
     * * `MIXED` - Mixed Population
     * @param lifecycleStage
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param species
     * @param status * `ACTIVE` - Active
     * * `COMPLETED` - Completed
     * * `TERMINATED` - Terminated
     * @returns PaginatedBatchList
     * @throws ApiError
     */
    public static apiV1BatchBatchesList(
        batchNumber?: string,
        batchType?: 'MIXED' | 'STANDARD',
        lifecycleStage?: number,
        ordering?: string,
        page?: number,
        search?: string,
        species?: number,
        status?: 'ACTIVE' | 'COMPLETED' | 'TERMINATED',
    ): CancelablePromise<PaginatedBatchList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/',
            query: {
                'batch_number': batchNumber,
                'batch_type': batchType,
                'lifecycle_stage': lifecycleStage,
                'ordering': ordering,
                'page': page,
                'search': search,
                'species': species,
                'status': status,
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
     * @returns Batch
     * @throws ApiError
     */
    public static apiV1BatchBatchesCompareRetrieve(): CancelablePromise<Batch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batches/compare/',
        });
    }
    /**
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
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
        });
    }
    /**
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
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
        });
    }
    /**
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
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
        });
    }
    /**
     * API endpoint for comprehensive management of aquaculture Batches.
     *
     * Provides full CRUD operations for batches, including detailed filtering,
     * searching, and ordering capabilities. Batches represent groups of aquatic
     * organisms managed together through their lifecycle.
     *
     * **Filtering:**
     * - `batch_number`: Exact match.
     * - `species`: Exact match by Species ID.
     * - `lifecycle_stage`: Exact match by LifeCycleStage ID.
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
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `container`: ID of the assigned container.
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
     * @param batch
     * @param container
     * @param isActive
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedBatchContainerAssignmentList
     * @throws ApiError
     */
    public static apiV1BatchContainerAssignmentsList(
        assignmentDate?: string,
        batch?: number,
        container?: number,
        isActive?: boolean,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedBatchContainerAssignmentList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/container-assignments/',
            query: {
                'assignment_date': assignmentDate,
                'batch': batch,
                'container': container,
                'is_active': isActive,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `container`: ID of the assigned container.
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
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `container`: ID of the assigned container.
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
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `container`: ID of the assigned container.
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
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `container`: ID of the assigned container.
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
        });
    }
    /**
     * API endpoint for managing Batch Container Assignments.
     *
     * This endpoint handles the assignment of batches (or parts of batches)
     * to specific containers (e.g., tanks, ponds, cages) at a given point in time.
     * It records the population count and biomass within that container.
     * Provides full CRUD operations for these assignments.
     *
     * An assignment can be marked as inactive when a batch is moved out of a container.
     *
     * **Filtering:**
     * - `batch`: ID of the assigned batch.
     * - `container`: ID of the assigned container.
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
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records.
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
     * @param mixedBatch
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param sourceBatch
     * @returns PaginatedBatchCompositionList
     * @throws ApiError
     */
    public static apiV1BatchBatchCompositionsList(
        mixedBatch?: number,
        ordering?: string,
        page?: number,
        search?: string,
        sourceBatch?: number,
    ): CancelablePromise<PaginatedBatchCompositionList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/batch-compositions/',
            query: {
                'mixed_batch': mixedBatch,
                'ordering': ordering,
                'page': page,
                'search': search,
                'source_batch': sourceBatch,
            },
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records.
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
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records.
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
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records.
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
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records.
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
        });
    }
    /**
     * API endpoint for managing Batch Compositions.
     *
     * This endpoint defines the composition of a 'mixed' batch, detailing what
     * percentage and quantity (population/biomass) of it comes from various
     * 'source' batches. This is crucial for traceability when batches are merged.
     * Provides full CRUD operations for batch composition records.
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
        });
    }
    /**
     * API endpoint for managing Batch Transfers.
     *
     * Batch transfers record the movement of organisms between batches or changes
     * in their lifecycle stage or container assignment within the same batch.
     * This endpoint provides full CRUD operations for batch transfers.
     *
     * **Filtering:**
     * - `source_batch`: ID of the source batch.
     * - `destination_batch`: ID of the destination batch.
     * - `transfer_type`: Type of transfer (e.g., 'SPLIT', 'MERGE', 'MOVE', 'LIFECYCLE_CHANGE').
     * - `source_lifecycle_stage`: ID of the source lifecycle stage.
     * - `destination_lifecycle_stage`: ID of the destination lifecycle stage.
     * - `source_assignment`: ID of the source batch container assignment.
     * - `destination_assignment`: ID of the destination batch container assignment.
     *
     * **Searching:**
     * - `source_batch__batch_number`: Batch number of the source batch.
     * - `destination_batch__batch_number`: Batch number of the destination batch.
     * - `notes`: Notes associated with the transfer.
     *
     * **Ordering:**
     * - `transfer_date` (default: descending)
     * - `source_batch__batch_number`
     * - `transfer_type`
     * - `created_at`
     * @param destinationAssignment
     * @param destinationBatch
     * @param destinationLifecycleStage
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param sourceAssignment
     * @param sourceBatch
     * @param sourceLifecycleStage
     * @param transferType * `CONTAINER` - Container Transfer
     * * `LIFECYCLE` - Lifecycle Stage Change
     * * `SPLIT` - Batch Split
     * * `MERGE` - Batch Merge
     * * `MIXED_TRANSFER` - Mixed Batch Transfer
     * @returns PaginatedBatchTransferList
     * @throws ApiError
     */
    public static apiV1BatchTransfersList(
        destinationAssignment?: number,
        destinationBatch?: number,
        destinationLifecycleStage?: number,
        ordering?: string,
        page?: number,
        search?: string,
        sourceAssignment?: number,
        sourceBatch?: number,
        sourceLifecycleStage?: number,
        transferType?: 'CONTAINER' | 'LIFECYCLE' | 'MERGE' | 'MIXED_TRANSFER' | 'SPLIT',
    ): CancelablePromise<PaginatedBatchTransferList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/transfers/',
            query: {
                'destination_assignment': destinationAssignment,
                'destination_batch': destinationBatch,
                'destination_lifecycle_stage': destinationLifecycleStage,
                'ordering': ordering,
                'page': page,
                'search': search,
                'source_assignment': sourceAssignment,
                'source_batch': sourceBatch,
                'source_lifecycle_stage': sourceLifecycleStage,
                'transfer_type': transferType,
            },
        });
    }
    /**
     * API endpoint for managing Batch Transfers.
     *
     * Batch transfers record the movement of organisms between batches or changes
     * in their lifecycle stage or container assignment within the same batch.
     * This endpoint provides full CRUD operations for batch transfers.
     *
     * **Filtering:**
     * - `source_batch`: ID of the source batch.
     * - `destination_batch`: ID of the destination batch.
     * - `transfer_type`: Type of transfer (e.g., 'SPLIT', 'MERGE', 'MOVE', 'LIFECYCLE_CHANGE').
     * - `source_lifecycle_stage`: ID of the source lifecycle stage.
     * - `destination_lifecycle_stage`: ID of the destination lifecycle stage.
     * - `source_assignment`: ID of the source batch container assignment.
     * - `destination_assignment`: ID of the destination batch container assignment.
     *
     * **Searching:**
     * - `source_batch__batch_number`: Batch number of the source batch.
     * - `destination_batch__batch_number`: Batch number of the destination batch.
     * - `notes`: Notes associated with the transfer.
     *
     * **Ordering:**
     * - `transfer_date` (default: descending)
     * - `source_batch__batch_number`
     * - `transfer_type`
     * - `created_at`
     * @param requestBody
     * @returns BatchTransfer
     * @throws ApiError
     */
    public static apiV1BatchTransfersCreate(
        requestBody: BatchTransfer,
    ): CancelablePromise<BatchTransfer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/batch/transfers/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * API endpoint for managing Batch Transfers.
     *
     * Batch transfers record the movement of organisms between batches or changes
     * in their lifecycle stage or container assignment within the same batch.
     * This endpoint provides full CRUD operations for batch transfers.
     *
     * **Filtering:**
     * - `source_batch`: ID of the source batch.
     * - `destination_batch`: ID of the destination batch.
     * - `transfer_type`: Type of transfer (e.g., 'SPLIT', 'MERGE', 'MOVE', 'LIFECYCLE_CHANGE').
     * - `source_lifecycle_stage`: ID of the source lifecycle stage.
     * - `destination_lifecycle_stage`: ID of the destination lifecycle stage.
     * - `source_assignment`: ID of the source batch container assignment.
     * - `destination_assignment`: ID of the destination batch container assignment.
     *
     * **Searching:**
     * - `source_batch__batch_number`: Batch number of the source batch.
     * - `destination_batch__batch_number`: Batch number of the destination batch.
     * - `notes`: Notes associated with the transfer.
     *
     * **Ordering:**
     * - `transfer_date` (default: descending)
     * - `source_batch__batch_number`
     * - `transfer_type`
     * - `created_at`
     * @param id A unique integer value identifying this batch transfer.
     * @returns BatchTransfer
     * @throws ApiError
     */
    public static apiV1BatchTransfersRetrieve(
        id: number,
    ): CancelablePromise<BatchTransfer> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/transfers/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * API endpoint for managing Batch Transfers.
     *
     * Batch transfers record the movement of organisms between batches or changes
     * in their lifecycle stage or container assignment within the same batch.
     * This endpoint provides full CRUD operations for batch transfers.
     *
     * **Filtering:**
     * - `source_batch`: ID of the source batch.
     * - `destination_batch`: ID of the destination batch.
     * - `transfer_type`: Type of transfer (e.g., 'SPLIT', 'MERGE', 'MOVE', 'LIFECYCLE_CHANGE').
     * - `source_lifecycle_stage`: ID of the source lifecycle stage.
     * - `destination_lifecycle_stage`: ID of the destination lifecycle stage.
     * - `source_assignment`: ID of the source batch container assignment.
     * - `destination_assignment`: ID of the destination batch container assignment.
     *
     * **Searching:**
     * - `source_batch__batch_number`: Batch number of the source batch.
     * - `destination_batch__batch_number`: Batch number of the destination batch.
     * - `notes`: Notes associated with the transfer.
     *
     * **Ordering:**
     * - `transfer_date` (default: descending)
     * - `source_batch__batch_number`
     * - `transfer_type`
     * - `created_at`
     * @param id A unique integer value identifying this batch transfer.
     * @param requestBody
     * @returns BatchTransfer
     * @throws ApiError
     */
    public static apiV1BatchTransfersPartialUpdate(
        id: number,
        requestBody?: PatchedBatchTransfer,
    ): CancelablePromise<BatchTransfer> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/batch/transfers/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * API endpoint for managing Batch Transfers.
     *
     * Batch transfers record the movement of organisms between batches or changes
     * in their lifecycle stage or container assignment within the same batch.
     * This endpoint provides full CRUD operations for batch transfers.
     *
     * **Filtering:**
     * - `source_batch`: ID of the source batch.
     * - `destination_batch`: ID of the destination batch.
     * - `transfer_type`: Type of transfer (e.g., 'SPLIT', 'MERGE', 'MOVE', 'LIFECYCLE_CHANGE').
     * - `source_lifecycle_stage`: ID of the source lifecycle stage.
     * - `destination_lifecycle_stage`: ID of the destination lifecycle stage.
     * - `source_assignment`: ID of the source batch container assignment.
     * - `destination_assignment`: ID of the destination batch container assignment.
     *
     * **Searching:**
     * - `source_batch__batch_number`: Batch number of the source batch.
     * - `destination_batch__batch_number`: Batch number of the destination batch.
     * - `notes`: Notes associated with the transfer.
     *
     * **Ordering:**
     * - `transfer_date` (default: descending)
     * - `source_batch__batch_number`
     * - `transfer_type`
     * - `created_at`
     * @param id A unique integer value identifying this batch transfer.
     * @param requestBody
     * @returns BatchTransfer
     * @throws ApiError
     */
    public static apiV1BatchTransfersUpdate(
        id: number,
        requestBody: BatchTransfer,
    ): CancelablePromise<BatchTransfer> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/batch/transfers/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * API endpoint for managing Batch Transfers.
     *
     * Batch transfers record the movement of organisms between batches or changes
     * in their lifecycle stage or container assignment within the same batch.
     * This endpoint provides full CRUD operations for batch transfers.
     *
     * **Filtering:**
     * - `source_batch`: ID of the source batch.
     * - `destination_batch`: ID of the destination batch.
     * - `transfer_type`: Type of transfer (e.g., 'SPLIT', 'MERGE', 'MOVE', 'LIFECYCLE_CHANGE').
     * - `source_lifecycle_stage`: ID of the source lifecycle stage.
     * - `destination_lifecycle_stage`: ID of the destination lifecycle stage.
     * - `source_assignment`: ID of the source batch container assignment.
     * - `destination_assignment`: ID of the destination batch container assignment.
     *
     * **Searching:**
     * - `source_batch__batch_number`: Batch number of the source batch.
     * - `destination_batch__batch_number`: Batch number of the destination batch.
     * - `notes`: Notes associated with the transfer.
     *
     * **Ordering:**
     * - `transfer_date` (default: descending)
     * - `source_batch__batch_number`
     * - `transfer_type`
     * - `created_at`
     * @param id A unique integer value identifying this batch transfer.
     * @returns void
     * @throws ApiError
     */
    public static apiV1BatchTransfersDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/batch/transfers/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
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
     * @param cause * `DISEASE` - Disease
     * * `HANDLING` - Handling
     * * `PREDATION` - Predation
     * * `ENVIRONMENTAL` - Environmental
     * * `UNKNOWN` - Unknown
     * * `OTHER` - Other
     * @param eventDate
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedMortalityEventList
     * @throws ApiError
     */
    public static apiV1BatchMortalityEventsList(
        batch?: number,
        cause?: 'DISEASE' | 'ENVIRONMENTAL' | 'HANDLING' | 'OTHER' | 'PREDATION' | 'UNKNOWN',
        eventDate?: string,
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedMortalityEventList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/mortality-events/',
            query: {
                'batch': batch,
                'cause': cause,
                'event_date': eventDate,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
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
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
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
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
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
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
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
        });
    }
    /**
     * API endpoint for managing Mortality Events in aquaculture batches.
     *
     * Mortality events record the number of deaths in a batch on a specific date,
     * along with the suspected cause and any relevant notes. This endpoint
     * provides full CRUD operations for mortality events.
     *
     * **Filtering:**
     * - `batch`: ID of the batch associated with the mortality event.
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
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch. (Searches through the related Batch model via the assignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `batch__batch_number`: Batch number of the associated batch. (Orders based on the related Batch model via the assignment)
     * - `avg_weight_g`: Average weight in grams.
     * - `created_at`
     * @param assignmentBatch
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param sampleDate
     * @param search A search term.
     * @returns PaginatedGrowthSampleList
     * @throws ApiError
     */
    public static apiV1BatchGrowthSamplesList(
        assignmentBatch?: number,
        ordering?: string,
        page?: number,
        sampleDate?: string,
        search?: string,
    ): CancelablePromise<PaginatedGrowthSampleList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/batch/growth-samples/',
            query: {
                'assignment__batch': assignmentBatch,
                'ordering': ordering,
                'page': page,
                'sample_date': sampleDate,
                'search': search,
            },
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch. (Searches through the related Batch model via the assignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `batch__batch_number`: Batch number of the associated batch. (Orders based on the related Batch model via the assignment)
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
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch. (Searches through the related Batch model via the assignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `batch__batch_number`: Batch number of the associated batch. (Orders based on the related Batch model via the assignment)
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
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch. (Searches through the related Batch model via the assignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `batch__batch_number`: Batch number of the associated batch. (Orders based on the related Batch model via the assignment)
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
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch. (Searches through the related Batch model via the assignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `batch__batch_number`: Batch number of the associated batch. (Orders based on the related Batch model via the assignment)
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
        });
    }
    /**
     * API endpoint for managing Growth Samples from aquaculture batches.
     *
     * Growth samples record the average weight of organisms in a batch (or a specific
     * container assignment of a batch) on a particular date. This data is essential
     * for tracking growth, calculating feed conversion ratios, and making management decisions.
     * This endpoint provides full CRUD operations for growth samples.
     *
     * **Filtering:**
     * - `assignment__batch`: ID of the batch associated with the growth sample (via BatchContainerAssignment).
     * - `sample_date`: Exact date of the sample.
     *
     * **Searching:**
     * - `batch__batch_number`: Batch number of the associated batch. (Searches through the related Batch model via the assignment)
     * - `notes`: Notes associated with the growth sample.
     *
     * **Ordering:**
     * - `sample_date` (default: descending)
     * - `batch__batch_number`: Batch number of the associated batch. (Orders based on the related Batch model via the assignment)
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
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations.
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
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations.
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
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations.
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
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations.
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
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations.
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
        });
    }
    /**
     * ViewSet for Feed model.
     *
     * Provides CRUD operations for feed types used in aquaculture operations.
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
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records.
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
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records.
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
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records.
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
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records.
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
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records.
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
        });
    }
    /**
     * ViewSet for FeedPurchase model.
     *
     * Provides CRUD operations for feed purchase records.
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
        });
    }
    /**
     * ViewSet for FeedStock model.
     *
     * Provides CRUD operations for feed stock levels in feed containers.
     * @param feed
     * @param feedContainer
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @returns PaginatedFeedStockList
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksList(
        feed?: number,
        feedContainer?: number,
        ordering?: string,
        page?: number,
    ): CancelablePromise<PaginatedFeedStockList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feed-stocks/',
            query: {
                'feed': feed,
                'feed_container': feedContainer,
                'ordering': ordering,
                'page': page,
            },
        });
    }
    /**
     * ViewSet for FeedStock model.
     *
     * Provides CRUD operations for feed stock levels in feed containers.
     * @param requestBody
     * @returns FeedStock
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksCreate(
        requestBody: FeedStock,
    ): CancelablePromise<FeedStock> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/inventory/feed-stocks/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return feed stocks that are below reorder threshold.
     * @returns FeedStock
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksLowStockRetrieve(): CancelablePromise<FeedStock> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feed-stocks/low_stock/',
        });
    }
    /**
     * ViewSet for FeedStock model.
     *
     * Provides CRUD operations for feed stock levels in feed containers.
     * @param id A unique integer value identifying this feed stock.
     * @returns FeedStock
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksRetrieve(
        id: number,
    ): CancelablePromise<FeedStock> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feed-stocks/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ViewSet for FeedStock model.
     *
     * Provides CRUD operations for feed stock levels in feed containers.
     * @param id A unique integer value identifying this feed stock.
     * @param requestBody
     * @returns FeedStock
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksPartialUpdate(
        id: number,
        requestBody?: PatchedFeedStock,
    ): CancelablePromise<FeedStock> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/inventory/feed-stocks/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for FeedStock model.
     *
     * Provides CRUD operations for feed stock levels in feed containers.
     * @param id A unique integer value identifying this feed stock.
     * @param requestBody
     * @returns FeedStock
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksUpdate(
        id: number,
        requestBody: FeedStock,
    ): CancelablePromise<FeedStock> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/inventory/feed-stocks/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for FeedStock model.
     *
     * Provides CRUD operations for feed stock levels in feed containers.
     * @param id A unique integer value identifying this feed stock.
     * @returns void
     * @throws ApiError
     */
    public static apiV1InventoryFeedStocksDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/inventory/feed-stocks/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ViewSet for FeedingEvent model.
     *
     * Provides CRUD operations for feeding events with additional filtering
     * capabilities.
     * @param batch
     * @param container
     * @param feed
     * @param feedingDate
     * @param method * `MANUAL` - Manual
     * * `AUTOMATIC` - Automatic Feeder
     * * `BROADCAST` - Broadcast
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @returns PaginatedFeedingEventList
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsList(
        batch?: number,
        container?: number,
        feed?: number,
        feedingDate?: string,
        method?: 'AUTOMATIC' | 'BROADCAST' | 'MANUAL',
        ordering?: string,
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedFeedingEventList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/',
            query: {
                'batch': batch,
                'container': container,
                'feed': feed,
                'feeding_date': feedingDate,
                'method': method,
                'ordering': ordering,
                'page': page,
                'search': search,
            },
        });
    }
    /**
     * ViewSet for FeedingEvent model.
     *
     * Provides CRUD operations for feeding events with additional filtering
     * capabilities.
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
        });
    }
    /**
     * Get feeding events for a specific batch.
     * @returns FeedingEvent
     * @throws ApiError
     */
    public static apiV1InventoryFeedingEventsByBatchRetrieve(): CancelablePromise<FeedingEvent> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/feeding-events/by_batch/',
        });
    }
    /**
     * ViewSet for FeedingEvent model.
     *
     * Provides CRUD operations for feeding events with additional filtering
     * capabilities.
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
        });
    }
    /**
     * ViewSet for FeedingEvent model.
     *
     * Provides CRUD operations for feeding events with additional filtering
     * capabilities.
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
        });
    }
    /**
     * ViewSet for FeedingEvent model.
     *
     * Provides CRUD operations for feeding events with additional filtering
     * capabilities.
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
        });
    }
    /**
     * ViewSet for FeedingEvent model.
     *
     * Provides CRUD operations for feeding events with additional filtering
     * capabilities.
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
        });
    }
    /**
     * Get feeding summaries for a specific batch.
     * @returns BatchFeedingSummary
     * @throws ApiError
     */
    public static apiV1InventoryBatchFeedingSummariesByBatchRetrieve(): CancelablePromise<BatchFeedingSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/inventory/batch-feeding-summaries/by_batch/',
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
        });
    }
    /**
     * API endpoint for managing Feed Container Stock.
     *
     * Provides CRUD operations for feed container stock entries,
     * supporting FIFO inventory tracking.
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
        });
    }
    /**
     * API endpoint for managing Feed Container Stock.
     *
     * Provides CRUD operations for feed container stock entries,
     * supporting FIFO inventory tracking.
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
            });
        }
        /**
         * Get feed container stock grouped by container.
         *
         * Query parameters:
         * - container_id: Filter by specific container
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockByContainerRetrieve(): CancelablePromise<FeedContainerStock> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/feed-container-stock/by_container/',
            });
        }
        /**
         * Get feed container stock in FIFO order for a specific container.
         *
         * Query parameters:
         * - container_id: Required. Container to get FIFO order for.
         * @returns FeedContainerStock
         * @throws ApiError
         */
        public static apiV1InventoryFeedContainerStockFifoOrderRetrieve(): CancelablePromise<FeedContainerStock> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/inventory/feed-container-stock/fifo_order/',
            });
        }
        /**
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking.
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
            });
        }
        /**
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking.
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
            });
        }
        /**
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking.
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
            });
        }
        /**
         * API endpoint for managing Feed Container Stock.
         *
         * Provides CRUD operations for feed container stock entries,
         * supporting FIFO inventory tracking.
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
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
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
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
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
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
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
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
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
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
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
            });
        }
        /**
         * API endpoint for managing Journal Entries.
         *
         * Provides CRUD operations for journal entries, which track observations
         * and notes about fish health.
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
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in mortality records.
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
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in mortality records.
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
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in mortality records.
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
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in mortality records.
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
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in mortality records.
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
            });
        }
        /**
         * API endpoint for managing Mortality Reasons.
         *
         * Provides CRUD operations for mortality reasons used in mortality records.
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
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track fish deaths
         * and their causes.
         * @param count
         * @param countGte
         * @param countLte
         * @param page A page number within the paginated result set.
         * @param reasonId
         * @param search A search term.
         * @returns PaginatedMortalityRecordList
         * @throws ApiError
         */
        public static apiV1HealthMortalityRecordsList(
            count?: number,
            countGte?: number,
            countLte?: number,
            page?: number,
            reasonId?: number,
            search?: string,
        ): CancelablePromise<PaginatedMortalityRecordList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/mortality-records/',
                query: {
                    'count': count,
                    'count__gte': countGte,
                    'count__lte': countLte,
                    'page': page,
                    'reason__id': reasonId,
                    'search': search,
                },
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track fish deaths
         * and their causes.
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
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track fish deaths
         * and their causes.
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
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track fish deaths
         * and their causes.
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
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track fish deaths
         * and their causes.
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
            });
        }
        /**
         * API endpoint for managing Mortality Records.
         *
         * Provides CRUD operations for mortality records, which track fish deaths
         * and their causes.
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
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea lice infestations
         * in fish populations.
         * @param countDate
         * @param countDateGte
         * @param countDateLte
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @param userId
         * @returns PaginatedLiceCountList
         * @throws ApiError
         */
        public static apiV1HealthLiceCountsList(
            countDate?: string,
            countDateGte?: string,
            countDateLte?: string,
            page?: number,
            search?: string,
            userId?: number,
        ): CancelablePromise<PaginatedLiceCountList> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/health/lice-counts/',
                query: {
                    'count_date': countDate,
                    'count_date__gte': countDateGte,
                    'count_date__lte': countDateLte,
                    'page': page,
                    'search': search,
                    'user__id': userId,
                },
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea lice infestations
         * in fish populations.
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
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea lice infestations
         * in fish populations.
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
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea lice infestations
         * in fish populations.
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
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea lice infestations
         * in fish populations.
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
            });
        }
        /**
         * API endpoint for managing Lice Counts.
         *
         * Provides CRUD operations for lice counts, which track sea lice infestations
         * in fish populations.
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
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
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
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
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
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
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
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
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
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
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
            });
        }
        /**
         * API endpoint for managing Vaccination Types.
         *
         * Provides CRUD operations for vaccination types used in treatments.
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
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
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
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
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
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
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
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
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
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
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
            });
        }
        /**
         * API endpoint for managing Treatments.
         *
         * Provides CRUD operations for treatments, which track medical interventions
         * for fish populations.
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
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
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
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
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
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
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
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
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
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
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
            });
        }
        /**
         * API endpoint for managing Sample Types.
         *
         * Provides CRUD operations for sample types used in lab testing.
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
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * @param isActive
         * @param name
         * @param nameIcontains
         * @param page A page number within the paginated result set.
         * @param search A search term.
         * @returns PaginatedHealthParameterList
         * @throws ApiError
         */
        public static apiV1HealthHealthParametersList(
            isActive?: boolean,
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
                    'name': name,
                    'name__icontains': nameIcontains,
                    'page': page,
                    'search': search,
                },
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
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
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * @param id A unique integer value identifying this health parameter.
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
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * @param id A unique integer value identifying this health parameter.
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
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * @param id A unique integer value identifying this health parameter.
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
            });
        }
        /**
         * API endpoint for managing Health Parameters.
         *
         * Provides CRUD operations for health parameters used in fish health assessments.
         * @param id A unique integer value identifying this health parameter.
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
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
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
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
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
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
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
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
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
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
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
            });
        }
        /**
         * API endpoint for managing Health Sampling Events.
         *
         * Provides CRUD operations for health sampling events, including nested
         * individual fish observations and parameter scores. Also provides an
         * action to calculate aggregate metrics.
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
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
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
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
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
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
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
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
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
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
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
            });
        }
        /**
         * API endpoint for managing Individual Fish Observations.
         *
         * Provides CRUD operations for individual fish observations within a health sampling event.
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
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
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
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
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
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
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
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
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
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
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
            });
        }
        /**
         * API endpoint for managing Fish Parameter Scores.
         *
         * Provides CRUD operations for parameter scores assigned to individual fish observations.
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
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
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
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
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
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
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
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
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
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
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
            });
        }
        /**
         * API endpoint for managing Health Lab Samples.
         *
         * Provides CRUD operations and filtering for lab samples. Handles creation
         * with historical batch-container assignment lookup based on the sample date.
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
            });
        }
        /**
         * ViewSet for maintenance tasks.
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
            });
        }
        /**
         * ViewSet for maintenance tasks.
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
            });
        }
        /**
         * Get all overdue maintenance tasks.
         * @returns MaintenanceTask
         * @throws ApiError
         */
        public static apiV1BroodstockMaintenanceTasksOverdueRetrieve(): CancelablePromise<MaintenanceTask> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/maintenance-tasks/overdue/',
            });
        }
        /**
         * ViewSet for maintenance tasks.
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
            });
        }
        /**
         * ViewSet for maintenance tasks.
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
            });
        }
        /**
         * ViewSet for maintenance tasks.
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
            });
        }
        /**
         * ViewSet for maintenance tasks.
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
            });
        }
        /**
         * ViewSet for broodstock fish.
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
            });
        }
        /**
         * ViewSet for broodstock fish.
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
            });
        }
        /**
         * Get fish grouped by container.
         * @returns BroodstockFish
         * @throws ApiError
         */
        public static apiV1BroodstockFishByContainerRetrieve(): CancelablePromise<BroodstockFish> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/fish/by_container/',
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
            });
        }
        /**
         * ViewSet for broodstock fish.
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
            });
        }
        /**
         * ViewSet for broodstock fish.
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
            });
        }
        /**
         * ViewSet for broodstock fish.
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
            });
        }
        /**
         * ViewSet for broodstock fish.
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
            });
        }
        /**
         * ViewSet for fish movements.
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
            });
        }
        /**
         * ViewSet for fish movements.
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
            });
        }
        /**
         * ViewSet for fish movements.
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
            });
        }
        /**
         * ViewSet for fish movements.
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
            });
        }
        /**
         * ViewSet for fish movements.
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
            });
        }
        /**
         * ViewSet for fish movements.
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
            });
        }
        /**
         * ViewSet for breeding plans.
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
            });
        }
        /**
         * ViewSet for breeding plans.
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
            });
        }
        /**
         * Get all currently active breeding plans.
         * @returns BreedingPlan
         * @throws ApiError
         */
        public static apiV1BroodstockBreedingPlansActiveRetrieve(): CancelablePromise<BreedingPlan> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/breeding-plans/active/',
            });
        }
        /**
         * ViewSet for breeding plans.
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
            });
        }
        /**
         * ViewSet for breeding plans.
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
            });
        }
        /**
         * ViewSet for breeding plans.
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
            });
        }
        /**
         * ViewSet for breeding plans.
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
            });
        }
        /**
         * ViewSet for breeding trait priorities.
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
            });
        }
        /**
         * ViewSet for breeding trait priorities.
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
            });
        }
        /**
         * ViewSet for breeding trait priorities.
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
            });
        }
        /**
         * ViewSet for breeding trait priorities.
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
            });
        }
        /**
         * ViewSet for breeding trait priorities.
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
            });
        }
        /**
         * ViewSet for breeding trait priorities.
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
            });
        }
        /**
         * ViewSet for breeding pairs.
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
            });
        }
        /**
         * ViewSet for breeding pairs.
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
            });
        }
        /**
         * ViewSet for breeding pairs.
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
            });
        }
        /**
         * ViewSet for breeding pairs.
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
            });
        }
        /**
         * ViewSet for breeding pairs.
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
            });
        }
        /**
         * ViewSet for breeding pairs.
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
            });
        }
        /**
         * ViewSet for egg suppliers.
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
            });
        }
        /**
         * ViewSet for egg suppliers.
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
            });
        }
        /**
         * ViewSet for egg suppliers.
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
            });
        }
        /**
         * ViewSet for egg suppliers.
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
            });
        }
        /**
         * ViewSet for egg suppliers.
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
            });
        }
        /**
         * ViewSet for egg suppliers.
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
            });
        }
        /**
         * ViewSet for egg production.
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
            });
        }
        /**
         * ViewSet for egg production.
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
            });
        }
        /**
         * Create external egg acquisition.
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
            });
        }
        /**
         * Create internal egg production from a breeding pair.
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
            });
        }
        /**
         * ViewSet for egg production.
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
            });
        }
        /**
         * ViewSet for egg production.
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
            });
        }
        /**
         * ViewSet for egg production.
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
            });
        }
        /**
         * ViewSet for egg production.
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
            });
        }
        /**
         * ViewSet for external egg batches.
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
            });
        }
        /**
         * ViewSet for external egg batches.
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
            });
        }
        /**
         * ViewSet for external egg batches.
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
            });
        }
        /**
         * ViewSet for external egg batches.
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
            });
        }
        /**
         * ViewSet for external egg batches.
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
            });
        }
        /**
         * ViewSet for external egg batches.
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
            });
        }
        /**
         * ViewSet for batch parentage.
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
            });
        }
        /**
         * ViewSet for batch parentage.
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
            });
        }
        /**
         * Get complete lineage for a batch.
         * @returns BatchParentage
         * @throws ApiError
         */
        public static apiV1BroodstockBatchParentagesLineageRetrieve(): CancelablePromise<BatchParentage> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/v1/broodstock/batch-parentages/lineage/',
            });
        }
        /**
         * ViewSet for batch parentage.
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
            });
        }
        /**
         * ViewSet for batch parentage.
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
            });
        }
        /**
         * ViewSet for batch parentage.
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
            });
        }
        /**
         * ViewSet for batch parentage.
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
            });
        }
        /**
         * ViewSet for temperature profiles.
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
            });
        }
        /**
         * ViewSet for temperature profiles.
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
                    });
                }
                /**
                 * ViewSet for temperature profiles.
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
                    });
                }
                /**
                 * ViewSet for temperature profiles.
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
                    });
                }
                /**
                 * ViewSet for temperature profiles.
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
                    });
                }
                /**
                 * ViewSet for temperature profiles.
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
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for TGC models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for FCR models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models.
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
                    });
                }
                /**
                 * Enhanced ViewSet for mortality models.
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
                    });
                }
                /**
                 * ViewSet for biological constraints.
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
                    });
                }
                /**
                 * ViewSet for biological constraints.
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
                    });
                }
                /**
                 * Get all active constraint sets.
                 * @returns BiologicalConstraints
                 * @throws ApiError
                 */
                public static apiV1ScenarioBiologicalConstraintsActiveRetrieve(): CancelablePromise<BiologicalConstraints> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/v1/scenario/biological-constraints/active/',
                    });
                }
                /**
                 * ViewSet for biological constraints.
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
                    });
                }
                /**
                 * ViewSet for biological constraints.
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
                    });
                }
                /**
                 * ViewSet for biological constraints.
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
                    });
                }
                /**
                 * ViewSet for biological constraints.
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
                    });
                }
                /**
                 * Enhanced ViewSet for scenarios.
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
                    });
                }
                /**
                 * Enhanced ViewSet for scenarios.
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
                            });
                        }
                        /**
                         * Enhanced ViewSet for scenarios.
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
                            });
                        }
                        /**
                         * Enhanced ViewSet for scenarios.
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
                            });
                        }
                        /**
                         * Enhanced ViewSet for scenarios.
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
                            });
                        }
                        /**
                         * Enhanced ViewSet for scenarios.
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
                            });
                        }
                        /**
                         * Get projection data formatted for charts.
                         * @param scenarioId A unique integer value identifying this Scenario.
                         * @returns Scenario
                         * @throws ApiError
                         */
                        public static apiV1ScenarioScenariosChartDataRetrieve(
                            scenarioId: number,
                        ): CancelablePromise<Scenario> {
                            return __request(OpenAPI, {
                                method: 'GET',
                                url: '/api/v1/scenario/scenarios/{scenario_id}/chart_data/',
                                path: {
                                    'scenario_id': scenarioId,
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
                                });
                            }
                            /**
                             * Get projections for a scenario with optional filtering.
                             * @param scenarioId A unique integer value identifying this Scenario.
                             * @returns Scenario
                             * @throws ApiError
                             */
                            public static apiV1ScenarioScenariosProjectionsRetrieve(
                                scenarioId: number,
                            ): CancelablePromise<Scenario> {
                                return __request(OpenAPI, {
                                    method: 'GET',
                                    url: '/api/v1/scenario/scenarios/{scenario_id}/projections/',
                                    path: {
                                        'scenario_id': scenarioId,
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
                                    });
                                }
                                /**
                                 * Download CSV template for specified data type.
                                 *
                                 * Query params:
                                 * - data_type: 'temperature', 'fcr', or 'mortality'
                                 * - include_sample_data: true/false
                                 * @returns CSVUpload
                                 * @throws ApiError
                                 */
                                public static apiV1ScenarioDataEntryCsvTemplateRetrieve(): CancelablePromise<CSVUpload> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/scenario/data-entry/csv_template/',
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
                                    });
                                }
                                /**
                                 * API endpoint to view and update the user's profile.
                                 *
                                 * Allows users to view and update their own profile information.
                                 * @returns UserProfile
                                 * @throws ApiError
                                 */
                                public static apiV1UsersAuthProfileRetrieve(): CancelablePromise<UserProfile> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/v1/users/auth/profile/',
                                    });
                                }
                                /**
                                 * API endpoint to view and update the user's profile.
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
                                    });
                                }
                                /**
                                 * API endpoint to view and update the user's profile.
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
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted.
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
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted.
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
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted.
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
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted.
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
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted.
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
                                    });
                                }
                                /**
                                 * API endpoint that allows users to be viewed, created, edited or deleted.
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
                                    });
                                }
                                /**
                                 * Takes a set of user credentials and returns an access and refresh JSON web
                                 * token pair to prove the authentication of those credentials.
                                 * @param requestBody
                                 * @returns TokenObtainPair
                                 * @throws ApiError
                                 */
                                public static apiAuthJwtCreate(
                                    requestBody: TokenObtainPair,
                                ): CancelablePromise<TokenObtainPair> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/auth/jwt/',
                                        body: requestBody,
                                        mediaType: 'application/json',
                                    });
                                }
                                /**
                                 * Takes a refresh type JSON web token and returns an access type JSON web
                                 * token if the refresh token is valid.
                                 * @param requestBody
                                 * @returns TokenRefresh
                                 * @throws ApiError
                                 */
                                public static apiAuthJwtRefreshCreate(
                                    requestBody: TokenRefresh,
                                ): CancelablePromise<TokenRefresh> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/auth/jwt/refresh/',
                                        body: requestBody,
                                        mediaType: 'application/json',
                                    });
                                }
                            }
