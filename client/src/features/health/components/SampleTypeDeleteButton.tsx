import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteSampleType } from '../api'
import type { SampleType } from '@/api/generated'

interface SampleTypeDeleteButtonProps {
  sampleType: SampleType
  onSuccess?: () => void
  className?: string
  iconOnly?: boolean
}

/**
 * Delete button for SampleType entities with audit trail.
 */
export function SampleTypeDeleteButton({
  sampleType,
  onSuccess,
  className,
  iconOnly = false,
}: SampleTypeDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteSampleType()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Sample Type Deletion',
      description: `You are about to delete the sample type "${sampleType.name}". This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this sample type (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: sampleType.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete sample type error:', error)
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
          aria-label={`Delete sample type ${sampleType.name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Sample Type'}
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




