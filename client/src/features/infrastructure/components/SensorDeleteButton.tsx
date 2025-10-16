import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteSensor } from '../api'
import type { Sensor } from '@/api/generated'

interface SensorDeleteButtonProps {
  /** Sensor to delete */
  sensor: Sensor
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for Sensor entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates sensor queries on success
 * 
 * @example
 * ```tsx
 * <SensorDeleteButton
 *   sensor={mySensor}
 *   onSuccess={() => navigate('/infrastructure/sensors')}
 * />
 * ```
 */
export function SensorDeleteButton({
  sensor,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: SensorDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteSensor()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Sensor',
      description: `This will permanently delete sensor "${sensor.name}" (${sensor.sensor_type}). This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Sensor malfunctioning, replaced with new unit...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: sensor.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete sensor error:', error)
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
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Sensor'}
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
