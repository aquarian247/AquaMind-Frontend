/**
 * Maps test field names to actual form element IDs
 * Context-aware to handle same field name in different forms
 */

// Entity-specific mappings (most specific)
const ENTITY_SPECIFIC_MAP: Record<string, Record<string, string>> = {
  'Area': {
    'geography': 'area-geography',
  },
  'Freshwater Station': {
    'station_type': 'station-type',
    'geography': 'station-geography',
  },
  'Hall': {
    'freshwater_station': 'hall-station',
  },
  'Container Type': {
    'category': 'type-category',
  },
  'Container': {
    'container_type': 'container-type',
    'hall': 'container-hall',
    'area': 'container-area',
  },
  'Sensor': {
    'sensor_type': 'sensor-type',
    'container': 'sensor-container',
    'filter_station': 'filter-station',
    'filter_hall': 'filter-hall',
    'filter_area': 'filter-area',
  },
  'Feed Container': {
    'feedcontainer_type': 'feedcontainer-type',
    'hall': 'feedcontainer-hall',
    'filter_station': 'filter-station',
  },
  'Lifecycle Stage': {
    'species': 'lifecycle-stage-species',
  },
  'Batch': {
    'species': 'batch-species',
    'lifecycle_stage': 'batch-lifecycle-stage',
    'status': 'batch-status',
    'batch_type': 'batch-type',
  },
  'Growth Sample': {
    'assignment': 'growth-sample-assignment',
  },
  'Mortality Event': {
    'batch': 'mortality-batch',
  },
  'Feed': {
    'size_category': 'feed-size-category',
  },
  'Feed Purchase': {
    'feed': 'purchase-feed',
  },
  'Feeding Event': {
    'batch': 'feeding-batch',
    'container': 'feeding-container',
    'feed': 'feeding-feed',
    'feeding_method': 'feeding-method',
  },
};

// Fallback: Convert snake_case to kebab-case
function fallbackId(fieldName: string): string {
  return fieldName.replace(/_/g, '-');
}

/**
 * Get the actual form dropdown ID for a field name
 * Uses entity context if provided, otherwise falls back to kebab-case
 */
export function getDropdownId(fieldName: string, entityName?: string): string {
  // Try entity-specific mapping first
  if (entityName && ENTITY_SPECIFIC_MAP[entityName]?.[fieldName]) {
    return ENTITY_SPECIFIC_MAP[entityName][fieldName];
  }
  
  // Fallback to kebab-case conversion
  return fallbackId(fieldName);
}
