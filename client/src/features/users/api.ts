import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import type { User, UserCreate, PatchedUser } from '@/api/generated';
import { toast } from 'sonner';

/**
 * API hooks for user management
 */

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => ApiService.apiV1UsersUsersList(),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => ApiService.apiV1UsersUsersRetrieve(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserCreate) =>
      ApiService.apiV1UsersUsersCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to create user');
    },
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PatchedUser) =>
      ApiService.apiV1UsersUsersPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) =>
      ApiService.apiV1UsersUsersDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.body?.detail || 'Failed to delete user');
    },
  });
}

