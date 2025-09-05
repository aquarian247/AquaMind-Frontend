/**
 * API Configuration
 *
 * Centralized configuration for API settings and endpoints.
 * This complements auth.config.ts for non-auth related API settings.
 */

import { authConfig } from './auth.config';

export const apiConfig = {
  // Base API Configuration
  baseUrl: authConfig.baseUrl,
  apiVersion: authConfig.apiVersion,
  timeout: authConfig.timeout,
  retries: authConfig.retries,

  // Request Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // API Endpoints (Infrastructure)
  endpoints: {
    // Infrastructure
    geographies: '/api/v1/infrastructure/geographies/',
    areas: '/api/v1/infrastructure/areas/',
    stations: '/api/v1/infrastructure/freshwater-stations/',
    halls: '/api/v1/infrastructure/halls/',
    containers: '/api/v1/infrastructure/containers/',
    containerTypes: '/api/v1/infrastructure/container-types/',
    feedContainers: '/api/v1/infrastructure/feed-containers/',
    sensors: '/api/v1/infrastructure/sensors/',
    overview: '/api/v1/infrastructure/overview/',

    // Batch Management
    batches: '/api/v1/batch/batches/',
    species: '/api/v1/batch/species/',
    lifecycleStages: '/api/v1/batch/lifecycle-stages/',
    containerAssignments: '/api/v1/batch/container-assignments/',
    transfers: '/api/v1/batch/transfers/',
    growthSamples: '/api/v1/batch/growth-samples/',
    mortalityEvents: '/api/v1/batch/mortality-events/',
    feedingSummaries: '/api/v1/batch/feeding-summaries/',

    // Inventory
    feeds: '/api/v1/inventory/feeds/',
    feedPurchases: '/api/v1/inventory/feed-purchases/',
    feedStocks: '/api/v1/inventory/feed-stocks/',
    feedingEvents: '/api/v1/inventory/feeding-events/',
    feedContainerStock: '/api/v1/inventory/feed-container-stock/',
    batchFeedingSummaries: '/api/v1/inventory/batch-feeding-summaries/',

    // Health
    healthSamples: '/api/v1/health/health-lab-samples/',
    journalEntries: '/api/v1/health/journal-entries/',
    healthSamplingEvents: '/api/v1/health/health-sampling-events/',
    healthParameters: '/api/v1/health/health-parameters/',
    individualObservations: '/api/v1/health/individual-fish-observations/',
    fishParameterScores: '/api/v1/health/fish-parameter-scores/',
    liceCounts: '/api/v1/health/lice-counts/',
    mortalityReasons: '/api/v1/health/mortality-reasons/',
    mortalityRecords: '/api/v1/health/mortality-records/',
    treatments: '/api/v1/health/treatments/',
    vaccinationTypes: '/api/v1/health/vaccination-types/',
    sampleTypes: '/api/v1/health/sample-types/',

    // Environmental
    readings: '/api/v1/environmental/readings/',
    parameters: '/api/v1/environmental/parameters/',
    weather: '/api/v1/environmental/weather/',
    photoperiod: '/api/v1/environmental/photoperiod/',

    // Broodstock
    broodstockFish: '/api/v1/broodstock/fish/',
    breedingPlans: '/api/v1/broodstock/breeding-plans/',
    breedingPairs: '/api/v1/broodstock/breeding-pairs/',
    eggProductions: '/api/v1/broodstock/egg-productions/',
    eggSuppliers: '/api/v1/broodstock/egg-suppliers/',
    fishMovements: '/api/v1/broodstock/fish-movements/',
    maintenanceTasks: '/api/v1/broodstock/maintenance-tasks/',
    batchParentages: '/api/v1/broodstock/batch-parentages/',
    externalEggBatches: '/api/v1/broodstock/external-egg-batches/',
    traitPriorities: '/api/v1/broodstock/trait-priorities/',

    // Scenario Planning
    scenarios: '/api/v1/scenario/scenarios/',
    tgcModels: '/api/v1/scenario/tgc-models/',
    fcrModels: '/api/v1/scenario/fcr-models/',
    mortalityModels: '/api/v1/scenario/mortality-models/',
    biologicalConstraints: '/api/v1/scenario/biological-constraints/',
    temperatureProfiles: '/api/v1/scenario/temperature-profiles/',

    // User Management
    users: '/api/v1/users/users/',
    userProfiles: '/api/v1/users/profiles/',
    groups: '/api/v1/users/groups/',
    permissions: '/api/v1/users/permissions/',
  } as const,

  // Pagination defaults
  pagination: {
    defaultPageSize: 50,
    maxPageSize: 1000,
  },

  // Error handling
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
} as const;

/**
 * Build full API URL from endpoint path
 */
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${apiConfig.baseUrl}${cleanEndpoint}`;
};

/**
 * Get paginated endpoint URL
 */
export const getPaginatedUrl = (
  endpoint: string,
  page = 1,
  pageSize = apiConfig.pagination.defaultPageSize
): string => {
  const baseUrl = buildApiUrl(endpoint);
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}page=${page}&page_size=${pageSize}`;
};
