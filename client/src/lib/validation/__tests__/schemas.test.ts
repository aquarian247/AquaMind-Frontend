import { speciesSchema } from '../schemas'

describe('speciesSchema', () => {
  it('validates required fields', () => {
    const result = speciesSchema.safeParse({
      name: '',
      scientific_name: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const errorPaths = result.error.issues.map((issue) => issue.path.join('.'))
      expect(errorPaths).toEqual(expect.arrayContaining(['name', 'scientific_name']))
    }
  })

  it('strips empty optional fields', () => {
    const result = speciesSchema.parse({
      name: 'Atlantic Salmon',
      scientific_name: 'Salmo salar',
      description: '',
    })

    expect(result.description).toBeUndefined()
    expect(result.optimal_ph_max).toBeUndefined()
  })
})
