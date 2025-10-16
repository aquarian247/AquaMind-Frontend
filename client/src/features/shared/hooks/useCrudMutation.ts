import React, { useCallback } from 'react'
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { normalizeError, type NormalizedError } from '@/features/shared/api/errorUtils'

type InvalidateQueryKey = string | readonly unknown[]

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>

type CrudMutationOptions<TData, TVariables, TContext> = {
  mutationFn: MutationFn<TData, TVariables>
  description?: string
  invalidateQueries?: InvalidateQueryKey[]
  toastOnSuccess?: boolean
  toastOnError?: boolean
  /** Optional callback to inject audit reason into mutation variables before submission */
  injectAuditReason?: (variables: TVariables, reason: string) => TVariables
  mutationOptions?: UseMutationOptions<TData, NormalizedError, TVariables, TContext>
}

/**
 * Enhanced CRUD mutation hook with toast notifications, query invalidation,
 * and optional audit trail support.
 * 
 * @example Basic usage
 * ```ts
 * const createSpecies = useCrudMutation({
 *   mutationFn: ApiService.apiV1BatchSpeciesCreate,
 *   description: 'Species created successfully',
 *   invalidateQueries: ['species'],
 * })
 * ```
 * 
 * @example With audit reason injection
 * ```ts
 * const deleteContainer = useCrudMutation({
 *   mutationFn: ApiService.apiV1InfrastructureContainersDestroy,
 *   description: 'Container deleted',
 *   invalidateQueries: ['containers'],
 *   injectAuditReason: (variables, reason) => ({
 *     ...variables,
 *     change_reason: reason
 *   })
 * })
 * 
 * // Then use with reason:
 * await deleteContainer.mutateAsync({ id: 1, __auditReason: 'No longer needed' })
 * ```
 */
export function useCrudMutation<TData = unknown, TVariables = void, TContext = unknown>(
  options: CrudMutationOptions<TData, TVariables, TContext>
) {
  const {
    mutationFn,
    description,
    invalidateQueries = [],
    toastOnSuccess = true,
    toastOnError = true,
    injectAuditReason,
    mutationOptions,
  } = options

  const queryClient = useQueryClient()

  const wrappedMutationFn = useCallback(async (variables: TVariables) => {
    try {
      // Extract audit reason if present (convention: __auditReason property)
      let finalVariables = variables
      
      if (injectAuditReason && variables && typeof variables === 'object') {
        const { __auditReason, ...rest } = variables as any
        if (__auditReason) {
          finalVariables = injectAuditReason(rest as TVariables, __auditReason as string)
        }
      }
      
      return await mutationFn(finalVariables)
    } catch (error) {
      throw normalizeError(error)
    }
  }, [mutationFn, injectAuditReason])

  const mutation = useMutation<TData, NormalizedError, TVariables, TContext>({
    mutationFn: wrappedMutationFn,
    onSuccess: async (data, variables, context) => {
      if (toastOnSuccess && description) {
        toast({ title: 'Saved', description })
      }

      await Promise.all(
        invalidateQueries.map((queryKey) =>
          queryClient.invalidateQueries(
            Array.isArray(queryKey) ? { queryKey } : { queryKey: [queryKey] }
          )
        )
      )

      await mutationOptions?.onSuccess?.(data, variables, context)
    },
    onError: async (error, variables, context) => {
      if (toastOnError) {
        toast({
          title: error.title,
          description: error.message,
          variant: 'destructive',
        })
      }

      await mutationOptions?.onError?.(error, variables, context)
    },
    ...mutationOptions,
  })

  return mutation
}
