/**
 * Audit trail utilities for capturing change reasons.
 * 
 * This module provides hooks and components for prompting users to provide
 * reasons for changes, which are then passed to the backend for audit trails.
 * 
 * @example Using audit reason prompt
 * ```tsx
 * function DeleteButton() {
 *   const { promptReason, dialogState } = useAuditReasonPrompt()
 *   const deleteMutation = useCrudMutation({ ... })
 *   
 *   const handleDelete = async () => {
 *     const { confirmed, reason } = await promptReason({
 *       title: 'Confirm Delete',
 *       description: 'This action cannot be undone',
 *       required: true
 *     })
 *     
 *     if (confirmed) {
 *       await deleteMutation.mutateAsync({
 *         id: item.id,
 *         change_reason: reason
 *       })
 *     }
 *   }
 *   
 *   return (
 *     <>
 *       <Button onClick={handleDelete}>Delete</Button>
 *       <AuditReasonDialog {...dialogState} />
 *     </>
 *   )
 * }
 * ```
 */

// Types
export type {
  AuditReason,
  AuditReasonPromptOptions,
  AuditReasonPromptResult,
} from './types'

// Hooks
export { useAuditReasonPrompt } from './useAuditReasonPrompt'

// Components
export { AuditReasonDialog } from './AuditReasonDialog'
