import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { batchFormSchema, type BatchFormData } from '../schemas/batchFormSchema';
import type { InsertBatch } from '@/features/batch/types';

/**
 * Custom hook for managing batch creation form and mutation
 * Handles form state, validation, submission, and dialog open/close
 * 
 * @returns Object containing:
 * - isOpen: Dialog open state
 * - setIsOpen: Function to control dialog visibility
 * - form: React Hook Form instance
 * - onSubmit: Form submission handler
 * - isLoading: Mutation loading state
 * - selectedEggSource: Egg source selection state
 * - setSelectedEggSource: Function to update egg source
 */
export function useBatchCreation() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEggSource, setSelectedEggSource] = useState<"internal" | "external">("internal");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      status: "active",
      startDate: new Date(),
      initialCount: 0,
      initialBiomassKg: 0,
      currentCount: 0,
      currentBiomassKg: 0,
      eggSource: "internal",
    },
  });

  const createBatchMutation = useMutation({
    mutationFn: async (data: InsertBatch) => api.batch.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch/batches"] });
      setIsOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Batch created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create batch",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BatchFormData) => {
    const insertData: InsertBatch = {
      ...data,
      startDate: data.startDate.toISOString().split('T')[0],
      expectedHarvestDate: data.expectedHarvestDate?.toISOString().split('T')[0],
      eggProductionDate: data.eggProductionDate?.toISOString().split('T')[0],
      initialBiomassKg: data.initialBiomassKg.toString(),
      currentBiomassKg: data.currentBiomassKg.toString(),
    };
    createBatchMutation.mutate(insertData);
  };

  return {
    isOpen,
    setIsOpen,
    form,
    onSubmit,
    isLoading: createBatchMutation.isPending,
    selectedEggSource,
    setSelectedEggSource,
  };
}

