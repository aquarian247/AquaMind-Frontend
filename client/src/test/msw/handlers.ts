import { http, HttpResponse } from 'msw';

// Mock data for batches
const batchesData = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      batch_number: 'B2025-001',
      species: 1,
      lifecycle_stage: 1,
      status: 'ACTIVE',
      batch_type: 'STANDARD',
      start_date: '2025-01-15',
      expected_end_date: '2025-06-15',
      actual_end_date: null,
      notes: 'Healthy batch with good growth rate',
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-07-01T10:30:00Z',
      calculated_population_count: 12500,
      calculated_biomass_kg: 3750.5
    },
    {
      id: 2,
      batch_number: 'B2024-042',
      species: 1,
      lifecycle_stage: 2,
      status: 'COMPLETED',
      batch_type: 'STANDARD',
      start_date: '2024-06-10',
      expected_end_date: '2024-12-10',
      actual_end_date: '2024-12-05',
      notes: 'Completed batch with excellent yield',
      created_at: '2024-06-10T09:15:00Z',
      updated_at: '2024-12-05T14:45:00Z',
      calculated_population_count: 10800,
      calculated_biomass_kg: 5400.2
    }
  ]
};

// Mock data for environmental readings
const environmentalReadingsData = {
  count: 5,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      sensor: 1,
      parameter_type: 'TEMPERATURE',
      value: 12.5,
      reading_time: '2025-07-01T08:00:00Z',
      created_at: '2025-07-01T08:00:01Z',
      updated_at: '2025-07-01T08:00:01Z'
    },
    {
      id: 2,
      sensor: 1,
      parameter_type: 'TEMPERATURE',
      value: 12.8,
      reading_time: '2025-07-01T12:00:00Z',
      created_at: '2025-07-01T12:00:01Z',
      updated_at: '2025-07-01T12:00:01Z'
    },
    {
      id: 3,
      sensor: 1,
      parameter_type: 'TEMPERATURE',
      value: 13.2,
      reading_time: '2025-07-01T16:00:00Z',
      created_at: '2025-07-01T16:00:01Z',
      updated_at: '2025-07-01T16:00:01Z'
    },
    {
      id: 4,
      sensor: 2,
      parameter_type: 'OXYGEN',
      value: 8.7,
      reading_time: '2025-07-01T08:00:00Z',
      created_at: '2025-07-01T08:00:02Z',
      updated_at: '2025-07-01T08:00:02Z'
    },
    {
      id: 5,
      sensor: 3,
      parameter_type: 'PH',
      value: 7.2,
      reading_time: '2025-07-01T08:00:00Z',
      created_at: '2025-07-01T08:00:03Z',
      updated_at: '2025-07-01T08:00:03Z'
    }
  ]
};

// Mock data for growth samples
const growthSamplesData = {
  count: 3,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      assignment: 1,
      sample_date: '2025-06-01',
      avg_weight_g: 125.5,
      sample_size: 30,
      notes: 'Regular monthly sampling',
      created_at: '2025-06-01T10:15:00Z',
      updated_at: '2025-06-01T10:15:00Z'
    },
    {
      id: 2,
      assignment: 1,
      sample_date: '2025-06-15',
      avg_weight_g: 145.2,
      sample_size: 30,
      notes: 'Mid-month check',
      created_at: '2025-06-15T11:00:00Z',
      updated_at: '2025-06-15T11:00:00Z'
    },
    {
      id: 3,
      assignment: 1,
      sample_date: '2025-07-01',
      avg_weight_g: 168.7,
      sample_size: 30,
      notes: 'Regular monthly sampling',
      created_at: '2025-07-01T09:45:00Z',
      updated_at: '2025-07-01T09:45:00Z'
    }
  ]
};

// Mock data for areas
const areasData = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      name: 'North Bay Farm',
      geography: 1,
      latitude: 60.1234,
      longitude: 5.6789,
      active: true,
      description: 'Main production site with 12 cages',
      created_at: '2023-01-15T08:00:00Z',
      updated_at: '2025-06-01T14:30:00Z'
    },
    {
      id: 2,
      name: 'South Bay Farm',
      geography: 1,
      latitude: 59.9876,
      longitude: 5.4321,
      active: false,
      description: 'Secondary site, currently under maintenance',
      created_at: '2023-03-20T09:15:00Z',
      updated_at: '2025-05-15T11:20:00Z'
    }
  ]
};

// Default handlers for successful responses
const handlers = [
  http.get('path:/api/v1/batch/batches*', () => {
    return HttpResponse.json(batchesData);
  }),
  
  http.get('path:/api/v1/environmental/readings*', () => {
    return HttpResponse.json(environmentalReadingsData);
  }),
  
  http.get('path:/api/v1/batch/growth-samples*', () => {
    return HttpResponse.json(growthSamplesData);
  }),
  
  http.get('path:/api/v1/infrastructure/areas*', () => {
    return HttpResponse.json(areasData);
  })
];

// Helper functions to switch to error states
export const errorBatches = () => {
  return http.get('path:/api/v1/batch/batches*', () => {
    return new HttpResponse(null, { status: 500 });
  });
};

export const errorEnvReadings = () => {
  return http.get('path:/api/v1/environmental/readings*', () => {
    return new HttpResponse(null, { status: 500 });
  });
};

export const errorGrowthSamples = () => {
  return http.get('path:/api/v1/batch/growth-samples*', () => {
    return new HttpResponse(null, { status: 500 });
  });
};

export const errorAreas = () => {
  return http.get('path:/api/v1/infrastructure/areas*', () => {
    return new HttpResponse(null, { status: 500 });
  });
};

export default handlers;
