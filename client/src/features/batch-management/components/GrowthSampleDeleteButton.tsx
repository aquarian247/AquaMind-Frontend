import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteGrowthSample } from '../api'
import type { GrowthSample } from '@/api/generated'

interface GrowthSampleDeleteButtonProps {
  /** Growth sample to delete */
  growthSample: GrowthSample
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for GrowthSample entities with audit trail.
 */
export function GrowthSampleDeleteButton({
  growthSample,
  onSuccess,
  className,
  iconOnly = false,
}: GrowthSampleDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteGrowthSample()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Growth Sample Deletion',
      description: `You are about to delete growth sample from ${growthSample.sample_date}. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this growth sample (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: growthSample.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete growth sample error:', error)
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
          aria-label="Delete growth sample"
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Sample'}
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



