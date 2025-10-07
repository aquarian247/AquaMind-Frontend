import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Package, ShoppingCart, Warehouse } from 'lucide-react'
import { useFeeds, useFeedPurchases, useFeedContainerStock } from '../api'
import { FeedForm, FeedPurchaseForm, FeedContainerStockForm } from '../components'

type EntityType = 'feed' | 'feedPurchase' | 'feedContainerStock' | null

/**
 * Inventory Management Page with Create Dialogs
 * 
 * Provides quick access to create Feed and FeedPurchase entities via modal dialogs.
 * Similar to BatchSetupPage but for inventory domain entities.
 * 
 * Features:
 * - Create new feeds with full nutritional specs
 * - Record feed purchases with cost tracking
 * - Display current counts
 * - Modal dialogs for forms
 */
export default function InventoryManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null)

  // Load counts for display
  const { data: feedsData } = useFeeds({ isActive: true })
  const { data: purchasesData } = useFeedPurchases()
  const { data: containerStockData } = useFeedContainerStock({ ordering: 'entry_date' })

  const handleSuccess = () => {
    setCreateDialogOpen(null)
  }

  const handleCancel = () => {
    setCreateDialogOpen(null)
  }

  const entities = [
    {
      id: 'feed' as const,
      name: 'Feed Type',
      description: 'Define feed types with nutritional specs',
      icon: Package,
      count: feedsData?.results?.length || 0,
      color: 'blue'
    },
    {
      id: 'feedPurchase' as const,
      name: 'Feed Purchase',
      description: 'Record feed purchase with costs',
      icon: ShoppingCart,
      count: purchasesData?.results?.length || 0,
      color: 'green'
    },
    {
      id: 'feedContainerStock' as const,
      name: 'Container Stock',
      description: 'Add feed to containers (FIFO tracking)',
      icon: Warehouse,
      count: containerStockData?.results?.length || 0,
      color: 'purple'
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; text: string; bg: string }> = {
      blue: { icon: 'text-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
      purple: { icon: 'text-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Package className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Create and manage feed types and purchases</p>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => {
          const colors = getColorClasses(entity.color)
          const Icon = entity.icon

          return (
            <Card key={entity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {entity.count}
                  </div>
                </div>
                <CardTitle className="text-base">{entity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{entity.description}</p>
                <Button
                  onClick={() => setCreateDialogOpen(entity.id)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create {entity.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Create Feed Dialog */}
      <Dialog open={createDialogOpen === 'feed'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Feed</DialogTitle>
            <DialogDescription>Create a new feed type with nutritional specifications</DialogDescription>
          </DialogHeader>
          <FeedForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Feed Purchase Dialog */}
      <Dialog open={createDialogOpen === 'feedPurchase'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Record Feed Purchase</DialogTitle>
            <DialogDescription>Record a new feed purchase with quantity and cost information</DialogDescription>
          </DialogHeader>
          <FeedPurchaseForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Feed Container Stock Dialog */}
      <Dialog open={createDialogOpen === 'feedContainerStock'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Add Feed to Container</DialogTitle>
            <DialogDescription>Add feed batch to a container with FIFO tracking</DialogDescription>
          </DialogHeader>
          <FeedContainerStockForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
