import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'

/**
 * Manage Batches Button
 * Navigates to the Batch Setup page for creating/managing batches,
 * lifecycle stages, assignments, and transfers.
 * 
 * Replaces the old CreateBatchDialog with a navigation approach.
 */
export function CreateBatchDialog() {
  const [, setLocation] = useLocation()

  return (
    <Button onClick={() => setLocation('/batch-setup')}>
      <Settings className="h-4 w-4 mr-2" />
      Manage Batches
    </Button>
  )
}

