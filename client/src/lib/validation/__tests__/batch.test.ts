import { describe, it, expect } from 'vitest'
import {
  batchSchema,
  lifeCycleStageSchema,
  batchContainerAssignmentSchema,
  batchTransferSchema,
  growthSampleSchema,
  mortalityEventSchema,
} from '../batch'

describe('Batch Schemas', () => {
  describe('batchSchema', () => {
    it('validates required fields', () => {
      const result = batchSchema.safeParse({
        batch_number: '',
        species: '',
        lifecycle_stage: '',
        start_date: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid batch', () => {
      const result = batchSchema.parse({
        batch_number: 'BATCH2024-001',
        species: '1',
        lifecycle_stage: '1',
        status: 'ACTIVE',
        batch_type: 'STANDARD',
        start_date: '2024-10-01',
        expected_end_date: '2024-12-31',
        notes: 'Test batch',
      })
      expect(result.batch_number).toBe('BATCH2024-001')
      expect(result.species).toBe(1)
      expect(result.status).toBe('ACTIVE')
    })

    it('applies default status', () => {
      const result = batchSchema.parse({
        batch_number: 'BATCH2024-001',
        species: '1',
        lifecycle_stage: '1',
        start_date: '2024-10-01',
      })
      expect(result.status).toBe('ACTIVE')
      expect(result.batch_type).toBe('STANDARD')
    })

    it('accepts all valid statuses', () => {
      const statuses = ['ACTIVE', 'COMPLETED', 'TERMINATED']
      statuses.forEach((status) => {
        const result = batchSchema.parse({
          batch_number: 'BATCH2024-001',
          species: '1',
          lifecycle_stage: '1',
          status,
          start_date: '2024-10-01',
        })
        expect(result.status).toBe(status)
      })
    })

    it('accepts all valid batch types', () => {
      const types = ['STANDARD', 'MIXED']
      types.forEach((batch_type) => {
        const result = batchSchema.parse({
          batch_number: 'BATCH2024-001',
          species: '1',
          lifecycle_stage: '1',
          batch_type,
          start_date: '2024-10-01',
        })
        expect(result.batch_type).toBe(batch_type)
      })
    })

    it('validates date format', () => {
      const result = batchSchema.safeParse({
        batch_number: 'BATCH2024-001',
        species: '1',
        lifecycle_stage: '1',
        start_date: '10/01/2024',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('lifeCycleStageSchema', () => {
    it('validates required fields', () => {
      const result = lifeCycleStageSchema.safeParse({
        species: '',
        name: '',
        order: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid lifecycle stage', () => {
      const result = lifeCycleStageSchema.parse({
        species: '1',
        name: 'Juvenile',
        order: '2',
        description: 'Early growth stage',
        expected_weight_min_g: '10.00',
        expected_weight_max_g: '50.00',
        expected_length_min_cm: '5.00',
        expected_length_max_cm: '10.00',
      })
      expect(result.name).toBe('Juvenile')
      expect(result.order).toBe(2)
      expect(result.expected_weight_min_g).toBe('10.00')
    })

    it('handles optional weight and length fields', () => {
      const result = lifeCycleStageSchema.parse({
        species: '1',
        name: 'Fry',
        order: '1',
        expected_weight_min_g: '',
        expected_weight_max_g: '',
      })
      expect(result.expected_weight_min_g).toBeUndefined()
      expect(result.expected_weight_max_g).toBeUndefined()
    })
  })

  describe('batchContainerAssignmentSchema', () => {
    it('validates required fields', () => {
      const result = batchContainerAssignmentSchema.safeParse({
        batch: '',
        container: '',
        lifecycle_stage: '',
        population_count: '',
        assignment_date: '',
        avg_weight_g: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid assignment', () => {
      const result = batchContainerAssignmentSchema.parse({
        batch: '1',
        container: '1',
        lifecycle_stage: '1',
        population_count: '1000',
        assignment_date: '2024-10-01',
        removal_date: '2024-12-01',
        avg_weight_g: '150.50',
        notes: 'Initial placement',
      })
      expect(result.batch).toBe(1)
      expect(result.population_count).toBe(1000)
      expect(result.avg_weight_g).toBe('150.50')
    })

    it('rejects negative population count', () => {
      const result = batchContainerAssignmentSchema.safeParse({
        batch: '1',
        container: '1',
        lifecycle_stage: '1',
        population_count: '-100',
        assignment_date: '2024-10-01',
        avg_weight_g: '150',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('batchTransferSchema', () => {
    it('validates required fields', () => {
      const result = batchTransferSchema.safeParse({
        batch: '',
        from_container: '',
        to_container: '',
        transfer_date: '',
        population_transferred: '',
        avg_weight_g: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid transfer', () => {
      const result = batchTransferSchema.parse({
        batch: '1',
        from_container: '1',
        to_container: '2',
        transfer_date: '2024-10-15',
        population_transferred: '500',
        avg_weight_g: '200.00',
        notes: 'Routine transfer',
      })
      expect(result.from_container).toBe(1)
      expect(result.to_container).toBe(2)
      expect(result.population_transferred).toBe(500)
    })
  })

  describe('growthSampleSchema', () => {
    it('validates required fields', () => {
      const result = growthSampleSchema.safeParse({
        batch: '',
        container: '',
        sample_date: '',
        sample_size: '',
        avg_weight_g: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid growth sample', () => {
      const result = growthSampleSchema.parse({
        batch: '1',
        container: '1',
        sample_date: '2024-10-15',
        sample_size: '50',
        avg_weight_g: '175.25',
        avg_length_cm: '15.50',
        notes: 'Weekly sample',
      })
      expect(result.sample_size).toBe(50)
      expect(result.avg_weight_g).toBe('175.25')
      expect(result.avg_length_cm).toBe('15.50')
    })

    it('handles optional length field', () => {
      const result = growthSampleSchema.parse({
        batch: '1',
        container: '1',
        sample_date: '2024-10-15',
        sample_size: '50',
        avg_weight_g: '175',
        avg_length_cm: '',
      })
      expect(result.avg_length_cm).toBeUndefined()
    })
  })

  describe('mortalityEventSchema', () => {
    it('validates required fields', () => {
      const result = mortalityEventSchema.safeParse({
        batch: '',
        container: '',
        event_date: '',
        mortality_count: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid mortality event', () => {
      const result = mortalityEventSchema.parse({
        batch: '1',
        container: '1',
        event_date: '2024-10-15',
        mortality_count: '10',
        mortality_reason: '1',
        avg_weight_g: '150.00',
        notes: 'Natural causes',
      })
      expect(result.mortality_count).toBe(10)
      expect(result.mortality_reason).toBe(1)
    })

    it('handles optional reason and weight fields', () => {
      const result = mortalityEventSchema.parse({
        batch: '1',
        container: '1',
        event_date: '2024-10-15',
        mortality_count: '10',
        avg_weight_g: '',
      })
      expect(result.mortality_reason).toBeUndefined()
      expect(result.avg_weight_g).toBeUndefined()
    })
  })
})
