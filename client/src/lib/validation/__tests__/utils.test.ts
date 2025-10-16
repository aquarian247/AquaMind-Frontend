import { describe, it, expect } from 'vitest'
import {
  nonEmptyString,
  optionalString,
  optionalNumericString,
  requiredNumericString,
  booleanWithDefault,
  dateString,
  optionalDateString,
} from '../utils/common'
import {
  decimalString,
  optionalDecimalString,
  latitudeString,
  longitudeString,
  positiveDecimalString,
} from '../utils/coercion'

describe('Common Validators', () => {
  describe('nonEmptyString', () => {
    it('accepts non-empty strings', () => {
      const result = nonEmptyString.parse('test')
      expect(result).toBe('test')
    })

    it('trims whitespace', () => {
      const result = nonEmptyString.parse('  test  ')
      expect(result).toBe('test')
    })

    it('rejects empty strings', () => {
      const result = nonEmptyString.safeParse('')
      expect(result.success).toBe(false)
    })

    it('rejects whitespace-only strings', () => {
      const result = nonEmptyString.safeParse('   ')
      expect(result.success).toBe(false)
    })
  })

  describe('optionalString', () => {
    it('accepts non-empty strings', () => {
      const result = optionalString.parse('test')
      expect(result).toBe('test')
    })

    it('converts empty string to undefined', () => {
      const result = optionalString.parse('')
      expect(result).toBeUndefined()
    })

    it('accepts explicit undefined', () => {
      const result = optionalString.parse(undefined)
      expect(result).toBeUndefined()
    })
  })

  describe('optionalNumericString', () => {
    it('converts valid numeric string to number', () => {
      const result = optionalNumericString.parse('123.45')
      expect(result).toBe(123.45)
    })

    it('converts empty string to undefined', () => {
      const result = optionalNumericString.parse('')
      expect(result).toBeUndefined()
    })

    it('handles invalid numbers gracefully', () => {
      const result = optionalNumericString.parse('abc')
      expect(result).toBeUndefined()
    })
  })

  describe('requiredNumericString', () => {
    it('converts valid numeric string to number', () => {
      const result = requiredNumericString.parse('123.45')
      expect(result).toBe(123.45)
    })

    it('rejects empty strings', () => {
      expect(() => requiredNumericString.parse('')).toThrow()
    })

    it('rejects invalid numbers', () => {
      expect(() => requiredNumericString.parse('abc')).toThrow()
    })
  })

  describe('booleanWithDefault', () => {
    it('accepts boolean true', () => {
      const result = booleanWithDefault().parse(true)
      expect(result).toBe(true)
    })

    it('accepts boolean false', () => {
      const result = booleanWithDefault().parse(false)
      expect(result).toBe(false)
    })

    it('converts string "true" to boolean', () => {
      const result = booleanWithDefault().parse('true')
      expect(result).toBe(true)
    })

    it('converts string "false" to boolean', () => {
      const result = booleanWithDefault().parse('false')
      expect(result).toBe(false)
    })

    it('applies default value', () => {
      const result = booleanWithDefault(true).parse(undefined)
      expect(result).toBe(true)
    })
  })

  describe('dateString', () => {
    it('accepts valid YYYY-MM-DD format', () => {
      const result = dateString.parse('2024-10-06')
      expect(result).toBe('2024-10-06')
    })

    it('rejects invalid format', () => {
      expect(() => dateString.parse('10/06/2024')).toThrow()
    })

    it('rejects partial dates', () => {
      expect(() => dateString.parse('2024-10')).toThrow()
    })
  })

  describe('optionalDateString', () => {
    it('accepts valid YYYY-MM-DD format', () => {
      const result = optionalDateString.parse('2024-10-06')
      expect(result).toBe('2024-10-06')
    })

    it('converts empty string to undefined', () => {
      const result = optionalDateString.parse('')
      expect(result).toBeUndefined()
    })
  })
})

describe('Coercion Utilities', () => {
  describe('decimalString', () => {
    it('formats valid number to fixed decimal places', () => {
      const schema = decimalString({ required: true, decimalPlaces: 2 })
      const result = schema.parse('123.456')
      expect(result).toBe('123.46')
    })

    it('enforces minimum value', () => {
      const schema = decimalString({ required: true, min: 10 })
      const result = schema.safeParse('5')
      expect(result.success).toBe(false)
    })

    it('enforces maximum value', () => {
      const schema = decimalString({ required: true, max: 100 })
      const result = schema.safeParse('150')
      expect(result.success).toBe(false)
    })

    it('rejects non-numeric strings', () => {
      const schema = decimalString({ required: true })
      const result = schema.safeParse('abc')
      expect(result.success).toBe(false)
    })

    it('allows empty string when not required', () => {
      const schema = decimalString({ required: false })
      const result = schema.parse('')
      expect(result).toBe('')
    })
  })

  describe('optionalDecimalString', () => {
    it('formats valid number to fixed decimal places', () => {
      const schema = optionalDecimalString({ decimalPlaces: 2 })
      const result = schema.parse('123.456')
      expect(result).toBe('123.46')
    })

    it('converts empty string to undefined', () => {
      const schema = optionalDecimalString()
      const result = schema.parse('')
      expect(result).toBeUndefined()
    })

    it('enforces range constraints', () => {
      const schema = optionalDecimalString({ min: 0, max: 100 })
      const resultMin = schema.safeParse('-5')
      const resultMax = schema.safeParse('150')
      expect(resultMin.success).toBe(false)
      expect(resultMax.success).toBe(false)
    })
  })

  describe('latitudeString', () => {
    it('accepts valid latitude', () => {
      const result = latitudeString.parse('60.123456')
      expect(result).toBe('60.123456')
    })

    it('rejects latitude > 90', () => {
      const result = latitudeString.safeParse('95')
      expect(result.success).toBe(false)
    })

    it('rejects latitude < -90', () => {
      const result = latitudeString.safeParse('-95')
      expect(result.success).toBe(false)
    })
  })

  describe('longitudeString', () => {
    it('accepts valid longitude', () => {
      const result = longitudeString.parse('5.123456')
      expect(result).toBe('5.123456')
    })

    it('rejects longitude > 180', () => {
      const result = longitudeString.safeParse('185')
      expect(result.success).toBe(false)
    })

    it('rejects longitude < -180', () => {
      const result = longitudeString.safeParse('-185')
      expect(result.success).toBe(false)
    })
  })

  describe('positiveDecimalString', () => {
    it('accepts positive numbers', () => {
      const schema = positiveDecimalString({ required: true })
      const result = schema.parse('123.45')
      expect(result).toBe('123.45')
    })

    it('accepts zero', () => {
      const schema = positiveDecimalString({ required: true })
      const result = schema.parse('0')
      expect(result).toBe('0.00')
    })

    it('rejects negative numbers', () => {
      const schema = positiveDecimalString({ required: true })
      const result = schema.safeParse('-10')
      expect(result.success).toBe(false)
    })
  })
})
