/**
 * Refresh Data Button
 * 
 * Manager+ action to refresh recent data (last 7 days).
 * Triggers Celery recompute and auto-refreshes chart after delay.
 * 
 * RBAC: Manager + Admin only (backend enforces geography filtering)
 * 
 * Issue: #112 - Phase 7
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useRefreshBatchData } from '../../api/growth-assimilation';

interface RefreshDataButtonProps {
  batchId: number;
}

export function RefreshDataButton({ batchId }: RefreshDataButtonProps) {
  const { toast } = useToast();
  const { isManager, isAdmin } = useUser();
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  
  const { refreshLast7Days, isPending: isRefreshing, isSuccess, error } = useRefreshBatchData(batchId);
  
  // ============================================================================
  // RBAC Check
  // ============================================================================
  
  const canRefresh = isManager || isAdmin;
  
  if (!canRefresh) {
    return null; // Hide button for non-managers
  }
  
  // ============================================================================
  // Auto-refresh after task completion
  // ============================================================================
  
  useEffect(() => {
    if (isSuccess && !isAutoRefreshing) {
      // Task enqueued successfully, wait 30 seconds then auto-refresh
      setIsAutoRefreshing(true);
      
      const timer = setTimeout(() => {
        setIsAutoRefreshing(false);
        // Query client will auto-invalidate after mutation success
      }, 30000); // 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isAutoRefreshing]);
  
  // ============================================================================
  // Error Handling
  // ============================================================================
  
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const is403 = errorMessage.includes('403') || errorMessage.includes('Forbidden');
      
      toast({
        title: 'Refresh Failed',
        description: is403 
          ? 'You don\'t have permission to recompute this batch. Check your geography and area assignments.'
          : errorMessage,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  // ============================================================================
  // Handle Click
  // ============================================================================
  
  const handleRefresh = () => {
    refreshLast7Days();
    
    toast({
      title: 'Refreshing Data',
      description: 'Recomputing last 7 days... Chart will update in ~30 seconds.',
    });
  };
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  const isDisabled = isRefreshing || isAutoRefreshing;
  
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleRefresh}
        disabled={isDisabled}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isDisabled ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : isAutoRefreshing ? 'Updating...' : 'Refresh Data'}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        {isAutoRefreshing ? (
          'Waiting for recompute to complete...'
        ) : (
          'Recompute last 7 days to pick up recent changes (feeding, mortality, etc.)'
        )}
      </p>
    </div>
  );
}

