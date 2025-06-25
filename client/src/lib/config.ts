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
  FEED_TYPES: '/api/v1/inventory/feed/',
  FEED_PURCHASES: '/api/v1/inventory/purchases/',
  FEED_STOCK: '/api/v1/inventory/stock/',
  FEEDING_EVENTS: '/api/v1/inventory/feeding-events/',
  
  // Health endpoints
  HEALTH_RECORDS: '/api/v1/health/records/',
  HEALTH_ASSESSMENTS: '/api/v1/health/assessments/',
  LAB_SAMPLES: '/api/v1/health/lab-samples/',
  
  // Environmental endpoints
  ENVIRONMENTAL_READINGS: '/api/v1/environmental/readings/',
  WEATHER_DATA: '/api/v1/environmental/weather/',
  
  // User authentication
  AUTH_LOGIN: '/api/v1/auth/login/',
  AUTH_LOGOUT: '/api/v1/auth/logout/',
  AUTH_USER: '/api/v1/auth/user/',
} as const;