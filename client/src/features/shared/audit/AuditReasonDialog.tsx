import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import type { AuditReasonPromptOptions } from './types'

interface AuditReasonDialogProps {
  /** Whether dialog is open */
  open: boolean
  /** Dialog options */
  options: AuditReasonPromptOptions
  /** Callback when user confirms with reason */
  onConfirm: (reason: string) => void
  /** Callback when user cancels */
  onCancel: () => void
}

/**
 * Dialog component for capturing audit trail change reasons.
 * Used in conjunction with useAuditReasonPrompt hook.
 */
export function AuditReasonDialog({
  open,
  options,
  onConfirm,
  onCancel,
}: AuditReasonDialogProps) {
  const {
    title = 'Change Reason',
    description = 'Please provide a reason for this change for audit trail purposes.',
    placeholder = 'Enter reason for change...',
    required = false,
    minLength = 3,
    maxLength = 500,
  } = options

  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setReason('')
      setError(null)
    }
  }, [open])

  // Validate reason
  const validateReason = (value: string): string | null => {
    const trimmed = value.trim()
    
    if (required && trimmed.length === 0) {
      return 'Reason is required'
    }
    
    if (trimmed.length > 0 && trimmed.length < minLength) {
      return `Reason must be at least ${minLength} characters`
    }
    
    if (trimmed.length > maxLength) {
      return `Reason must not exceed ${maxLength} characters`
    }
    
    return null
  }

  // Handle confirm
  const handleConfirm = () => {
    const validationError = validateReason(reason)
    
    if (validationError) {
      setError(validationError)
      return
    }
    
    onConfirm(reason.trim())
  }

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value)
    setError(null) // Clear error on change
  }

  // Handle key press (Enter to confirm, Esc to cancel)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="audit-reason">
              Reason {required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="audit-reason"
              placeholder={placeholder}
              value={reason}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={4}
              className={error ? 'border-destructive' : ''}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {reason.length} / {maxLength} characters
              {!required && ' (optional)'}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
        
        <p className="text-xs text-muted-foreground text-center">
          Tip: Press Ctrl+Enter to confirm quickly
        </p>
      </DialogContent>
    </Dialog>
  )
}
