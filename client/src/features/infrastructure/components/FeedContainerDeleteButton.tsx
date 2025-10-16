import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteFeedContainer } from '../api'
import type { FeedContainer } from '@/api/generated'

interface FeedContainerDeleteButtonProps {
  /** Feed container to delete */
  feedContainer: FeedContainer
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for FeedContainer entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates feed container queries on success
 * 
 * @example
 * ```tsx
 * <FeedContainerDeleteButton
 *   feedContainer={myFeedContainer}
 *   onSuccess={() => navigate('/infrastructure/feed-containers')}
 * />
 * ```
 */
export function FeedContainerDeleteButton({
  feedContainer,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: FeedContainerDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteFeedContainer()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Feed Container',
      description: `This will permanently delete "${feedContainer.name}" and all associated feed stock records. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Container damaged, no longer in use, replaced...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: feedContainer.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete feed container error:', error)
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
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Feed Container'}
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
