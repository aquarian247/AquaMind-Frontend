import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteHealthLabSample } from '../api'
import type { HealthLabSample } from '@/api/generated'

interface HealthLabSampleDeleteButtonProps {
  labSample: HealthLabSample
  onSuccess?: () => void
  className?: string
  iconOnly?: boolean
}

/**
 * Delete button for HealthLabSample entities with audit trail.
 */
export function HealthLabSampleDeleteButton({
  labSample,
  onSuccess,
  className,
  iconOnly = false,
}: HealthLabSampleDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteHealthLabSample()

  const handleDelete = async () => {
    const sampleDate = labSample.sample_date
      ? new Date(labSample.sample_date).toLocaleDateString()
      : 'Unknown date'
    
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Lab Sample Deletion',
      description: `You are about to delete the lab sample (${labSample.sample_type_name}) from ${sampleDate} (Ref: ${labSample.lab_reference_id || 'N/A'}). This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this lab sample (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: labSample.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete lab sample error:', error)
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
          aria-label={`Delete lab sample from ${labSample.sample_date}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Lab Sample'}
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




