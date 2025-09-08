/**
 * mock-api.ts - Lightweight mock API server for frontend development
 * 
 * This file provides minimal mock data that follows the Django API structure
 * from the OpenAPI spec. It's designed to be easy to maintain and modify.
 */

import { Request, Response } from 'express';

// Basic types matching Django models
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface Batch {
  id: number;
  name: string;
  initial_count: number;
  current_count: number;
  initial_weight_g: number;
  current_weight_g: number;
  species: number;
  stage: number;
  container: number;
  start_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  current_biomass_kg: string;
}

interface Species {
  id: number;
  name: string;
  scientific_name: string;
  description: string | null;
}

interface Stage {
  id: number;
  name: string;
  species: number;
  description: string | null;
}

interface Container {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
  status: string;
}

interface FeedType {
  id: number;
  name: string;
  manufacturer: string;
  protein_percentage: number;
  fat_percentage: number;
  carb_percentage: number;
  description: string | null;
}

interface EnvironmentalParameter {
  id: number;
  name: string;
  unit: string;
  min_value: number | null;
  max_value: number | null;
  description: string | null;
}

interface AuthToken {
  access: string;
  refresh: string;
}

// Minimal mock data
const mockBatches: Batch[] = [
  {
    id: 1,
    name: "Spring Salmon 2025-A",
    initial_count: 10000,
    current_count: 9850,
    initial_weight_g: 50,
    current_weight_g: 250,
    species: 1,
    stage: 1,
    container: 1,
    start_date: "2025-03-15",
    status: "active",
    notes: "Excellent growth performance",
    created_at: "2025-03-15T08:00:00Z",
    updated_at: "2025-07-10T14:30:00Z",
    current_biomass_kg: "2462.5"
  },
  {
    id: 2,
    name: "Spring Trout 2025-B",
    initial_count: 15000,
    current_count: 14200,
    initial_weight_g: 30,
    current_weight_g: 180,
    species: 2,
    stage: 3,
    container: 2,
    start_date: "2025-04-01",
    status: "active",
    notes: null,
    created_at: "2025-04-01T09:15:00Z",
    updated_at: "2025-07-12T11:45:00Z",
    current_biomass_kg: "2556.0"
  },
  {
    id: 3,
    name: "Winter Salmon 2024-C",
    initial_count: 12000,
    current_count: 11500,
    initial_weight_g: 45,
    current_weight_g: 1200,
    species: 1,
    stage: 2,
    container: 3,
    start_date: "2024-12-10",
    status: "active",
    notes: "Transferred from hatchery on 2025-02-15",
    created_at: "2024-12-10T10:30:00Z",
    updated_at: "2025-07-08T16:20:00Z",
    current_biomass_kg: "13800.0"
  }
];

const mockSpecies: Species[] = [
  {
    id: 1,
    name: "Atlantic Salmon",
    scientific_name: "Salmo salar",
    description: "Common farmed salmon species"
  },
  {
    id: 2,
    name: "Rainbow Trout",
    scientific_name: "Oncorhynchus mykiss",
    description: "Freshwater and sea-run trout species"
  }
];

const mockStages: Stage[] = [
  {
    id: 1,
    name: "Fry",
    species: 1,
    description: "Early development stage after alevin"
  },
  {
    id: 2,
    name: "Smolt",
    species: 1,
    description: "Juvenile salmon ready for saltwater"
  },
  {
    id: 3,
    name: "Fingerling",
    species: 2,
    description: "Young trout approximately finger-sized"
  }
];

const mockContainers: Container[] = [
  {
    id: 1,
    name: "Tank A1",
    type: "circular_tank",
    capacity: 5000,
    location: "Hatchery Building 1",
    status: "active"
  },
  {
    id: 2,
    name: "Tank B3",
    type: "circular_tank",
    capacity: 7000,
    location: "Hatchery Building 2",
    status: "active"
  },
  {
    id: 3,
    name: "Sea Cage 12",
    type: "sea_cage",
    capacity: 20000,
    location: "North Bay Site",
    status: "active"
  }
];

const mockFeedTypes: FeedType[] = [
  {
    id: 1,
    name: "Starter Feed",
    manufacturer: "AquaNutrition",
    protein_percentage: 54,
    fat_percentage: 18,
    carb_percentage: 12,
    description: "High-protein feed for fry and early juveniles"
  },
  {
    id: 2,
    name: "Grower 3mm",
    manufacturer: "AquaNutrition",
    protein_percentage: 48,
    fat_percentage: 24,
    carb_percentage: 14,
    description: "Balanced feed for growing juveniles"
  }
];

const mockEnvironmentalParameters: EnvironmentalParameter[] = [
  {
    id: 1,
    name: "Temperature",
    unit: "°C",
    min_value: 6,
    max_value: 16,
    description: "Water temperature"
  },
  {
    id: 2,
    name: "Dissolved Oxygen",
    unit: "mg/L",
    min_value: 6,
    max_value: null,
    description: "Dissolved oxygen concentration"
  },
  {
    id: 3,
    name: "pH",
    unit: "pH",
    min_value: 6.5,
    max_value: 8.5,
    description: "Water acidity/alkalinity"
  }
];

// API endpoint handlers
export const mockApiHandlers = {
  // Authentication
  handleLogin: (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === "demo" && password === "demo123") {
      res.json({
        access: "mock-access-token-valid-for-development-only",
        refresh: "mock-refresh-token-valid-for-development-only"
      });
    } else {
      res.status(401).json({
        detail: "No active account found with the given credentials"
      });
    }
  },

  handleRefresh: (req: Request, res: Response) => {
    const { refresh } = req.body;

    if (refresh === "mock-refresh-token-valid-for-development-only") {
      res.json({
        access: "mock-access-token-refreshed-valid-for-development-only",
        refresh: "mock-refresh-token-valid-for-development-only"
      });
    } else {
      res.status(401).json({
        detail: "Token is invalid or expired"
      });
    }
  },

  // Batch endpoints
  getBatches: (req: Request, res: Response) => {
    const response: PaginatedResponse<Batch> = {
      count: mockBatches.length,
      next: null,
      previous: null,
      results: mockBatches
    };
    res.json(response);
  },

  getBatchById: (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const batch = mockBatches.find(b => b.id === id);
    
    if (batch) {
      res.json(batch);
    } else {
      res.status(404).json({ detail: "Not found." });
    }
  },

  // Species endpoints
  getSpecies: (req: Request, res: Response) => {
    const response: PaginatedResponse<Species> = {
      count: mockSpecies.length,
      next: null,
      previous: null,
      results: mockSpecies
    };
    res.json(response);
  },

  // Stage endpoints
  getStages: (req: Request, res: Response) => {
    const speciesId = req.query.species ? parseInt(req.query.species as string) : undefined;
    let results = mockStages;
    
    if (speciesId) {
      results = mockStages.filter(s => s.species === speciesId);
    }
    
    const response: PaginatedResponse<Stage> = {
      count: results.length,
      next: null,
      previous: null,
      results
    };
    res.json(response);
  },

  // Container endpoints
  getContainers: (req: Request, res: Response) => {
    const response: PaginatedResponse<Container> = {
      count: mockContainers.length,
      next: null,
      previous: null,
      results: mockContainers
    };
    res.json(response);
  },

  // Feed type endpoints
  getFeedTypes: (req: Request, res: Response) => {
    const response: PaginatedResponse<FeedType> = {
      count: mockFeedTypes.length,
      next: null,
      previous: null,
      results: mockFeedTypes
    };
    res.json(response);
  },

  // Environmental parameters endpoints
  getEnvironmentalParameters: (req: Request, res: Response) => {
    const response: PaginatedResponse<EnvironmentalParameter> = {
      count: mockEnvironmentalParameters.length,
      next: null,
      previous: null,
      results: mockEnvironmentalParameters
    };
    res.json(response);
  }
};

// Register mock API routes with Express
export function registerMockApiRoutes(app: any) {
  // Authentication endpoints
  app.post('/api/v1/auth/token/', mockApiHandlers.handleLogin);
  app.post('/api/v1/auth/token/refresh/', mockApiHandlers.handleRefresh);
  
  // Batch endpoints
  app.get('/api/v1/batch/batches/', mockApiHandlers.getBatches);
  app.get('/api/v1/batch/batches/:id/', mockApiHandlers.getBatchById);
  
  // Species endpoints
  app.get('/api/v1/batch/species/', mockApiHandlers.getSpecies);
  
  // Stage endpoints
  app.get('/api/v1/batch/lifecycle-stages/', mockApiHandlers.getStages);
  
  // Container endpoints
  app.get('/api/v1/infrastructure/containers/', mockApiHandlers.getContainers);
  
  // Feed type endpoints
  app.get('/api/v1/inventory/feeds/', mockApiHandlers.getFeedTypes);
  
  // Environmental parameter endpoints
  app.get('/api/v1/environmental/parameters/', mockApiHandlers.getEnvironmentalParameters);
  
  console.log('📝 Mock API routes registered');
}

// Helper to determine if mock API should be used
export function shouldUseMockApi(): boolean {
  /*
   * Prioritise the VITE_USE_DJANGO_API flag.  If it is explicitly set to 'true'
   * we must proxy to the real Django backend, regardless of any other flags.
   */
  if (process.env.VITE_USE_DJANGO_API === 'true') {
    console.log('🔄 API Mode: Django');
    return false; // do NOT use mock ‑ proxy to Django
  }

  /*
   * Fallback logic: honour VITE_USE_MOCK_API (and keep compatibility with the
   * older USE_MOCK_API flag).  If neither flag is set, default to *not* using
   * the mock API so that developers notice missing env-var configuration.
   */
  const useMock =
    process.env.VITE_USE_MOCK_API === 'true' ||
    process.env.USE_MOCK_API === 'true';

  console.log(`🔄 API Mode: ${useMock ? 'Mock' : 'Django'}`);
  return useMock;
}
