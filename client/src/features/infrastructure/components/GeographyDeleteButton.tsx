import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteGeography } from '../api'
import type { Geography } from '@/api/generated'

interface GeographyDeleteButtonProps {
  /** Geography to delete */
  geography: Geography
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for Geography entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates geography queries on success
 * 
 * @example
 * ```tsx
 * <GeographyDeleteButton
 *   geography={myGeography}
 *   onSuccess={() => navigate('/infrastructure')}
 * />
 * ```
 */
export function GeographyDeleteButton({
  geography,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: GeographyDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteGeography()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Geography',
      description: `This will permanently delete "${geography.name}" and all associated data. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Region no longer in use, consolidating regions...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: geography.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete geography error:', error)
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
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Geography'}
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
