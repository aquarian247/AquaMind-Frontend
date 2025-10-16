import { ApiError as AuthApiError } from '@/services/auth.service'

export interface BackendErrorDetail {
  code?: string
  message?: string
  field?: string
}

export interface NormalizedFieldError {
  field: string
  message: string
  code?: string
}

export interface NormalizedError {
  title: string
  message: string
  fieldErrors: NormalizedFieldError[]
  status?: number
  raw?: unknown
}

function mapBackendErrors(details: BackendErrorDetail[]): NormalizedFieldError[] {
  return details
    .filter((detail) => !!detail && (detail.field || detail.message))
    .map((detail) => ({
      field: detail.field ?? 'nonFieldErrors',
      message: detail.message ?? 'Unknown error',
      code: detail.code,
    }))
}

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof AuthApiError) {
    const details = Array.isArray((error as any).data?.errors)
      ? (error as any).data.errors as BackendErrorDetail[]
      : []

    return {
      title: 'Request failed',
      message: error.message,
      fieldErrors: mapBackendErrors(details),
      status: error.status,
      raw: error,
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Unexpected error',
      message: error.message,
      fieldErrors: [],
      raw: error,
    }
  }

  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { status?: number; title?: string; detail?: string; message?: string; errors?: BackendErrorDetail[] }
    const fieldErrors = Array.isArray(maybeError.errors)
      ? mapBackendErrors(maybeError.errors)
      : []

    return {
      title: maybeError.title ?? 'Request failed',
      message: maybeError.detail ?? maybeError.message ?? 'Unknown error',
      fieldErrors,
      status: maybeError.status,
      raw: error,
    }
  }

  return {
    title: 'Unexpected error',
    message: 'Unknown error',
    fieldErrors: [],
    raw: error,
  }
}
