import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteGate } from '@/features/shared/permissions';
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit';
import { useDeletePhotoperiodData } from '../api';
import type { PhotoperiodData } from '@/api/generated';

interface PhotoperiodDataDeleteButtonProps {
  photoperiodData: PhotoperiodData;
  onSuccess?: () => void;
  className?: string;
  iconOnly?: boolean;
}

/**
 * Delete button for PhotoperiodData entities with audit trail.
 */
export function PhotoperiodDataDeleteButton({
  photoperiodData,
  onSuccess,
  className,
  iconOnly = false,
}: PhotoperiodDataDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt();
  const deleteMutation = useDeletePhotoperiodData();

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Photoperiod Data Deletion',
      description: `You are about to delete photoperiod data for "${photoperiodData.area_name}" on ${photoperiodData.date}. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this photoperiod data (min 10 characters)...',
    });

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync(photoperiodData.id);
        onSuccess?.();
      } catch (error) {
        console.error('Delete photoperiod data error:', error);
      }
    }
  };

  return (
    <>
      <DeleteGate fallback={null}>
        <Button
          variant="destructive"
          size={iconOnly ? 'icon' : 'default'}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={className}
          aria-label={`Delete photoperiod data for ${photoperiodData.area_name} on ${photoperiodData.date}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Data'}
        </Button>
      </DeleteGate>

      <AuditReasonDialog
        open={dialogState.isOpen}
        options={dialogState.options}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
      />
    </>
  );
}

