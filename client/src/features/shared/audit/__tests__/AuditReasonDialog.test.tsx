import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuditReasonDialog } from '../AuditReasonDialog'

describe('AuditReasonDialog', () => {
  const defaultOptions = {
    title: 'Change Reason',
    description: 'Please provide a reason',
    placeholder: 'Enter reason...',
    required: false,
    minLength: 3,
    maxLength: 500,
  }

  it('renders when open', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    expect(screen.getByText('Change Reason')).toBeInTheDocument()
    expect(screen.getByText('Please provide a reason')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={false}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    expect(screen.queryByText('Change Reason')).not.toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm with reason when confirm button clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter reason...')
    await user.type(textarea, 'Test reason')

    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(onConfirm).toHaveBeenCalledWith('Test reason')
  })

  it('trims whitespace from reason', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter reason...')
    await user.type(textarea, '  Test reason  ')

    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(onConfirm).toHaveBeenCalledWith('Test reason')
  })

  it('validates required field', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={{ ...defaultOptions, required: true }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(screen.getByText('Reason is required')).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('validates minimum length', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={{ ...defaultOptions, minLength: 5 }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter reason...')
    await user.type(textarea, 'Hi')

    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(screen.getByText(/must be at least 5 characters/i)).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('validates maximum length', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={{ ...defaultOptions, maxLength: 10 }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter reason...')
    await user.type(textarea, 'This is a very long reason that exceeds the limit')

    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(screen.getByText(/must not exceed 10 characters/i)).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('shows character count', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    // Text is split across elements, use regex matcher
    expect(screen.getByText(/0.*\/.*500.*characters/)).toBeInTheDocument()

    const textarea = screen.getByPlaceholderText('Enter reason...')
    await user.type(textarea, 'Test')

    await waitFor(() => {
      expect(screen.getByText(/4.*\/.*500.*characters/)).toBeInTheDocument()
    })
  })

  it('clears error on input change', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={{ ...defaultOptions, required: true }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    // Trigger error
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(screen.getByText('Reason is required')).toBeInTheDocument()

    // Type to clear error
    const textarea = screen.getByPlaceholderText('Enter reason...')
    await user.type(textarea, 'Test')

    expect(screen.queryByText('Reason is required')).not.toBeInTheDocument()
  })

  it('resets reason when dialog reopens', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    const { rerender } = render(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const textarea = screen.getByPlaceholderText('Enter reason...')
    await userEvent.type(textarea, 'First reason')

    // Close dialog
    rerender(
      <AuditReasonDialog
        open={false}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    // Reopen dialog
    rerender(
      <AuditReasonDialog
        open={true}
        options={defaultOptions}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const newTextarea = screen.getByPlaceholderText('Enter reason...')
    expect(newTextarea).toHaveValue('')
  })

  it('shows required indicator when required', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={{ ...defaultOptions, required: true }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    // Check asterisk renders (required indicator)
    expect(screen.getByText('*')).toBeInTheDocument()
    // Check textarea is present
    expect(screen.getByPlaceholderText('Enter reason...')).toBeInTheDocument()
  })

  it('shows optional indicator when not required', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <AuditReasonDialog
        open={true}
        options={{ ...defaultOptions, required: false }}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    expect(screen.getByText(/optional/i)).toBeInTheDocument()
  })
})
