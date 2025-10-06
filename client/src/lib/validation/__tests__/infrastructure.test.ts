import { describe, it, expect } from 'vitest'
import {
  geographySchema,
  areaSchema,
  containerTypeSchema,
  containerSchema,
  hallSchema,
  freshwaterStationSchema,
  sensorSchema,
  feedContainerSchema,
} from '../infrastructure'

describe('Infrastructure Schemas', () => {
  describe('geographySchema', () => {
    it('validates required fields', () => {
      const result = geographySchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid geography', () => {
      const result = geographySchema.parse({
        name: 'Faroe Islands',
        description: 'North Atlantic region',
      })
      expect(result.name).toBe('Faroe Islands')
      expect(result.description).toBe('North Atlantic region')
    })

    it('strips empty description', () => {
      const result = geographySchema.parse({
        name: 'Faroe Islands',
        description: '',
      })
      expect(result.description).toBeUndefined()
    })
  })

  describe('areaSchema', () => {
    it('validates required fields', () => {
      const result = areaSchema.safeParse({
        name: '',
        geography: '',
        latitude: '',
        longitude: '',
        max_biomass: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid area', () => {
      const result = areaSchema.parse({
        name: 'North Bay',
        geography: '1',
        latitude: '60.123456',
        longitude: '5.654321',
        max_biomass: '100000.00',
        active: true,
      })
      expect(result.name).toBe('North Bay')
      expect(result.geography).toBe(1)
      expect(result.latitude).toBe('60.123456')
      expect(result.max_biomass).toBe('100000.00')
    })

    it('rejects invalid latitude', () => {
      const result = areaSchema.safeParse({
        name: 'North Bay',
        geography: '1',
        latitude: '95',
        longitude: '5',
        max_biomass: '100000',
        active: true,
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid longitude', () => {
      const result = areaSchema.safeParse({
        name: 'North Bay',
        geography: '1',
        latitude: '60',
        longitude: '185',
        max_biomass: '100000',
        active: true,
      })
      expect(result.success).toBe(false)
    })

    it('applies default active value', () => {
      const result = areaSchema.parse({
        name: 'North Bay',
        geography: '1',
        latitude: '60',
        longitude: '5',
        max_biomass: '100000',
      })
      expect(result.active).toBe(true)
    })
  })

  describe('containerTypeSchema', () => {
    it('validates required fields', () => {
      const result = containerTypeSchema.safeParse({
        name: '',
        category: 'INVALID',
        max_volume_m3: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid container type', () => {
      const result = containerTypeSchema.parse({
        name: 'Circular Tank 10m',
        category: 'TANK',
        max_volume_m3: '100.50',
        description: 'Standard circular tank',
      })
      expect(result.name).toBe('Circular Tank 10m')
      expect(result.category).toBe('TANK')
      expect(result.max_volume_m3).toBe('100.50')
    })

    it('accepts all valid categories', () => {
      const categories = ['TANK', 'PEN', 'TRAY', 'OTHER']
      categories.forEach((category) => {
        const result = containerTypeSchema.parse({
          name: 'Test',
          category,
          max_volume_m3: '100',
        })
        expect(result.category).toBe(category)
      })
    })
  })

  describe('containerSchema', () => {
    it('validates required fields', () => {
      const result = containerSchema.safeParse({
        name: '',
        container_type: '',
        volume_m3: '',
        max_biomass_kg: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts container with hall', () => {
      const result = containerSchema.parse({
        name: 'Tank A1',
        container_type: '1',
        hall: '1',
        area: null,
        volume_m3: '150.75',
        max_biomass_kg: '5000.00',
        feed_recommendations_enabled: false,
        active: true,
      })
      expect(result.name).toBe('Tank A1')
      expect(result.hall).toBe(1)
      expect(result.area).toBeNull()
    })

    it('accepts container with area', () => {
      const result = containerSchema.parse({
        name: 'Pen 3',
        container_type: '2',
        hall: null,
        area: '1',
        volume_m3: '200.00',
        max_biomass_kg: '10000.00',
      })
      expect(result.area).toBe(1)
      expect(result.hall).toBeNull()
    })

    it('rejects container without hall or area', () => {
      const result = containerSchema.safeParse({
        name: 'Tank A1',
        container_type: '1',
        hall: null,
        area: null,
        volume_m3: '150',
        max_biomass_kg: '5000',
      })
      expect(result.success).toBe(false)
    })

    it('converts empty string hall/area to null', () => {
      const result = containerSchema.parse({
        name: 'Tank A1',
        container_type: '1',
        hall: '1',
        area: '',
        volume_m3: '150',
        max_biomass_kg: '5000',
      })
      expect(result.hall).toBe(1)
      expect(result.area).toBeNull()
    })
  })

  describe('hallSchema', () => {
    it('validates required fields', () => {
      const result = hallSchema.safeParse({
        name: '',
        freshwater_station: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid hall', () => {
      const result = hallSchema.parse({
        name: 'Hall A',
        freshwater_station: '1',
        description: 'Main production hall',
        active: true,
      })
      expect(result.name).toBe('Hall A')
      expect(result.freshwater_station).toBe(1)
    })
  })

  describe('freshwaterStationSchema', () => {
    it('validates required fields', () => {
      const result = freshwaterStationSchema.safeParse({
        name: '',
        geography: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid freshwater station', () => {
      const result = freshwaterStationSchema.parse({
        name: 'Station 1',
        geography: '1',
        station_type: 'FRESHWATER',
        latitude: '59.9139',
        longitude: '10.7522',
        active: true,
      })
      expect(result.name).toBe('Station 1')
      expect(result.geography).toBe(1)
    })
  })

  describe('sensorSchema', () => {
    it('validates required fields', () => {
      const result = sensorSchema.safeParse({
        sensor_id: '',
        sensor_type: '',
        container: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid sensor', () => {
      const result = sensorSchema.parse({
        name: 'SENSOR-001',
        sensor_type: 'TEMPERATURE',
        container: '1',
        active: true,
      })
      expect(result.name).toBe('SENSOR-001')
      expect(result.container).toBe(1)
    })
  })

  describe('feedContainerSchema', () => {
    it('validates required fields', () => {
      const result = feedContainerSchema.safeParse({
        name: '',
        hall: '',
        capacity_kg: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid feed container', () => {
      const result = feedContainerSchema.parse({
        name: 'Feed Silo 1',
        hall: '1',
        container_type: 'SILO',
        capacity_kg: '1000.00',
        active: true,
      })
      expect(result.name).toBe('Feed Silo 1')
      expect(result.capacity_kg).toBe('1000.00')
    })
  })
})
