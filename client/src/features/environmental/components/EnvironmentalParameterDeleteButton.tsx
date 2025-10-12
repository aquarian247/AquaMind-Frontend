import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteGate } from '@/features/shared/permissions';
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit';
import { useDeleteEnvironmentalParameter } from '../api';
import type { EnvironmentalParameter } from '@/api/generated';

interface EnvironmentalParameterDeleteButtonProps {
  parameter: EnvironmentalParameter;
  onSuccess?: () => void;
  className?: string;
  iconOnly?: boolean;
}

/**
 * Delete button for EnvironmentalParameter entities with audit trail.
 */
export function EnvironmentalParameterDeleteButton({
  parameter,
  onSuccess,
  className,
  iconOnly = false,
}: EnvironmentalParameterDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt();
  const deleteMutation = useDeleteEnvironmentalParameter();

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Environmental Parameter Deletion',
      description: `You are about to delete the environmental parameter "${parameter.name} (${parameter.unit})". This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this parameter (min 10 characters)...',
    });

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync(parameter.id);
        onSuccess?.();
      } catch (error) {
        console.error('Delete environmental parameter error:', error);
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
          aria-label={`Delete environmental parameter ${parameter.name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Parameter'}
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

