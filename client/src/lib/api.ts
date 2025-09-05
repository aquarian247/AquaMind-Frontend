import { API_CONFIG } from "./config";
import { ApiService } from "../api/generated";
import { setAuthToken } from "../api";

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
      // Dashboard KPIs endpoint doesn't exist, calculate from individual endpoints
      const batches = await ApiService.apiV1BatchBatchesList();
      
      // Calculate KPIs from available data
      const totalFish = batches.results.reduce(
        (sum: any, batch: any) => sum + (batch.calculated_population_count ?? 0),
        0,
      );
      const healthyBatches = batches.results.filter((batch: any) => batch.status === 'ACTIVE').length;
      const healthRate = batches.results.length > 0 ? (healthyBatches / batches.results.length) * 100 : 0;

      // Get environmental readings for water temperature
      const envReadings = await ApiService.apiV1EnvironmentalReadingsList();
      const tempReadings = envReadings.results.filter((r: any) => r.parameter_type === 'TEMPERATURE');
      const avgWaterTemp = tempReadings.length > 0 
        ? tempReadings.reduce((sum: number, r: any) => sum + r.value, 0) / tempReadings.length
        : 12.5;

      return {
        totalFish,
        healthRate,
        avgWaterTemp,
        nextFeedingHours: 4
      };
    } catch (error) {
      // Fallback values if API calls fail
      return {
        totalFish: 0,
        healthRate: 0,
        avgWaterTemp: 12.5,
        nextFeedingHours: 4
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
      return ApiService.apiV1BatchBatchesList();
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
     */
    async getLifecycleStages() {
      return ApiService.apiV1BatchLifecycleStagesList();
    },

    async getAssignments(batchId?: number) {
      const assignments = await ApiService.apiV1BatchContainerAssignmentsList();
      if (batchId) {
        return {
          ...assignments,
          results: assignments.results.filter((a: any) => a.batch === batchId)
        };
      }
      return assignments;
    },

    async getTransfers(batchId?: number) {
      const transfers = await ApiService.apiV1BatchTransfersList();
      if (batchId) {
        return {
          ...transfers,
          results: transfers.results.filter((t: any) => t.source_batch === batchId)
        };
      }
      return transfers;
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
        // Get the current auth token
        const token = localStorage.getItem("auth_token");

        if (!token) {
          console.warn("No auth token found - user needs to log in first");
          // Return fallback data with clear indication that auth is needed
          return {
            totalContainers: 70,
            activeBiomass: 3500,
            capacity: 21805000,
            sensorAlerts: 0,
            feedingEventsToday: 40,
            _needsAuth: true, // Flag to indicate auth is needed
          };
        }

        const response = await fetch(
          `${API_CONFIG.DJANGO_API_URL}/api/v1/infrastructure/overview/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("Auth token expired or invalid - user needs to log in again");
            // Clear invalid token
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            return {
              totalContainers: 70,
              activeBiomass: 3500,
              capacity: 21805000,
              sensorAlerts: 0,
              feedingEventsToday: 40,
              _needsAuth: true,
            };
          }
          throw new Error(`API call failed: ${response.status}`);
        }

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
        // Return known values as fallback
        return {
          totalContainers: 70,
          activeBiomass: 3500,
          capacity: 21805000,
          sensorAlerts: 0,
          feedingEventsToday: 40,
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
            undefined, // containerType
            undefined, // hall
            undefined, // name
            undefined, // ordering
            page,    // page
            undefined // search
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
              biomass: 0, // Placeholder
              capacity,
              fishCount: 0, // Placeholder
              averageWeight: 0, // Placeholder
              waterDepth: 15, // Placeholder
              netCondition: 'good', // Placeholder
              lastInspection: new Date().toISOString(),
              coordinates: { lat: 0, lng: 0 }, // Placeholder
              environmentalStatus: 'optimal' // Placeholder
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

        // Fetch batch assignments for this container
        const token = localStorage.getItem("auth_token");
        if (!token) return null;

        const response = await fetch(
          `${import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000'}/api/v1/batch/container-assignments/?container=${id}&is_active=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
          }
          return null;
        }

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

        return {
          id: container.id,
          name: container.name,
          areaId: container.area || 0,
          areaName: container.area_name || 'Unknown Area',
          status: container.active ? 'active' : 'inactive',
          biomass: biomassTons, // Return biomass in tons for ring display
          capacity,
          fishCount,
          averageWeight,
          waterDepth: 15, // Placeholder
          netCondition: 'good', // Placeholder
          lastInspection: new Date().toISOString(),
          coordinates: { lat: 0, lng: 0 }, // Placeholder
          environmentalStatus: 'optimal', // Placeholder
          // Additional fields for detail view
          netLastChanged: new Date().toISOString(),
          netType: 'Standard',
          cageVolume: capacity,
          installedDate: container.created_at,
          lastFeedingTime: new Date().toISOString(),
          dailyFeedAmount: biomass * 0.005, // Estimate based on biomass
          mortalityRate: 0.15, // Placeholder
          feedConversionRatio: 1.12, // Placeholder
          waterTemperature: 8.5, // Placeholder
          salinity: 34.8, // Placeholder
          currentSpeed: 0.3, // Placeholder
          oxygenSaturation: 95.2 // Placeholder
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
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.warn("No auth token found for container assignments");
        return { results: [] };
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000'}/api/v1/batch/container-assignments/?container=${containerId}&is_active=${activeOnly}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("Auth token expired for container assignments");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            return { results: [] };
          }
          throw new Error(`API call failed: ${response.status}`);
        }

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
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.warn("No auth token found for container sensors");
        return { results: [] };
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000'}/api/v1/infrastructure/sensors/?container=${containerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            console.warn("Auth token expired for container sensors");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            return { results: [] };
          }
          throw new Error(`API call failed: ${response.status}`);
        }

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

    async getFeedStock(filters?: any) {
      return ApiService.apiV1InventoryFeedStocksList();
    },

    async getFeedingEvents(filters?: any) {
      return ApiService.apiV1InventoryFeedingEventsList();
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
            const currentGeneration = 3; // Placeholder
            const targetGeneration = 5; // Placeholder
            
            return {
              id: plan.id,
              name: plan.name || `Breeding Plan ${plan.id}`,
              description: plan.description || 'No description available',
              status: plan.status || 'active',
              currentGeneration,
              targetGeneration,
              progress: Math.min(100, (currentGeneration / targetGeneration) * 100),
              populationSize: 0, // Placeholder
              startDate: plan.created_at,
              geneticGain: [2, 4, 7, 10, 12], // Placeholder
              traitWeights: {
                growthRate: 40,
                diseaseResistance: 30,
                feedEfficiency: 20,
                fleshQuality: 10
              },
              leadGeneticist: 'Dr. Alex Smith' // Placeholder
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
              fishCount: 100, // Placeholder
              capacity: parseFloat(c.volume_m3 || '0') || 500,
              temperature: 12.5, // Placeholder
              oxygen: 8.2, // Placeholder
              ph: 7.4, // Placeholder
              light: 14, // Placeholder
              environmentalStatus: 'optimal', // Placeholder
              utilizationRate: 80 // Placeholder
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
            fishCount: 100, // Placeholder
            capacity: parseFloat(container.volume_m3 || '0') || 500,
            utilizationRate: 80, // Placeholder
            assignedProgram: 'Atlantic Salmon G5', // Placeholder
            generation: 'G5', // Placeholder
            temperature: 12.5, // Placeholder
            oxygen: 8.2, // Placeholder
            ph: 7.4, // Placeholder
            salinity: 34.8, // Placeholder
            light: 14, // Placeholder
            flowRate: 120, // Placeholder
            environmentalStatus: 'optimal', // Placeholder
            status: container.active ? 'active' : 'inactive',
            lastFeedingTime: new Date().toISOString(),
            lastHealthCheck: new Date().toISOString(),
            lastSampling: new Date().toISOString(),
            mortalityRate: '0.15%', // Placeholder
            avgWeight: '5200', // Placeholder
            conditionFactor: '1.15', // Placeholder
            hasActiveAlerts: false, // Placeholder
            alertCount: 0 // Placeholder
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
            traits: ['Growth Rate', 'Disease Resistance', 'Feed Efficiency', 'Flesh Quality'],
            correlations: [
              [1.0, 0.3, 0.5, 0.2],
              [0.3, 1.0, 0.4, 0.1],
              [0.5, 0.4, 1.0, 0.3],
              [0.2, 0.1, 0.3, 1.0]
            ]
          },
          snpAnalysis: {
            totalSnps: 25000,
            analyzedTraits: 4,
            genomicMarkers: [
              { type: 'growth', positions: [0.15, 0.35, 0.62, 0.78] },
              { type: 'disease', positions: [0.22, 0.44, 0.67, 0.89] },
              { type: 'quality', positions: [0.12, 0.33, 0.57, 0.91] },
              { type: 'maturation', positions: [0.18, 0.29, 0.51, 0.82] }
            ]
          },
          traitPerformance: {
            labels: ['Growth Rate', 'Disease Resistance', 'Feed Efficiency', 'Flesh Quality'],
            currentGeneration: [85, 92, 78, 88]
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
     * Client-computed health summary replacing deprecated aggregation endpoint.
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
          averageHealthScore: 4.2, // placeholder until proper metric exists
          recentMortality: 1.2,
          activeTreatments: treatmentsRecent.length,
          pendingReviews,
          avgLiceCount: Number(avgLiceCount.toFixed(2)),
        };
      } catch {
        // Stable fallbacks
        return {
          totalBatches: 100,
          healthyBatches: 87,
          batchesUnderTreatment: 3,
          averageHealthScore: 4.2,
          recentMortality: 1.2,
          activeTreatments: 5,
          pendingReviews: 0,
          avgLiceCount: 2.3,
        };
      }
      /* eslint-enable */
    },

    /**
     * Very lightweight heuristic to surface critical alerts for Health page.
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
