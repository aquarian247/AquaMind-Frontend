import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { speciesSchema, type SpeciesFormValues } from '@/lib/validation/schemas'
import { ApiService, type Species } from '@/api/generated'
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation'
import { FormLayout } from '@/features/shared/components/form/FormLayout'
import { FormSection } from '@/features/shared/components/form/FormSection'
import { FormHelpText } from '@/features/shared/components/form/FormHelpText'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'

const speciesQueryKey = ['api', 'v1', 'batch', 'species'] as const

type SpeciesCreatePayload = Omit<Species, 'id' | 'created_at' | 'updated_at'>

const blankable = (value?: string | null): string | null | undefined => {
  if (value === undefined || value === null) return undefined
  return value.trim().length === 0 ? null : value
}

export function SpeciesExampleForm() {
  const form = useForm<SpeciesFormValues>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      name: '',
      scientific_name: '',
      description: undefined,
      optimal_temperature_min: undefined,
      optimal_temperature_max: undefined,
      optimal_oxygen_min: undefined,
      optimal_ph_min: undefined,
      optimal_ph_max: undefined,
    },
  })

  const speciesListQuery = useQuery({
    queryKey: speciesQueryKey,
    queryFn: () => ApiService.apiV1BatchSpeciesList(),
  })

  const createSpecies = useCrudMutation({
    mutationFn: (payload: SpeciesCreatePayload) => ApiService.apiV1BatchSpeciesCreate(payload as Species),
    description: 'Species created successfully',
    invalidateQueries: [speciesQueryKey],
    mutationOptions: {
      onSuccess: async () => {
        form.reset()
      },
    },
  })

  const existingNames = useMemo(
    () => speciesListQuery.data?.results?.map((species) => species.name.toLowerCase()) ?? [],
    [speciesListQuery.data]
  )

  const onSubmit = async (values: SpeciesFormValues) => {
    if (existingNames.includes(values.name.toLowerCase())) {
      form.setError('name', { message: 'Species name must be unique' })
      return
    }

    const payload: SpeciesCreatePayload = {
      name: values.name,
      scientific_name: values.scientific_name,
      description: blankable(values.description) ?? undefined,
      optimal_temperature_min: blankable(values.optimal_temperature_min) ?? undefined,
      optimal_temperature_max: blankable(values.optimal_temperature_max) ?? undefined,
      optimal_oxygen_min: blankable(values.optimal_oxygen_min) ?? undefined,
      optimal_ph_min: blankable(values.optimal_ph_min) ?? undefined,
      optimal_ph_max: blankable(values.optimal_ph_max) ?? undefined,
    }

    await createSpecies.mutateAsync(payload)
  }

  return (
    <div className="space-y-6">
      <FormLayout
        form={form}
        onSubmit={onSubmit}
        header={{
          title: 'Species Reference Form',
          description: 'Demonstrates shared CRUD utilities, validation, and design-system composition for Phase 0 deliverables.',
        }}
        actions={{
          primaryAction: { type: 'submit', children: 'Create Species' },
        }}
      >
        <FormSection title="Species Details" description="Provide taxonomy information for the new species.">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="species-name">Name</FormLabel>
              <FormControl>
                <Input id="species-name" aria-label="Species Name" placeholder="Atlantic Salmon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="scientific_name" render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="species-scientific-name">Scientific Name</FormLabel>
              <FormControl>
                <Input id="species-scientific-name" aria-label="Scientific Name" placeholder="Salmo salar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="species-description">Description</FormLabel>
              <FormControl>
                <Input id="species-description" aria-label="Species Description" placeholder="Optional details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormHelpText message="Leave numeric fields blank if not provided by backend." />

          <FormField
            control={form.control}
            name="optimal_temperature_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="species-opt-temp-min">Optimal Temperature Min (°C)</FormLabel>
                <FormControl>
                  <Input id="species-opt-temp-min" aria-label="Optimal Temperature Min" placeholder="6" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="optimal_temperature_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="species-opt-temp-max">Optimal Temperature Max (°C)</FormLabel>
                <FormControl>
                  <Input id="species-opt-temp-max" aria-label="Optimal Temperature Max" placeholder="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="optimal_oxygen_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="species-opt-oxygen-min">Optimal Oxygen Min (mg/L)</FormLabel>
                <FormControl>
                  <Input id="species-opt-oxygen-min" aria-label="Optimal Oxygen Min" placeholder="7" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="optimal_ph_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="species-opt-ph-min">Optimal pH Min</FormLabel>
                <FormControl>
                  <Input id="species-opt-ph-min" aria-label="Optimal pH Min" placeholder="6.8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="optimal_ph_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="species-opt-ph-max">Optimal pH Max</FormLabel>
                <FormControl>
                  <Input id="species-opt-ph-max" aria-label="Optimal pH Max" placeholder="7.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>
      </FormLayout>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Recently Added Species</h2>
        {speciesListQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {speciesListQuery.isError && (
          <p className="text-sm text-destructive">Failed to load species list.</p>
        )}
        {speciesListQuery.data && (
          <ul className="mt-4 space-y-2 text-sm text-card-foreground">
            {speciesListQuery.data.results.map((species) => (
              <li key={species.id} className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
                <span className="font-medium">{species.name}</span>
                <span className="text-muted-foreground">{species.scientific_name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
