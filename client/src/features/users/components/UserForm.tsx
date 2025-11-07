import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userFormSchema, userCreateSchema, type UserFormData, type UserCreateData } from '@/lib/validation/users'

// Form data type that excludes readonly API fields
type UserFormInput = {
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  geography?: 'FO' | 'SC' | 'ALL';
  subsidiary?: 'BS' | 'FW' | 'FM' | 'LG' | 'ALL';
  role?: 'ADMIN' | 'MGR' | 'OPR' | 'VET' | 'QA' | 'FIN' | 'VIEW';
  password?: string;
  password_confirm?: string;
  is_active?: boolean;
}
import { FormLayout, FormSection } from '@/features/shared/components/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser, useUpdateUser } from '../api'
import type { User } from '@/api/generated'

interface UserFormProps {
  /** Existing user to edit (undefined for create mode) */
  user?: User
  /** Callback when form submission succeeds */
  onSuccess?: () => void
  /** Callback when user cancels */
  onCancel?: () => void
}

/**
 * User create/edit form component.
 *
 * Handles user creation and editing with RBAC fields:
 * - Basic info: username, email, full name, phone
 * - RBAC: role, geography, subsidiary
 * - Security: password (create only), active status
 *
 * @example
 * ```tsx
 * // Create mode
 * <UserForm onSuccess={() => console.log('Created!')} />
 *
 * // Edit mode
 * <UserForm user={existingUser} onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const isEditMode = !!user
  const schema = isEditMode ? userFormSchema : userCreateSchema

  const form = useForm<UserFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      role: user?.role || undefined,
      geography: user?.geography || undefined,
      subsidiary: user?.subsidiary || undefined,
      password: '', // Never pre-fill passwords
      password_confirm: '', // Never pre-fill password confirmation
      is_active: user?.is_active ?? true,
    },
  })

  const createMutation = useCreateUser()
  const updateMutation = isEditMode ? useUpdateUser(user.id) : null

  const onSubmit = async (values: UserFormInput) => {
    try {
      // Remove password_confirm from the data before sending to API
      const { password_confirm, ...apiData } = values

      if (isEditMode && user) {
        await updateMutation!.mutateAsync(apiData as any)
      } else {
        await createMutation.mutateAsync(apiData as any)
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('User form submission error:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    onCancel?.()
  }

  const roleOptions = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'MGR', label: 'Manager' },
    { value: 'OPR', label: 'Operator' },
    { value: 'VET', label: 'Veterinarian' },
    { value: 'QA', label: 'Quality Assurance' },
    { value: 'FIN', label: 'Finance' },
    { value: 'VIEW', label: 'Viewer' },
  ]

  const geographyOptions = [
    { value: 'FO', label: 'Faroe Islands' },
    { value: 'SC', label: 'Scotland' },
    { value: 'ALL', label: 'All Geographies' },
  ]

  const subsidiaryOptions = [
    { value: 'BS', label: 'Broodstock' },
    { value: 'FW', label: 'Freshwater' },
    { value: 'FM', label: 'Farming' },
    { value: 'LG', label: 'Logistics' },
    { value: 'ALL', label: 'All Subsidiaries' },
  ]

  return (
    <FormLayout
      form={form}
      onSubmit={onSubmit}
      header={{
        title: isEditMode ? 'Edit User' : 'Create User',
        description: isEditMode
          ? 'Update user account details and permissions.'
          : 'Create a new user account with appropriate role and access level.',
      }}
      actions={{
        primaryAction: {
          type: 'submit',
          children: isEditMode ? 'Update User' : 'Create User',
          disabled: form.formState.isSubmitting,
        },
        secondaryAction: onCancel ? {
          type: 'button',
          variant: 'outline',
          children: 'Cancel',
          onClick: handleCancel,
        } : undefined,
      }}
    >
      <FormSection
        title="Account Information"
        description="Basic user account details and authentication."
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user-username">Username *</FormLabel>
              <FormControl>
                <Input
                  id="user-username"
                  aria-label="Username"
                  placeholder="e.g., jsmith"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user-email">Email *</FormLabel>
              <FormControl>
                <Input
                  id="user-email"
                  aria-label="Email"
                  type="email"
                  placeholder="e.g., john.smith@aquamind.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEditMode && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="user-password">Password *</FormLabel>
                  <FormControl>
                    <Input
                      id="user-password"
                      aria-label="Password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="user-password-confirm">Confirm Password *</FormLabel>
                  <FormControl>
                    <Input
                      id="user-password-confirm"
                      aria-label="Confirm Password"
                      type="password"
                      placeholder="Re-enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Re-enter the password to confirm
                  </p>
                </FormItem>
              )}
            />
          </>
        )}
      </FormSection>

      <FormSection
        title="Personal Information"
        description="Optional personal details for the user."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="user-full-name">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="user-full-name"
                    aria-label="Full Name"
                    placeholder="e.g., John Smith"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="user-phone">Phone</FormLabel>
                <FormControl>
                  <Input
                    id="user-phone"
                    aria-label="Phone"
                    placeholder="e.g., +298 123456"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormSection>

      <FormSection
        title="Role & Permissions"
        description="Assign user role and access permissions."
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user-role">Role *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger id="user-role" aria-label="Role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Determines what the user can access and modify
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="geography"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user-geography">Geography</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger id="user-geography" aria-label="Geography">
                    <SelectValue placeholder="Select geography access" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {geographyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Limits data access to specific geographic regions
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subsidiary"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user-subsidiary">Subsidiary</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger id="user-subsidiary" aria-label="Subsidiary">
                    <SelectValue placeholder="Select subsidiary access" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subsidiaryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Limits data access to specific business units
              </p>
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        title="Account Status"
        description="Control user account activation."
      >
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  id="user-active"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                />
              </FormControl>
              <FormLabel htmlFor="user-active" className="font-normal">
                Account Active
              </FormLabel>
              <p className="text-xs text-muted-foreground">
                Inactive users cannot log in
              </p>
            </FormItem>
          )}
        />
      </FormSection>
    </FormLayout>
  )
}
