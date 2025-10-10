import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteTreatment } from '../api'
import type { Treatment } from '@/api/generated'

interface TreatmentDeleteButtonProps {
  treatment: Treatment
  onSuccess?: () => void
  className?: string
  iconOnly?: boolean
}

/**
 * Delete button for Treatment entities with audit trail.
 */
export function TreatmentDeleteButton({
  treatment,
  onSuccess,
  className,
  iconOnly = false,
}: TreatmentDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteTreatment()

  const handleDelete = async () => {
    const treatmentDate = treatment.treatment_date
      ? new Date(treatment.treatment_date).toLocaleDateString()
      : 'Unknown date'
    
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Treatment Deletion',
      description: `You are about to delete the ${treatment.treatment_type} treatment from ${treatmentDate} (Batch ID: ${treatment.batch}). This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this treatment (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: treatment.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete treatment error:', error)
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
          aria-label={`Delete treatment from ${treatment.treatment_date}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Treatment'}
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



