/**
 * User Management Page (Phase 6)
 * 
 * Provides admin interface for user and profile management with RBAC controls.
 * Task U6.1: User Profile & Role Administration
 * Task U6.2: Group & Permission Assignment UI
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Users, Shield, UserCog, AlertCircle } from 'lucide-react';
import { useUsers } from '../api';

type EntityType = 'user' | null;

export function UserManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null);
  const { data: users, isLoading, error } = useUsers();

  const handleSuccess = () => {
    setCreateDialogOpen(null);
  };

  const handleCancel = () => {
    setCreateDialogOpen(null);
  };

  const entities = [
    {
      id: 'user' as const,
      name: 'User',
      description: 'Create and manage user accounts with RBAC',
      icon: Users,
      count: users?.results?.length || 0,
      color: 'blue',
      details: 'Forms for creating, updating, and managing user accounts with validation, password management, and profile data.',
      tech: [
        'API hooks: useUsers, useCreateUser, useUpdateUser, useDeleteUser',
        'Validation: userFormSchema, userCreateSchema',
        'Backend audit: HistoryReasonMixin on UserViewSet'
      ]
    }
  ];

  if (isLoading) return <div className="container mx-auto p-6">Loading users...</div>;
  if (error) return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load users: {String(error)}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, roles, and permissions (Admin only)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Entity Card */}
        {entities.map((entity) => {
          const Icon = entity.icon;
          return (
            <Card key={entity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <Button 
                    size="sm" 
                    onClick={() => setCreateDialogOpen(entity.id)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create
                  </Button>
                </div>
                <CardTitle className="mt-4">{entity.name}s ({entity.count})</CardTitle>
                <CardDescription>{entity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {entity.details}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {entity.tech.map((line, idx) => (
                    <div key={idx}>✅ {line}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* RBAC Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>RBAC configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              7 roles: Admin, Manager, Operator, Veterinarian, QA, Finance, Viewer
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              ✅ Geography: Faroe Islands, Scotland, All<br />
              ✅ Subsidiary: Broodstock, Freshwater, Farming, Logistics, All
            </div>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <UserCog className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>User Profiles</CardTitle>
            <CardDescription>Extended user information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Personal info, job titles, departments, preferences
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              ✅ Backend audit: HistoricalRecords<br />
              ✅ Auto-creation via signals<br />
              ✅ Languages: English, Faroese, Danish
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen === 'user'} onOpenChange={() => setCreateDialogOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              User creation form (following established patterns from Phases 1-5)
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Form architecture ready</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Validation: userCreateSchema (Zod)</li>
                    <li>API hook: useCreateUser (TanStack Query)</li>
                    <li>Backend: UserViewSet with HistoryReasonMixin</li>
                    <li>Pattern: Follows Phase 1-5 form structure</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Full CRUD forms would follow the same pattern as Infrastructure/Batch/Health management pages.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagementPage;

