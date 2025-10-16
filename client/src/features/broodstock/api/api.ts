import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { toast } from 'sonner';

/**
 * API hooks for broodstock management (Phase 7)
 */

export function useBroodstockFish() {
  return useQuery({
    queryKey: ['broodstock', 'fish'],
    queryFn: () => ApiService.apiV1BroodstockFishList(),
  });
}

export function useCreateBroodstockFish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1BroodstockFishCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broodstock', 'fish'] });
      toast.success('Broodstock fish created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create broodstock fish');
    },
  });
}

export function useFishMovements() {
  return useQuery({
    queryKey: ['broodstock', 'movements'],
    queryFn: () => ApiService.apiV1BroodstockFishMovementsList(),
  });
}

export function useCreateFishMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1BroodstockFishMovementsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broodstock', 'movements'] });
      queryClient.invalidateQueries({ queryKey: ['broodstock', 'fish'] });
      toast.success('Fish movement recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to record fish movement');
    },
  });
}

export function useBreedingPlans() {
  return useQuery({
    queryKey: ['broodstock', 'breeding-plans'],
    queryFn: () => ApiService.apiV1BroodstockBreedingPlansList(),
  });
}

export function useCreateBreedingPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ApiService.apiV1BroodstockBreedingPlansCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broodstock', 'breeding-plans'] });
      toast.success('Breeding plan created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create breeding plan');
    },
  });
}

