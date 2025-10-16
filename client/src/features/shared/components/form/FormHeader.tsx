import { cn } from '@/lib/utils'

export interface FormHeaderProps {
  title: string
  description?: string
  className?: string
}

export function FormHeader({ title, description, className }: FormHeaderProps) {
  return (
    <div className={cn('space-y-2 text-left', className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>}
    </div>
  )
}
