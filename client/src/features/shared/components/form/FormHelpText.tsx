import { cn } from '@/lib/utils'

export interface FormHelpTextProps {
  message: string
  icon?: React.ReactNode
  className?: string
}

export function FormHelpText({ message, icon, className }: FormHelpTextProps) {
  return (
    <div className={cn('flex items-start gap-2 rounded-md border border-dashed border-border bg-muted/40 p-3 text-sm text-muted-foreground', className)}>
      {icon && <span className="mt-0.5 text-muted-foreground/80">{icon}</span>}
      <span>{message}</span>
    </div>
  )
}
