/**
 * Types for audit trail and change reason capture.
 */

/**
 * Change reason captured for audit trail.
 */
export interface AuditReason {
  /** User-provided reason for the change */
  reason: string
  /** Type of operation */
  operation: 'create' | 'update' | 'delete'
  /** Optional additional context */
  metadata?: Record<string, any>
}

/**
 * Options for audit reason prompt.
 */
export interface AuditReasonPromptOptions {
  /** Title of the prompt dialog */
  title?: string
  /** Description/help text */
  description?: string
  /** Placeholder text for input */
  placeholder?: string
  /** Whether reason is required (default: false for create/update, true for delete) */
  required?: boolean
  /** Minimum length for reason (default: 3) */
  minLength?: number
  /** Maximum length for reason (default: 500) */
  maxLength?: number
}

/**
 * Result from audit reason prompt.
 */
export interface AuditReasonPromptResult {
  /** Whether user confirmed (provided reason and clicked OK) */
  confirmed: boolean
  /** User-provided reason (empty string if cancelled) */
  reason: string
}


