import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteJournalEntry } from '../api'
import type { JournalEntry } from '@/api/generated'

interface JournalEntryDeleteButtonProps {
  /** Journal entry to delete */
  journalEntry: JournalEntry
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for JournalEntry entities with audit trail.
 *
 * Features:
 * - Permission gate (Manager+ only)
 * - Audit reason dialog (required, min 10 chars)
 * - Confirmation flow with detailed messaging
 * - Automatic query invalidation
 * - Success/error toast notifications
 *
 * @example
 * ```tsx
 * <JournalEntryDeleteButton
 *   journalEntry={journalEntry}
 *   onSuccess={() => refetch()}
 * />
 * ```
 */
export function JournalEntryDeleteButton({
  journalEntry,
  onSuccess,
  className,
  iconOnly = false,
}: JournalEntryDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteJournalEntry()

  const handleDelete = async () => {
    const entryDate = journalEntry.entry_date
      ? new Date(journalEntry.entry_date).toLocaleDateString()
      : 'Unknown date'
    
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Journal Entry Deletion',
      description: `You are about to delete the ${journalEntry.category} entry from ${entryDate} (Batch ID: ${journalEntry.batch}). This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder:
        'Enter reason for deleting this journal entry (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: journalEntry.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete journal entry error:', error)
      }
    }
  }

  return (
    <>
      <DeleteGate fallback={null}>
        <Button
          variant="destructive"
          size={iconOnly ? 'icon' : 'default'}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={className}
          aria-label={`Delete journal entry from ${journalEntry.entry_date}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Entry'}
        </Button>
      </DeleteGate>

      <AuditReasonDialog
        open={dialogState.isOpen}
        options={dialogState.options}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
      />
    </>
  )
}

