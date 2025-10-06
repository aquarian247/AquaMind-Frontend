import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

export interface FormActionsProps {
  primaryAction?: ButtonProps
  secondaryAction?: ButtonProps
  isSubmitting?: boolean
  className?: string
}

export function FormActions({ primaryAction, secondaryAction, isSubmitting, className }: FormActionsProps) {
  if (!primaryAction && !secondaryAction) {
    return null
  }

  return (
    <div className={cn('flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end', className)}>
      {secondaryAction && (
        <Button variant="outline" {...secondaryAction} />
      )}
      {primaryAction && (
        <Button {...primaryAction} disabled={isSubmitting || primaryAction.disabled}>
          {isSubmitting ? 'Saving…' : primaryAction.children ?? 'Save'}
        </Button>
      )}
    </div>
  )}
