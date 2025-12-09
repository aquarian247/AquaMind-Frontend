/**
 * Activity Template Table
 *
 * Displays activity templates in a sortable, filterable table.
 * Supports inline actions (edit, delete, toggle active).
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Power,
  PowerOff,
  CalendarDays,
  Scale,
  ArrowRightCircle,
} from 'lucide-react';
import { formatActivityType, getActivityTypeBadgeVariant } from '../utils/activityHelpers';
import { useDeleteActivityTemplate, useUpdateActivityTemplate } from '../api/api';
import { useToast } from '@/hooks/use-toast';
import type { ActivityTemplate } from '../types';

interface ActivityTemplateTableProps {
  templates: ActivityTemplate[];
  onEdit: (template: ActivityTemplate) => void;
  isLoading?: boolean;
}

const triggerTypeIcons = {
  DAY_OFFSET: CalendarDays,
  WEIGHT_THRESHOLD: Scale,
  STAGE_TRANSITION: ArrowRightCircle,
};

const triggerTypeLabels = {
  DAY_OFFSET: 'Day Offset',
  WEIGHT_THRESHOLD: 'Weight',
  STAGE_TRANSITION: 'Stage',
};

function formatTriggerValue(template: ActivityTemplate): string {
  switch (template.trigger_type) {
    case 'DAY_OFFSET':
      return template.day_offset ? `Day ${template.day_offset}` : '—';
    case 'WEIGHT_THRESHOLD':
      return template.weight_threshold_g ? `${template.weight_threshold_g}g` : '—';
    case 'STAGE_TRANSITION':
      return template.target_lifecycle_stage ? `Stage ID: ${template.target_lifecycle_stage}` : '—';
    default:
      return '—';
  }
}

export function ActivityTemplateTable({
  templates,
  onEdit,
  isLoading,
}: ActivityTemplateTableProps) {
  const { toast } = useToast();
  const deleteMutation = useDeleteActivityTemplate();
  const updateMutation = useUpdateActivityTemplate();
  const [templateToDelete, setTemplateToDelete] = useState<ActivityTemplate | null>(null);

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await deleteMutation.mutateAsync(templateToDelete.id);
      toast({
        title: 'Template Deleted',
        description: `"${templateToDelete.name}" has been deleted.`,
      });
      setTemplateToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (template: ActivityTemplate) => {
    try {
      await updateMutation.mutateAsync({
        id: template.id,
        data: { is_active: !template.is_active },
      });
      toast({
        title: template.is_active ? 'Template Deactivated' : 'Template Activated',
        description: `"${template.name}" is now ${template.is_active ? 'inactive' : 'active'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update template',
        variant: 'destructive',
      });
    }
  };

  if (templates.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No templates found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first activity template to automate scheduling for new batches.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => {
              const TriggerIcon = triggerTypeIcons[template.trigger_type];
              return (
                <TableRow
                  key={template.id}
                  className={!template.is_active ? 'opacity-60' : undefined}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      {template.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {template.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActivityTypeBadgeVariant(template.activity_type)}>
                      {formatActivityType(template.activity_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <TriggerIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {triggerTypeLabels[template.trigger_type]}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {template.trigger_type_display}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">
                      {formatTriggerValue(template)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={template.is_active ? 'default' : 'outline'}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(template)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(template)}>
                          {template.is_active ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setTemplateToDelete(template)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!templateToDelete}
        onOpenChange={() => setTemplateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"?
              This action cannot be undone. Existing planned activities created
              from this template will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}




