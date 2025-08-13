// API Configuration for Django Backend Integration
export const API_CONFIG = {
  // Backend configuration
  DJANGO_API_URL: import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000',
  USE_DJANGO_API: import.meta.env.VITE_USE_DJANGO_API === 'true',
  
  // API versioning
  API_VERSION: 'v1',
  
  // Authentication
  CSRF_COOKIE_NAME: 'csrftoken',
  CSRF_HEADER_NAME: 'X-CSRFToken',
  
  // Request timeouts
  REQUEST_TIMEOUT: 30000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Generated-client runtime configuration
 */
import { OpenAPI } from '../api';

/**
 * Retrieve the auth token from localStorage.
 *
 * The generated OpenAPI runtime expects a **string** (or a `Promise<string>`)
 * – it must never be `undefined`.  When no user is authenticated we therefore
 * return the empty string.
 *
 * The backend expects the following header when the user *is* authenticated:
 *
 *     Authorization: Token <token>
 */
export const getAuthToken = (): string => {
  try {
    return localStorage.getItem('authToken') ?? '';
  } catch {
    // SSR / sandboxed environment – no localStorage
    return '';
  }
};

// Configure the generated API client so every request uses the correct base
// URL and pulls a fresh token at call-time.
OpenAPI.BASE = API_CONFIG.DJANGO_API_URL;
/*
 * OpenAPI.TOKEN expects either a string **or** a resolver that returns
 * `Promise<string>`. We supply an async resolver so that the latest
 * token is fetched for every request.
 */
OpenAPI.TOKEN = async () => getAuthToken();

export const getApiUrl = (endpoint: string): string => {
  if (API_CONFIG.USE_DJANGO_API) {
    const baseUrl = API_CONFIG.DJANGO_API_URL;
    const versionedEndpoint = endpoint.startsWith('/api/v1') 
      ? endpoint 
      : `/api/${API_CONFIG.API_VERSION}${endpoint}`;
    return `${baseUrl}${versionedEndpoint}`;
  }
  return endpoint; // Use local Express server
};

// Django API endpoint mappings
export const DJANGO_ENDPOINTS = {
  // Infrastructure endpoints
  GEOGRAPHIES: '/api/v1/infrastructure/geographies/',
  AREAS: '/api/v1/infrastructure/areas/',
  STATIONS: '/api/v1/infrastructure/freshwater-stations/',
  HALLS: '/api/v1/infrastructure/halls/',
  CONTAINERS: '/api/v1/infrastructure/containers/',
  CONTAINER_TYPES: '/api/v1/infrastructure/container-types/',
  FEED_CONTAINERS: '/api/v1/infrastructure/feed-containers/',
  SENSORS: '/api/v1/infrastructure/sensors/',
  
  // Batch management endpoints
  BATCHES: '/api/v1/batch/batches/',
  SPECIES: '/api/v1/batch/species/',
  LIFECYCLE_STAGES: '/api/v1/batch/lifecycle-stages/',
  BATCH_ASSIGNMENTS: '/api/v1/batch/container-assignments/',
  BATCH_TRANSFERS: '/api/v1/batch/transfers/',
  GROWTH_SAMPLES: '/api/v1/batch/growth-samples/',
  MORTALITY_EVENTS: '/api/v1/batch/mortality-events/',
  
  // Inventory endpoints
  FEED_TYPES: '/api/v1/inventory/feeds/',
  FEED_PURCHASES: '/api/v1/inventory/feed-purchases/',
  FEED_STOCK: '/api/v1/inventory/feed-stocks/',
  FEEDING_EVENTS: '/api/v1/inventory/feeding-events/',
  FEED_CONTAINER_STOCK: '/api/v1/inventory/feed-container-stock/',
  BATCH_FEEDING_SUMMARIES: '/api/v1/inventory/batch-feeding-summaries/',
  
  // Health endpoints
  LAB_SAMPLES: '/api/v1/health/health-lab-samples/',
  JOURNAL_ENTRIES: '/api/v1/health/journal-entries/',
  HEALTH_SAMPLING_EVENTS: '/api/v1/health/health-sampling-events/',
  HEALTH_PARAMETERS: '/api/v1/health/health-parameters/',
  INDIVIDUAL_FISH_OBSERVATIONS: '/api/v1/health/individual-fish-observations/',
  FISH_PARAMETER_SCORES: '/api/v1/health/fish-parameter-scores/',
  LICE_COUNTS: '/api/v1/health/lice-counts/',
  MORTALITY_REASONS: '/api/v1/health/mortality-reasons/',
  MORTALITY_RECORDS: '/api/v1/health/mortality-records/',
  TREATMENTS: '/api/v1/health/treatments/',
  VACCINATION_TYPES: '/api/v1/health/vaccination-types/',
  SAMPLE_TYPES: '/api/v1/health/sample-types/',
  
  // Environmental endpoints (Section 3.1.5)
  ENVIRONMENTAL_READINGS: '/api/v1/environmental/readings/',
  ENVIRONMENTAL_PARAMETERS: '/api/v1/environmental/parameters/',
  WEATHER_DATA: '/api/v1/environmental/weather/',
  PHOTOPERIOD_DATA: '/api/v1/environmental/photoperiod/',
  
  // Broodstock endpoints (Section 3.1.8)
  BROODSTOCK_FISH: '/api/v1/broodstock/fish/',
  BREEDING_PLANS: '/api/v1/broodstock/breeding-plans/',
  BREEDING_PAIRS: '/api/v1/broodstock/breeding-pairs/',
  EGG_PRODUCTION: '/api/v1/broodstock/egg-productions/',
  EGG_SUPPLIERS: '/api/v1/broodstock/egg-suppliers/',
  FISH_MOVEMENTS: '/api/v1/broodstock/fish-movements/',
  MAINTENANCE_TASKS: '/api/v1/broodstock/maintenance-tasks/',
  BATCH_PARENTAGES: '/api/v1/broodstock/batch-parentages/',
  EXTERNAL_EGG_BATCHES: '/api/v1/broodstock/external-egg-batches/',
  TRAIT_PRIORITIES: '/api/v1/broodstock/trait-priorities/',
  
  // Scenario Planning endpoints (Section 3.3.1)
  SCENARIOS: '/api/v1/scenario/scenarios/',
  TGC_MODELS: '/api/v1/scenario/tgc-models/',
  FCR_MODELS: '/api/v1/scenario/fcr-models/',
  MORTALITY_MODELS: '/api/v1/scenario/mortality-models/',
  BIOLOGICAL_CONSTRAINTS: '/api/v1/scenario/biological-constraints/',
  TEMPERATURE_PROFILES: '/api/v1/scenario/temperature-profiles/',
  
  // User Management endpoints (Section 3.1.6)
  USERS: '/api/v1/users/users/',
  USER_PROFILES: '/api/v1/users/profiles/',
  GROUPS: '/api/v1/users/groups/',
  PERMISSIONS: '/api/v1/users/permissions/',
  
  // User authentication
  AUTH_LOGIN: '/api/v1/auth/token/',
  AUTH_USER: '/api/v1/users/users/me/',
  AUTH_TOKEN_REFRESH: '/api/v1/users/auth/token/refresh/',
} as const;