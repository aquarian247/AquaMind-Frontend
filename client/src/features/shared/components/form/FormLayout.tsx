import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { FormHeader, type FormHeaderProps } from './FormHeader'
import { FormActions, type FormActionsProps } from './FormActions'

export interface FormLayoutProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  onSubmit: (values: TFormValues) => void
  header: FormHeaderProps
  actions?: FormActionsProps
  className?: string
  children: React.ReactNode
}

export function FormLayout<TFormValues extends FieldValues>({
  form,
  onSubmit,
  header,
  actions,
  className,
  children,
}: FormLayoutProps<TFormValues>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-6', className)}
        noValidate
      >
        <FormHeader {...header} />
        <div className="space-y-6">{children}</div>
        <FormActions {...actions} isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  )
}
