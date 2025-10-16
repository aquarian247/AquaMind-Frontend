import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteArea } from '../api'
import type { Area } from '@/api/generated'

interface AreaDeleteButtonProps {
  /** Area to delete */
  area: Area
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for Area entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates area queries on success
 * 
 * @example
 * ```tsx
 * <AreaDeleteButton
 *   area={myArea}
 *   onSuccess={() => navigate('/infrastructure/areas')}
 * />
 * ```
 */
export function AreaDeleteButton({
  area,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: AreaDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteArea()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Area',
      description: `This will permanently delete "${area.name}" and all associated data. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Site decommissioned, area relocated...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: area.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete area error:', error)
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
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Area'}
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
