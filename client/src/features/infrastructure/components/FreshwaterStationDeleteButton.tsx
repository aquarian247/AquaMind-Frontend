import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteFreshwaterStation } from '../api'
import type { FreshwaterStation } from '@/api/generated'

interface FreshwaterStationDeleteButtonProps {
  /** Freshwater station to delete */
  station: FreshwaterStation
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for FreshwaterStation entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates freshwater station queries on success
 * 
 * @example
 * ```tsx
 * <FreshwaterStationDeleteButton
 *   station={myStation}
 *   onSuccess={() => navigate('/infrastructure/stations')}
 * />
 * ```
 */
export function FreshwaterStationDeleteButton({
  station,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: FreshwaterStationDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteFreshwaterStation()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Freshwater Station',
      description: `This will permanently delete "${station.name}" and all associated halls and data. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Station decommissioned, facility relocated...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: station.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete freshwater station error:', error)
      }
    }
  }

  return (
    <>
      <DeleteGate fallback={null}>
        <Button
          variant={variant}
          size={size}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Station'}
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
