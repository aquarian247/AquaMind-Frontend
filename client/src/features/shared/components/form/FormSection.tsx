import { cn } from '@/lib/utils'

export interface FormSectionProps {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function FormSection({ title, description, className, children }: FormSectionProps) {
  return (
    <section className={cn('space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm', className)}>
      {(title || description) && (
        <header className="space-y-1">
          {title && <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  )
}
