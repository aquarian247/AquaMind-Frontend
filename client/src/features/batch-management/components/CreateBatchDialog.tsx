import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BatchForm } from './BatchForm'

/**
 * CreateBatchDialog Component
 * Dialog for creating new fish batches with full form validation
 * 
 * Uses production-ready BatchForm component (Phase 2 B2.1)
 * Features: Species FK, lifecycle stage cascading filter, status/type enums, dates
 */
export function CreateBatchDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Batch
      </Button>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>
            Add a new fish batch to the system with species, lifecycle stage, and timeline details.
          </DialogDescription>
        </DialogHeader>
        <BatchForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}

