import { API_CONFIG } from "./config";
import { ApiService } from "../api/generated";
import type { Batch } from "../api/generated";
import { setAuthToken } from "../api";
import { AuthService, authenticatedFetch } from "../services/auth.service";
import { fetchAllPages, type PaginatedResponse } from "./pagination";

export interface DashboardKPIs {
  totalFish: number;
  healthRate: number;
  avgWaterTemp: number;
  nextFeedingHours: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}

// Unified API client that uses the generated OpenAPI client
export const api = {
  // Dashboard endpoints
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    try {
      // FIXED: Fetch ALL batches using pagination (145 batches = ~8 pages)
      // Previously only fetched first page (20 records), missing 71% of fish count!
      const allBatches = await fetchAllPages(
        (page) => ApiService.apiV1BatchBatchesList(
          undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, page, undefined, undefined
        ) as Promise<PaginatedResponse<Batch>>,
        20 // Max 20 pages for safety (batches are ~145, so ~8 pages needed)
      );
      
      // Calculate KPIs from ALL batches
      const totalFish = allBatches.reduce(
        (sum: number, batch: any) => sum + (batch.calculated_population_count ?? 0),
        0,
      );
      const healthyBatches = allBatches.filter((batch: any) => batch.status === 'ACTIVE').length;
      const healthRate = allBatches.length > 0 ? (healthyBatches / allBatches.length) * 100 : 0;

      // FIXED: Use server-side aggregation for temperature stats
      // Previously fetched first page of 18.5M readings - completely wrong!
      let avgWaterTemp = 0;
      try {
        const statsResponse = await ApiService.apiV1EnvironmentalReadingsStatsRetrieve({
          days: 7,
          groupBy: 'parameter'
        } as any);
        
        // Find temperature stats in the response
        const tempStats = Array.isArray(statsResponse) 
          ? statsResponse.find((s: any) => 
              s.parameter_type === 'TEMPERATURE' || 
              s.parameter?.toLowerCase().includes('temp')
            )
          : null;
        
        if (tempStats) {
          // Handle different possible response formats
          const tempValue = (tempStats as any).avg_value ?? (tempStats as any).value ?? (tempStats as any).average;
          if (tempValue !== undefined) {
            avgWaterTemp = typeof tempValue === 'string' ? parseFloat(tempValue) : tempValue;
          }
        }
      } catch (statsError) {
        console.warn('Environmental stats endpoint not available, temperature will be 0:', statsError);
      }

      return {
        totalFish,
        healthRate,
        avgWaterTemp,
        nextFeedingHours: 0 // Let UI handle scheduling display
      };
    } catch (error) {
      // Let UI components handle missing data gracefully
      console.warn('Failed to fetch dashboard KPIs:', error);
      return {
        totalFish: 0,
        healthRate: 0,
        avgWaterTemp: 0,
        nextFeedingHours: 0
      };
    }
  },

  async getFarmSites() {
    try {
      // Farm sites endpoint doesn't exist, use areas instead
      const areas = await ApiService.apiV1InfrastructureAreasList();
      return areas.results.map((area: any) => ({
        id: area.id,
        name: area.name,
        location: `${area.latitude || 0}, ${area.longitude || 0}`,
        status: area.active ? 'active' : 'inactive',
        fishCount: 0, // Would be calculated
        healthStatus: 'good',
        // Added so dashboard components that display "last updated"
        // information don't encounter undefined values.
        lastUpdate: new Date().toISOString(),
      }));
    } catch (error) {
      return [];
    }
  },

  async getActiveAlerts() {
    try {
      // No specific alerts endpoint, could be implemented with journal entries or custom endpoint
      // Return empty array for now
      return [];
    } catch (error) {
      return [];
    }
  },

  // Chart data endpoints
  async getWaterQualityChart(farmSiteId = 1): Promise<ChartData> {
    // Get environmental readings
    const readings = await ApiService.apiV1EnvironmentalReadingsList();
    
    // Filter for temperature readings if needed
    const tempReadings = readings.results.filter((r: any) => r.parameter_type === 'TEMPERATURE');
    
    return {
      labels: tempReadings.map((r: any) => new Date(r.reading_time).toLocaleDateString()),
      datasets: [{
        label: 'Water Temperature',
        data: tempReadings.map((r: any) => r.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }]
    };
  },

  async getFishGrowthChart(): Promise<ChartData> {
    // Get growth samples
    const samples = await ApiService.apiV1BatchGrowthSamplesList();
    
    return {
      labels: samples.results.map((s: any) => new Date(s.sample_date).toLocaleDateString()),
      datasets: [{
        label: 'Average Weight (g)',
        data: samples.results.map((s: any) => s.avg_weight_g),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)'
      }]
    };
  },

  // Farm management endpoints
  async getPensByFarmSite(farmSiteId: number) {
    // Get containers for the area/site
    const containers = await ApiService.apiV1InfrastructureContainersList();
    
    // Filter for the specific area if needed
    const areaContainers = containers.results.filter((c: any) => c.area === farmSiteId);
    
    return areaContainers.map((container: any) => ({
      id: container.id,
      name: container.name,
      capacity: container.volume_m3,
      currentStock: 0, // Would be calculated from batch assignments
      status: container.active ? 'active' : 'inactive'
    }));
  },

  // Water quality endpoints
  async getWaterQualityReadings(farmSiteId: number, limit = 50) {
    // Get all readings and filter as needed
    const readings = await ApiService.apiV1EnvironmentalReadingsList();
    return {
      ...readings,
      results: readings.results.slice(0, limit)
    };
  },

  // Alerts endpoints
  async getAllAlerts(activeOnly = false) {
    // No specific alerts endpoint, could be implemented with journal entries
    return [];
  },

  async resolveAlert(alertId: number) {
    // No specific alert resolve endpoint
    // This would need to be implemented on the backend
    console.warn('Alert resolution not implemented in API');
    return { success: false };
  },

  // Batch management endpoints
  batch: {
    async getAll(filters?: any) {
      // Pass filters to the generated API service
      return ApiService.apiV1BatchBatchesList(
        filters?.batchNumber,
        filters?.batchNumberIcontains,
        filters?.batchType,
        filters?.batchTypeIn,
        filters?.biomassMax,
        filters?.biomassMin,
        filters?.endDateAfter,
        filters?.endDateBefore,
        filters?.lifecycleStage,
        filters?.lifecycleStageIn,
        filters?.ordering,
        filters?.page,
        filters?.populationMax,
        filters?.populationMin,
        filters?.search,
        filters?.species,
        filters?.speciesIn,
        filters?.startDateAfter,
        filters?.startDateBefore,
        filters?.status,
        filters?.statusIn
      );
    },

    async getById(id: number) {
      return ApiService.apiV1BatchBatchesRetrieve(id);
    },

    async create(data: any) {
      return ApiService.apiV1BatchBatchesCreate(data);
    },

    async update(id: number, data: any) {
      return ApiService.apiV1BatchBatchesUpdate(id, data);
    },

    /**
     * List all species available for batches.
     */
    async getSpecies() {
      return ApiService.apiV1BatchSpeciesList();
    },

    /**
     * List lifecycle stages for batches.
     * Note: Lifecycle stages are available through batch data, not as a separate endpoint.
     */
    async getLifecycleStages() {
      // Lifecycle stages are nested within batch/species data
      // This method is a placeholder - lifecycle stages should be accessed through batch details
      return { results: [] };
    },

    async getAssignments(batchId?: number) {
      // Fetch all pages with server-side batch filtering
      if (batchId) {
        let allAssignments: any[] = [];
        let page = 1;
        let hasMore = true;
        let responseCount = 0;

        while (hasMore) {
          const response = await ApiService.apiV1BatchContainerAssignmentsList(
            undefined, // assignmentDate
            undefined, // assignmentDateAfter
            undefined, // assignmentDateBefore
            batchId,   // batch - SERVER-SIDE filter
            undefined, // batchIn
            undefined, // batchNumber
            undefined, // biomassMax
            undefined, // biomassMin
            undefined, // container
            undefined, // containerIn
            undefined, // containerName
            undefined, // containerType
            undefined, // isActive - get ALL (active + inactive)
            undefined, // lifecycleStage
            undefined, // ordering
            page,      // current page
            undefined, // populationMax
            undefined, // populationMin
            undefined, // search
            undefined  // species
          );

          allAssignments = [...allAssignments, ...(response.results || [])];
          responseCount = response.count || 0;
          hasMore = !!response.next;
          page++;

          if (page > 20) {
            console.warn('⚠️ Stopped fetching batch assignments after 20 pages');
            break;
          }
        }

        console.log(`📦 api.batch.getAssignments: Fetched ${allAssignments.length} assignments for batch ${batchId} (${page - 1} pages)`);

        return {
          count: responseCount,
          next: null,
          previous: null,
          results: allAssignments
        };
      }

      // If no batchId, fetch first page only
      return await ApiService.apiV1BatchContainerAssignmentsList();
    },

    async getTransfers(batchId?: number) {
      // Legacy transfers removed - use BatchTransferWorkflow instead
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    },

    /**
     * Growth samples collected for batches.
     */
    async getGrowthSamples(batchId?: number) {
      const samples = await ApiService.apiV1BatchGrowthSamplesList();
      if (batchId) {
        return {
          ...samples,
          results: samples.results.filter((s: any) => s.batch === batchId),
        };
      }
      return samples;
    },

    /**
     * Mortality events recorded for batches.
     */
    async getMortalityEvents(batchId?: number) {
      const events = await ApiService.apiV1BatchMortalityEventsList();
      if (batchId) {
        return {
          ...events,
          results: events.results.filter((e: any) => e.batch === batchId),
        };
      }
      return events;
    },

    /**
     * Feeding summaries (aggregated) for batches.
     */
    async getFeedingSummaries(batchId?: number) {
      // Corrected: use inventory endpoint for batch feeding summaries
      const summaries =
        await ApiService.apiV1InventoryBatchFeedingSummariesList();
      if (batchId) {
        return {
          ...summaries,
          results: summaries.results.filter((r: any) => r.batch === batchId),
        };
      }
      return summaries;
    }
  },

  // Infrastructure endpoints
  infrastructure: {
    async getGeographies() {
      return ApiService.apiV1InfrastructureGeographiesList();
    },

    async getAreas(geographyId?: number) {
      if (geographyId) {
        return ApiService.apiV1InfrastructureAreasList({
          geography: geographyId
        } as any);
      }
      return ApiService.apiV1InfrastructureAreasList();
    },

    async getContainers(filters?: any) {
      return ApiService.apiV1InfrastructureContainersList(filters);
    },

    async getSensors(containerId?: number) {
      if (containerId) {
        return ApiService.apiV1InfrastructureSensorsList({
          container: containerId
        } as any);
      }
      return ApiService.apiV1InfrastructureSensorsList();
    },

    /**
     * Lightweight, client-computed infrastructure overview.
     * Falls back to static numbers if any call fails.
     */
    async getOverview() {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          console.warn("No auth token found - user needs to log in first");
          // Return empty data - let UI handle authentication requirements
          return {
            totalContainers: 0,
            activeBiomass: 0,
            capacity: 0,
            sensorAlerts: 0,
            feedingEventsToday: 0,
            _needsAuth: true, // Flag to indicate auth is needed
          };
        }

        const response = await authenticatedFetch(
          `${API_CONFIG.DJANGO_API_URL}/api/v1/infrastructure/overview/`
        );

        const data = await response.json();

        return {
          totalContainers: data.total_containers,
          capacity: data.capacity_kg,
          activeBiomass: data.active_biomass_kg,
          sensorAlerts: data.sensor_alerts,
          feedingEventsToday: data.feeding_events_today,
        };
      } catch (error) {
        console.warn("Failed to fetch infrastructure overview:", error);
        // Let UI handle missing data gracefully
        return {
          totalContainers: 0,
          activeBiomass: 0,
          capacity: 0,
          sensorAlerts: 0,
          feedingEventsToday: 0,
        };
      }
    },

    /**
     * Placeholder – would aggregate alerts from readings/journals.
     */
    async getActiveAlerts() {
      return { results: [] };
    },

    /**
     * Computed sensor overview list.
     */
    async getSensorsOverview(filters?: any) {
      try {
        const sensors = await ApiService.apiV1InfrastructureSensorsList(filters);
        const overviews = sensors.results.map((s: any) => ({
          id: s.id,
          name: s.name,
          type: s.sensor_type_display ?? s.sensor_type,
          status: s.active ? "online" : "offline",
          location: {
            geography: s.container_name ?? "",
          },
          currentValue: 0,
          unit: "",
          lastReading: new Date().toISOString(),
          signalStrength: 100,
          alertStatus: "normal",
          calibrationDue: new Date().toISOString(),
        }));
        return { results: overviews };
      } catch {
        return { results: [] };
      }
    },

    /**
     * Computed container overview list.
     */
    async getContainersOverview(filters?: any) {
      try {
        // Fetch all containers by handling pagination
        const allContainers: any[] = [];
        let page = 1;
        let hasNextPage = true;
        let totalFetched = 0;

        while (hasNextPage) {
          const response = await ApiService.apiV1InfrastructureContainersList(
            undefined, // active
            undefined, // area
            undefined, // areaIn
            undefined, // containerType
            undefined, // hall
            undefined, // hallIn
            undefined, // name
            undefined, // ordering
            page,      // page
            undefined  // search
          );

          const pageResults = response.results || [];
          allContainers.push(...pageResults);
          totalFetched += pageResults.length;
          hasNextPage = response.next !== null;
          page++;

          // Safety check to prevent infinite loops
          if (page > 10) break;
        }

        // Remove duplicates based on container ID
        const uniqueContainers = allContainers.filter((container, index, self) =>
          index === self.findIndex(c => c.id === container.id)
        );

        // Fetch all batch assignments to get biomass data (handle pagination)
        let assignmentsData: any[] = [];
        try {
          let assignmentPage = 1;
          let hasMoreAssignments = true;

          while (hasMoreAssignments) {
            const assignmentsResponse = await ApiService.apiV1BatchContainerAssignmentsList(
              undefined, // query parameters as first arg
              {
                page: assignmentPage,
                page_size: 100,
              } as any
            );
            assignmentsData.push(...(assignmentsResponse.results || []));
            hasMoreAssignments = assignmentsResponse.next !== null;
            assignmentPage++;

            // Safety check
            if (assignmentPage > 5) break;
          }
        } catch (assignmentError) {
          console.warn("Could not fetch batch assignments:", assignmentError);
        }

        // Create a map of container ID to biomass for quick lookup
        const biomassMap = new Map<number, number>();
        assignmentsData.forEach((assignment: any) => {
          if (assignment.container && assignment.container.id && assignment.biomass_kg) {
            biomassMap.set(assignment.container.id, parseFloat(assignment.biomass_kg));
          }
        });

        // Apply client-side filtering since backend filtering is not working
        let filteredContainers = uniqueContainers;

        if (filters?.type && filters.type !== "all") {
          // Map frontend filter values to actual container type names from API
          const typeMapping: { [key: string]: string } = {
            "Tray": "Egg & Alevin Trays (Tray)",
            "Fry Tank": "Fry Tanks (Tank)",
            "Parr Tank": "Parr Tanks (Tank)",
            "Smolt Tank": "Smolt Tanks (Tank)",
            "Post-Smolt Tank": "Post-Smolt Tanks (Tank)",
            "Ring": "Sea Rings (Pen)"
          };

          const targetType = typeMapping[filters.type] || filters.type;
          filteredContainers = filteredContainers.filter((c: any) =>
            c.container_type_name === targetType
          );
        }

        if (filters?.status && filters.status !== "all") {
          const statusFilter = filters.status === "active" ? true : false;
          filteredContainers = filteredContainers.filter((c: any) =>
            c.active === statusFilter
          );
          console.log(`After status filter "${filters.status}": ${filteredContainers.length} containers`);
        }

        if (filters?.geography && filters.geography !== "all") {
          // Map frontend geography filters to actual location patterns
          const geographyMapping: { [key: string]: string[] } = {
            "Faroe Islands": ["faroe islands"],
            "Scotland": ["scotland"]
          };

          const searchTerms = geographyMapping[filters.geography] || [filters.geography.toLowerCase()];
          filteredContainers = filteredContainers.filter((c: any) => {
            const locationText = `${c.area_name || ''} ${c.hall_name || ''} ${c.station_name || ''}`.toLowerCase();
            return searchTerms.some(term => locationText.includes(term));
          });
          console.log(`After geography filter "${filters.geography}": ${filteredContainers.length} containers`);
        }

        if (filters?.station && filters.station !== "all") {
          // Use definitive business rules to determine container location type
          if (filters.station === "areas") {
            // Show only area/sea containers using business rules:
            // Rule 1: area_id is not null (directly assigned to area)
            // Rule 2: hall_id is null (not in a hall, so must be in area)
            // Rule 3: container_type category is PEN (pens are by definition sea containers)
            filteredContainers = filteredContainers.filter((c: any) => {
              // Rule 1: Direct area assignment
              if (c.area != null) {
                return true;
              }
              // Rule 2: No hall assignment (must be in area)
              if (c.hall == null) {
                return true;
              }
              // Rule 3: PEN category containers are always sea containers
              if (c.container_type_name && c.container_type_name.toLowerCase().includes('pen')) {
                return true;
              }
              return false;
            });
          } else if (filters.station === "stations") {
            // Show only hall/freshwater containers (have hall_id)
            filteredContainers = filteredContainers.filter((c: any) => c.hall != null);
          }
          console.log(`After station filter "${filters.station}": ${filteredContainers.length} containers`);
        }

        console.log(`Final result: ${filteredContainers.length} containers after all filtering`);

        const list = filteredContainers.map((c: any) => {
          const capacity = parseFloat(c.volume_m3 ?? "0") || 0;
          const biomass = biomassMap.get(c.id) || 0;
          const utilizationPercent = capacity > 0 ? Math.round(((biomass / capacity) * 100) * 10) / 10 : 0;

          return {
            id: c.id,
            name: c.name,
            type: c.container_type_name,
            stage: "Sea",
            status: c.active ? "active" : "inactive",
            location: {
              geography: c.area_name ?? c.hall_name ?? "",
              station: c.hall_name ?? "",
              area: c.area_name ?? "",
            },
            biomass,
            capacity,
            fishCount: biomass > 0 ? Math.round(biomass) : 0, // Rough estimate
            temperature: 0,
            oxygenLevel: 0,
            lastMaintenance: new Date().toISOString(),
            utilizationPercent,
          };
        });
        return { results: list };
      } catch (error) {
        console.warn("Failed to fetch containers overview:", error);
        return { results: [] };
      }
    },

    /**
     * Get dynamic filter options from dedicated API endpoints
     */
    async getContainerFilterOptions() {
      try {
        console.log('=== FETCHING FILTER OPTIONS FROM API ENDPOINTS ===');

        // Fetch container data first (we know this works)
        const containers = await this.getContainersOverview();
        console.log('Container data received for filter extraction');

        // Extract container types from container data (most reliable approach)
        const containerTypes = new Set<string>();
        console.log('Processing', containers.results?.length || 0, 'containers for types');
        containers.results?.forEach((container: any, index: number) => {
          // Check all possible field names for container type
          const possibleFields = ['container_type_name', 'container_type', 'type', 'type_name'];
          const availableFields = possibleFields.filter(field => container[field]);

          console.log(`Container ${index}:`, {
            id: container.id,
            name: container.name,
            availableFields,
            allFields: Object.keys(container).filter(key => key.includes('type') || key.includes('container'))
          });

          // Try multiple field names for container type
          let containerTypeValue = null;
          for (const field of possibleFields) {
            if (container[field]) {
              containerTypeValue = container[field];
              console.log(`✅ Found container type in field '${field}':`, containerTypeValue);
              break;
            }
          }

          if (containerTypeValue) {
            containerTypes.add(containerTypeValue);
          } else {
            console.log('❌ No container type field found for container:', container.name);
          }
        });

        console.log('Container types set size:', containerTypes.size);
        console.log('Container types found:', Array.from(containerTypes));

        // Try to fetch geographies, stations, and areas (with fallbacks)
        let geographies = new Set<string>(['Faroe Islands']); // Default
        let stations = new Set<string>(['Freshwater Stations', 'Sea Areas']); // Default

        try {
          const [geographiesRes, freshwaterStationsRes, areasRes] = await Promise.all([
            ApiService.apiV1InfrastructureGeographiesList(),
            ApiService.apiV1InfrastructureFreshwaterStationsList(),
            ApiService.apiV1InfrastructureAreasList()
          ]);

          console.log('Infrastructure API responses received:', {
            geographies: geographiesRes.results?.length || 0,
            freshwaterStations: freshwaterStationsRes.results?.length || 0,
            areas: areasRes.results?.length || 0
          });

          // Process geographies
          geographies.clear(); // Clear defaults
          geographiesRes.results?.forEach((geo: any) => {
            if (geo.name) {
              geographies.add(geo.name);
              console.log('Added geography:', geo.name);
            }
          });

          // Process stations/areas
          stations.clear(); // Clear defaults
          freshwaterStationsRes.results?.forEach((station: any) => {
            if (station.name) {
              stations.add(`Freshwater Stations (${station.name})`);
              console.log('Added freshwater station:', station.name);
            }
          });
          areasRes.results?.forEach((area: any) => {
            if (area.name) {
              stations.add(`Sea Areas (${area.name})`);
              console.log('Added sea area:', area.name);
            }
          });

          // If no data from APIs, fall back to defaults
          if (geographies.size === 0) {
            geographies.add('Faroe Islands');
            console.log('Using fallback geography: Faroe Islands');
          }
          if (stations.size === 0) {
            stations.add('Freshwater Stations');
            stations.add('Sea Areas');
            console.log('Using fallback stations: Freshwater Stations, Sea Areas');
          }
        } catch (apiError) {
          console.warn('Failed to fetch infrastructure data, using fallbacks:', apiError);
          // Keep the default fallback values we set above
        }

        // Get status options from containers (we already have the data)
        const statuses = new Set<string>();
        containers.results.forEach((container: any) => {
          const status = container.active ? 'active' : 'inactive';
          statuses.add(status);
          console.log('Added status:', status);
        });

        const finalResult = {
          geographies: Array.from(geographies).sort(),
          stations: Array.from(stations).sort(),
          containerTypes: Array.from(containerTypes).sort(),
          statuses: Array.from(statuses).sort()
        };

        console.log('=== FILTER OPTIONS FETCH COMPLETE ===');
        console.log('Final result:', finalResult);

        return finalResult;
      } catch (error) {
        console.warn('Failed to fetch filter options from APIs:', error);
        // Return fallback hardcoded options
        return {
          geographies: ['Faroe Islands', 'Scotland'],
          stations: ['Freshwater Stations', 'Sea Areas'],
          containerTypes: [
            'Egg & Alevin Trays (Tray)',
            'Fry Tanks (Tank)',
            'Parr Tanks (Tank)',
            'Smolt Tanks (Tank)',
            'Post-Smolt Tanks (Tank)',
            'Sea Rings (Pen)'
          ],
          statuses: ['active', 'inactive']
        };
      }
    },

    /**
     * Get area rings by filtering containers with type "Ring"
     */
    async getAreaRings(areaId: number) {
      try {
        const containers = await ApiService.apiV1InfrastructureContainersList({
          area: areaId
        } as any);
        
        const rings = containers.results
          .filter((c: any) => (c.container_type_name || '').toLowerCase().includes('ring'))
          .map((c: any) => {
            const capacity = parseFloat(c.volume_m3 ?? "0") || 0;
            return {
              id: c.id,
              name: c.name,
              areaId: c.area,
              areaName: c.area_name || 'Unknown Area',
              status: c.active ? 'active' : 'inactive',
              biomass: 0,
              capacity,
              fishCount: 0,
              averageWeight: 0,
              waterDepth: 0, // Let UI handle missing water depth
              netCondition: 'unknown', // Let UI handle missing net condition
              lastInspection: new Date().toISOString(),
              coordinates: { lat: 0, lng: 0 },
              environmentalStatus: 'unknown' // Let UI handle missing status
            };
          });
        
        return { results: rings };
      } catch {
        return { results: [] };
      }
    },

    /**
     * Get detailed ring information
     */
    async getRingDetail(id: number) {
      try {
        const container = await ApiService.apiV1InfrastructureContainersRetrieve(id);
        if (!container) return null;

        const capacity = parseFloat(container.volume_m3 ?? "0") || 0;

        // Fetch batch assignments for this container using AuthService
        if (!AuthService.isAuthenticated()) return null;

        const response = await authenticatedFetch(
          `${API_CONFIG.DJANGO_API_URL}/api/v1/batch/container-assignments/?container=${id}&is_active=true`
        );

        const assignments = await response.json();

        // Calculate real values from batch assignments
        let biomass = 0;
        let fishCount = 0;
        let averageWeight = 0;

        if (assignments.results && assignments.results.length > 0) {
          biomass = assignments.results.reduce((sum: number, assignment: any) => {
            return sum + parseFloat(assignment.biomass_kg || '0');
          }, 0);

          fishCount = assignments.results.reduce((sum: number, assignment: any) => {
            return sum + parseInt(assignment.population_count || '0');
          }, 0);

          averageWeight = fishCount > 0 ? biomass / fishCount : 0; // kg per fish
        }

        // Convert biomass from kg to tons for ring display
        const biomassTons = biomass / 1000;

        // Fetch production metrics from actual data
        let mortalityRate = 0;
        let dailyFeedAmount = 0;
        let lastFeedingTime = new Date().toISOString();
        let feedConversionRatio = 0;
        let waterTemperature = 0;
        let oxygenSaturation = 0;
        let salinity = 0;

        // Get batch ID from first assignment
        const batchId = assignments.results?.[0]?.batch?.id;
        
        if (batchId) {
          // Parallelize independent API calls for better performance
          const [performanceData, feedingData, fcrData, envStats] = await Promise.all([
            // 1. Batch performance metrics (mortality)
            authenticatedFetch(
              `${API_CONFIG.DJANGO_API_URL}/api/v1/batch/batches/${batchId}/performance_metrics/`
            ).then(r => r.json()).catch(err => { console.warn('Failed to fetch performance metrics:', err); return null; }),
            
            // 2. Recent feeding events
            authenticatedFetch(
              `${API_CONFIG.DJANGO_API_URL}/api/v1/inventory/feeding-events/?container=${id}&page_size=14&ordering=-feeding_date,-feeding_time`
            ).then(r => r.json()).catch(err => { console.warn('Failed to fetch feeding data:', err); return null; }),
            
            // 3. FCR trends
            authenticatedFetch(
              `${API_CONFIG.DJANGO_API_URL}/api/v1/operational/fcr-trends/?batch_id=${batchId}&interval=WEEKLY&include_predicted=false`
            ).then(r => r.json()).catch(err => { console.warn('Failed to fetch FCR data:', err); return null; }),
            
            // 4. Environmental stats
            authenticatedFetch(
              `${API_CONFIG.DJANGO_API_URL}/api/v1/environmental/readings/stats/?container=${id}`
            ).then(r => r.json()).catch(err => { console.warn('Failed to fetch environmental stats:', err); return null; })
          ]);

          // Process performance metrics (mortality)
          if (performanceData?.mortality_metrics) {
            mortalityRate = performanceData.mortality_metrics.mortality_rate || 0;
          }

          // Process feeding data
          if (feedingData?.results && feedingData.results.length > 0) {
            const recentFeeding = feedingData.results[0];
            lastFeedingTime = `${recentFeeding.feeding_date}T${recentFeeding.feeding_time}`;
            
            if (feedingData.results.length >= 2) {
              const totalFeed = feedingData.results.reduce((sum: number, f: any) => 
                sum + parseFloat(f.amount_kg || '0'), 0
              );
              const oldestFeeding = feedingData.results[feedingData.results.length - 1];
              const daysSpan = Math.max(1, 
                (new Date(recentFeeding.feeding_date).getTime() - 
                 new Date(oldestFeeding.feeding_date).getTime()) 
                / (1000 * 60 * 60 * 24)
              );
              dailyFeedAmount = daysSpan > 0 ? totalFeed / daysSpan : 0;
            }
          }

          // Process FCR data
          if (fcrData?.series && fcrData.series.length > 0) {
            const latestFCR = fcrData.series
              .filter((point: any) => point.actual_fcr !== null && point.actual_fcr !== undefined)
              .sort((a: any, b: any) => new Date(b.period_end).getTime() - new Date(a.period_end).getTime())[0];
            
            if (latestFCR?.actual_fcr) {
              feedConversionRatio = parseFloat(latestFCR.actual_fcr);
            }
          }

          // Process environmental data
          if (Array.isArray(envStats)) {
            const tempStat = envStats.find((s: any) => s.parameter__name === 'Temperature');
            const oxygenStat = envStats.find((s: any) => s.parameter__name === 'Dissolved Oxygen');
            const salinityStat = envStats.find((s: any) => s.parameter__name === 'Salinity');
            
            waterTemperature = tempStat?.avg_value ? parseFloat(tempStat.avg_value) : 0;
            oxygenSaturation = oxygenStat?.avg_value ? parseFloat(oxygenStat.avg_value) : 0;
            salinity = salinityStat?.avg_value ? parseFloat(salinityStat.avg_value) : 0;
          }
        }

        // Cast container to any to access fields not in generated type
        const containerAny = container as any;

        return {
          id: container.id,
          name: container.name,
          areaId: container.area || 0,
          areaName: containerAny.area_name || 'Unknown Area',
          status: container.active ? 'active' : 'inactive',
          biomass: biomassTons, // Return biomass in tons for ring display
          capacity,
          fishCount,
          averageWeight,
          waterDepth: parseFloat(containerAny.water_depth ?? "0") || 20, // Use real depth or default 20m
          netCondition: 'good', // Default (could be enhanced with inspection data)
          lastInspection: containerAny.updated_at || new Date().toISOString(),
          coordinates: { 
            lat: parseFloat(containerAny.latitude ?? "0") || 0, 
            lng: parseFloat(containerAny.longitude ?? "0") || 0 
          },
          environmentalStatus: 'optimal', // Default
          // Additional fields for detail view
          netLastChanged: containerAny.updated_at || new Date().toISOString(),
          netType: containerAny.container_type_name || '',
          cageVolume: capacity,
          installedDate: containerAny.created_at,
          lastFeedingTime,
          dailyFeedAmount,
          mortalityRate,
          feedConversionRatio,
          waterTemperature,
          salinity,
          currentSpeed: 0, // Not tracked
          oxygenSaturation
        };
      } catch {
        return null;
      }
    }
  },

  /**
   * Container-specific data fetching with authentication
   */
  containers: {
    /**
     * Get batch assignments for a specific container
     */
    getAssignments: async (containerId: number, activeOnly: boolean = true) => {
      if (!AuthService.isAuthenticated()) {
        console.warn("No auth token found for container assignments");
        return { results: [] };
      }

      try {
        const response = await authenticatedFetch(
          `${API_CONFIG.DJANGO_API_URL}/api/v1/batch/container-assignments/?container=${containerId}&is_active=${activeOnly}`
        );

        return await response.json();
      } catch (error) {
        console.warn("Failed to fetch container assignments:", error);
        return { results: [] };
      }
    },

    /**
     * Get sensors for a specific container
     */
    getSensors: async (containerId: number) => {
      if (!AuthService.isAuthenticated()) {
        console.warn("No auth token found for container sensors");
        return { results: [] };
      }

      try {
        const response = await authenticatedFetch(
          `${API_CONFIG.DJANGO_API_URL}/api/v1/infrastructure/sensors/?container=${containerId}`
        );

        return await response.json();
      } catch (error) {
        console.warn("Failed to fetch container sensors:", error);
        return { results: [] };
      }
    }
  },

  // Inventory endpoints
  inventory: {
    async getFeedTypes() {
      return ApiService.apiV1InventoryFeedsList();
    },

    async getFeedingEvents(filters?: any) {
      return ApiService.apiV1InventoryFeedingEventsList();
    },

    async getFeedingEventsSummary(filters?: any): Promise<{ events_count: number; total_feed_kg: number }> {
      // Use the summary endpoint with date range parameter
      const params = filters || {};
      const response = await (ApiService as any).apiV1InventoryFeedingEventsSummaryRetrieve(params) as any; // Type override - OpenAPI spec is incorrect
      return {
        events_count: response.events_count ?? 0,
        total_feed_kg: response.total_feed_kg ?? 0,
      };
    },

    async createFeedingEvent(data: any) {
      return ApiService.apiV1InventoryFeedingEventsCreate(data);
    },

    async getFeedPurchases(filters?: any) {
      return ApiService.apiV1InventoryFeedPurchasesList(filters as any);
    },

    async getFeedContainers(filters?: any) {
      // The OpenAPI spec currently exposes only FeedContainerStock, not the parent
      // FeedContainer list, so we synthesise a minimal container collection from
      // the stock response until the backend adds a dedicated endpoint.
      const stock = await ApiService.apiV1InventoryFeedContainerStockList(
        filters as any,
      );

      // Build a unique map keyed by feed_container id
      const map = new Map<
        number,
        {
          id: number;
          name: string;
          active: boolean;
        }
      >();

      for (const s of stock.results ?? []) {
        if (!map.has(s.feed_container)) {
          map.set(s.feed_container, {
            id: s.feed_container,
            name: s.feed_container_name,
            active: true, // assume active; additional status unavailable
          });
        }
      }

      return {
        count: map.size,
        results: Array.from(map.values()),
      };
    },

    async getFeedContainerStock(filters?: any) {
      return ApiService.apiV1InventoryFeedContainerStockList(filters as any);
    }
  },

  // Broodstock endpoints
  broodstock: {
    programs: {
      async getAll() {
        try {
          const plans = await ApiService.apiV1BroodstockBreedingPlansList();
          
          const programs = plans.results.map((plan: any) => {
            const currentGeneration = 0; // Let UI handle generation display
            const targetGeneration = 0; // Let UI handle generation display

            return {
              id: plan.id,
              name: plan.name || `Breeding Plan ${plan.id}`,
              description: plan.description || 'No description available',
              status: plan.status || 'active',
              currentGeneration,
              targetGeneration,
              progress: Math.min(100, (currentGeneration / targetGeneration) * 100),
              populationSize: 0,
              startDate: plan.created_at,
              geneticGain: [], // Let UI handle missing genetic data
              traitWeights: {
                growthRate: 0,
                diseaseResistance: 0,
                feedEfficiency: 0,
                fleshQuality: 0
              },
              leadGeneticist: '' // Let UI handle missing geneticist info
            };
          });
          
          return { count: programs.length, results: programs };
        } catch {
          return { count: 0, results: [] };
        }
      }
    },
    
    population: {
      async getContainers() {
        try {
          const containers = await ApiService.apiV1InfrastructureContainersList();
          
          const broodstockContainers = containers.results.map((c: any) => {
            return {
              id: c.id,
              name: c.name,
              location: c.area_name || c.hall_name || 'Unknown',
              facility: c.hall_name || 'Main Facility',
              geography: c.area_name || 'Unknown Area',
              containerType: c.container_type_name || 'Tank',
              stage: 'Broodstock',
              fishCount: 0, // Let UI handle missing fish count
              capacity: parseFloat(c.volume_m3 || '0') || 0,
              temperature: 0, // Let UI handle missing temperature
              oxygen: 0, // Let UI handle missing oxygen
              ph: 0, // Let UI handle missing pH
              light: 0, // Let UI handle missing light
              environmentalStatus: 'unknown', // Let UI handle missing status
              utilizationRate: 0 // Let UI handle missing utilization
            };
          });
          
          return {
            count: broodstockContainers.length,
            results: broodstockContainers
          };
        } catch {
          return { count: 0, results: [] };
        }
      },
      
      async getContainerById(id: number) {
        try {
          const container = await ApiService.apiV1InfrastructureContainersRetrieve(id);
          if (!container) return null;
          
          return {
            id: container.id,
            name: container.name,
            location: container.area_name || container.hall_name || 'Unknown',
            facility: container.hall_name || 'Main Facility',
            geography: container.area_name || 'Unknown Area',
            containerType: container.container_type_name || 'Tank',
            stage: 'Broodstock',
            fishCount: 0, // Let UI handle missing fish count
            capacity: parseFloat(container.volume_m3 || '0') || 0,
            utilizationRate: 0, // Let UI handle missing utilization
            assignedProgram: '', // Let UI handle missing program
            generation: '', // Let UI handle missing generation
            temperature: 0, // Let UI handle missing temperature
            oxygen: 0, // Let UI handle missing oxygen
            ph: 0, // Let UI handle missing pH
            salinity: 0, // Let UI handle missing salinity
            light: 0, // Let UI handle missing light
            flowRate: 0, // Let UI handle missing flow rate
            environmentalStatus: 'unknown', // Let UI handle missing status
            status: container.active ? 'active' : 'inactive',
            lastFeedingTime: new Date().toISOString(),
            lastHealthCheck: new Date().toISOString(),
            lastSampling: new Date().toISOString(),
            mortalityRate: '0%', // Let UI handle missing mortality rate
            avgWeight: '0', // Let UI handle missing weight
            conditionFactor: '0', // Let UI handle missing condition factor
            hasActiveAlerts: false,
            alertCount: 0
          };
        } catch {
          return null;
        }
      }
    },
    
    genetics: {
      async getTraits() {
        // Return static placeholder data matching the expected shape
        return {
          correlationMatrix: {
            traits: [],
            correlations: []
          },
          snpAnalysis: {
            totalSnps: 0,
            analyzedTraits: 0,
            genomicMarkers: []
          },
          traitPerformance: {
            labels: [],
            currentGeneration: []
          }
        };
      }
    },

    /**
     * List broodstock breeding pairs
     */
    async getPairs() {
      return ApiService.apiV1BroodstockBreedingPairsList();
    },

    /**
     * List registered egg suppliers
     */
    async getEggSuppliers() {
      return ApiService.apiV1BroodstockEggSuppliersList();
    }
  },

  // Health endpoints
  health: {
    async getHealthRecords(batchId?: number) {
      if (batchId) {
        // Filter client-side if needed since the endpoint may not support filtering
        const records = await ApiService.apiV1HealthHealthSamplingEventsList();
        return {
          ...records,
          results: records.results.filter((r: any) => r.batch === batchId)
        };
      }
      return ApiService.apiV1HealthHealthSamplingEventsList();
    },

    async getHealthAssessments(batchId?: number) {
      // This endpoint might not exist in the current API
      // Fallback to health sampling events if needed
      try {
        const records = await ApiService.apiV1HealthHealthSamplingEventsList();
        if (batchId) {
          return {
            ...records,
            results: records.results.filter((r: any) => r.batch === batchId)
          };
        }
        return records;
      } catch (error) {
        return { results: [] };
      }
    },

    async createHealthRecord(data: any) {
      return ApiService.apiV1HealthHealthSamplingEventsCreate(data);
    },

    /**
     * ⚠️ TEMPORARY CLIENT-SIDE AGGREGATION ⚠️
     * 
     * Client-computed health summary - fetches multiple endpoints and aggregates data client-side.
     * 
     * Current Implementation:
     * - Fetches batches, treatments, journal entries, and lice counts separately
     * - Performs client-side filtering, calculation, and aggregation
     * - Returns hardcoded 0 for metrics without available data (averageHealthScore, recentMortality)
     * 
     * ❌ NOT OPTIMAL: This approach has several limitations:
     * - Multiple API calls increase latency and network overhead
     * - Client-side calculation logic should be centralized in backend
     * - Pagination not handled (may miss data in large datasets)
     * - No caching optimization at database level
     * 
     * Production Roadmap:
     * TODO: Backend team should implement /api/v1/health/summary/ endpoint with:
     * - Overall health score aggregation across batches
     * - Active treatments count with date filtering
     * - Mortality rate calculations (7-day, 30-day windows)
     * - Average lice count aggregations with proper weighting
     * - Pending review counts from journal entries
     * - Geography-based filtering support
     * - Proper pagination and caching (30-60s TTL)
     * 
     * Migration Path (Once Backend Endpoint Available):
     * 1. Create `useHealthSummary(geography?: number)` hook in features/health/api.ts
     * 2. Replace this method with ApiService.apiV1HealthSummaryRetrieve(geography)
     * 3. Update health.tsx to use new hook
     * 4. Remove this client-side aggregation method
     * 5. Update tests to mock server-side endpoint
     * 
     * @param geographySlug - Optional geography filter (currently unused - needs backend support)
     * @returns Health summary with metrics (some may be 0 when data unavailable)
     */
    async getSummary(geographySlug?: string) {
      /* eslint-disable @typescript-eslint/no-magic-numbers */
      try {
        const [batches, treatments, journalEntries, liceCounts] =
          await Promise.all([
            ApiService.apiV1BatchBatchesList(),
            ApiService.apiV1HealthTreatmentsList().catch(() => ({ results: [] })),
            ApiService.apiV1HealthJournalEntriesList().catch(() => ({ results: [] })),
            ApiService.apiV1HealthLiceCountsList().catch(() => ({ results: [] })),
          ]);

        const totalBatches = batches.results.length;
        const healthyBatches =
          batches.results.filter((b: any) => b.status === "ACTIVE").length;
        const healthRatePct =
          totalBatches > 0 ? (healthyBatches / totalBatches) * 100 : 0;

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const treatmentsRecent = (treatments.results ?? []).filter((t: any) => {
          return new Date(t.treatment_date) >= fourteenDaysAgo;
        });

        const pendingReviews = (journalEntries.results ?? []).filter(
          (j: any) => j.resolution_status !== "resolved",
        ).length;

        const avgLiceCountRaw = (liceCounts.results ?? []).reduce(
          (sum: number, l: any) => sum + (parseFloat(l.average_per_fish) || 0),
          0,
        );
        const avgLiceCount =
          (liceCounts.results ?? []).length > 0
            ? avgLiceCountRaw / liceCounts.results.length
            : 0;

        return {
          totalBatches,
          healthyBatches: Math.round(healthRatePct),
          batchesUnderTreatment: treatmentsRecent.length,
          averageHealthScore: 0, // Let UI handle missing health score
          recentMortality: 0, // Let UI handle missing mortality data
          activeTreatments: treatmentsRecent.length,
          pendingReviews,
          avgLiceCount: Number(avgLiceCount.toFixed(2)),
        };
      } catch {
        // Let UI handle missing data gracefully
        return {
          totalBatches: 0,
          healthyBatches: 0,
          batchesUnderTreatment: 0,
          averageHealthScore: 0,
          recentMortality: 0,
          activeTreatments: 0,
          pendingReviews: 0,
          avgLiceCount: 0,
        };
      }
      /* eslint-enable */
    },

    /**
     * ⚠️ TEMPORARY CLIENT-SIDE FILTERING ⚠️
     * 
     * Very lightweight heuristic to surface critical alerts for Health page.
     * 
     * Current Implementation:
     * - Fetches all mortality events and journal entries
     * - Filters client-side for recent (last 7 days) critical events
     * - Maps to MortalityRecord-like objects expected by UI
     * 
     * ❌ NOT OPTIMAL: This approach has limitations:
     * - Fetches all data then filters (inefficient for large datasets)
     * - Date filtering should be handled by backend with indexes
     * - No pagination support (may hit API limits)
     * 
     * Production Roadmap:
     * TODO: Backend team should implement /api/v1/health/critical-alerts/ endpoint with:
     * - Server-side filtering by severity (high, critical)
     * - Date range filtering at database level
     * - Proper pagination and limit controls
     * - Combined mortality and journal alerts in single response
     * 
     * Migration Path (Once Backend Endpoint Available):
     * 1. Create `useHealthCriticalAlerts()` hook in features/health/api.ts
     * 2. Replace this method with ApiService.apiV1HealthCriticalAlertsRetrieve()
     * 3. Update health.tsx to use new hook
     * 4. Remove this client-side filtering method
     * 
     * @returns Array of critical mortality events from last 7 days
     */
    async getCriticalAlerts() {
      try {
        const [mortality, journalEntries] = await Promise.all([
          ApiService.apiV1BatchMortalityEventsList().catch(() => ({ results: [] })),
          ApiService.apiV1HealthJournalEntriesList().catch(() => ({ results: [] })),
        ]);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const criticalMortality = (mortality.results ?? []).filter(
          (m: any) => new Date(m.event_date) >= sevenDaysAgo,
        );

        const criticalJournals = (journalEntries.results ?? []).filter(
          (j: any) =>
            (j.severity === "high" || j.severity === "critical") &&
            new Date(j.entry_date) >= sevenDaysAgo,
        );

        // Map to MortalityRecord-like objects expected by page
        const mapped = [
          ...criticalMortality.map((m: any) => ({
            id: m.id,
            batch: m.batch,
            container: m.container,
            date: m.event_date,
            count: m.count,
            reason: m.cause ?? "Unknown",
            reportedBy: "system",
            veterinarianReview: false,
          })),
          ...criticalJournals.map((j: any) => ({
            id: j.id + 100000, // avoid id clash
            batch: j.batch,
            container: j.container ?? 0,
            date: j.entry_date,
            count: 0,
            reason: j.description.substring(0, 50),
            reportedBy: "system",
            veterinarianReview: false,
          })),
        ];

        return mapped;
      } catch {
        return [];
      }
    }
  }
};
