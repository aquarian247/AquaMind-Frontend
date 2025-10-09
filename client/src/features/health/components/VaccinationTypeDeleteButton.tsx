import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteVaccinationType } from '../api'
import type { VaccinationType } from '@/api/generated'

interface VaccinationTypeDeleteButtonProps {
  vaccinationType: VaccinationType
  onSuccess?: () => void
  className?: string
  iconOnly?: boolean
}

/**
 * Delete button for VaccinationType entities with audit trail.
 */
export function VaccinationTypeDeleteButton({
  vaccinationType,
  onSuccess,
  className,
  iconOnly = false,
}: VaccinationTypeDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteVaccinationType()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Vaccination Type Deletion',
      description: `You are about to delete the vaccination type "${vaccinationType.name}" by ${vaccinationType.manufacturer}. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this vaccination type (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: vaccinationType.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete vaccination type error:', error)
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
          aria-label={`Delete vaccination type ${vaccinationType.name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Vaccination Type'}
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

