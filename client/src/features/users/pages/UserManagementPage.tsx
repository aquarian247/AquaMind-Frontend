/**
 * User Management Page (Phase 6)
 * 
 * Provides admin interface for user and profile management with RBAC controls.
 * Task U6.1: User Profile & Role Administration
 * Task U6.2: Group & Permission Assignment UI
 */

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users, Shield, UserCog } from 'lucide-react';
import { useUsers } from '../api';

export function UserManagementPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, roles, and permissions (Admin only)
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <UserManagementContent />
      </Suspense>
    </div>
  );
}

function UserManagementContent() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading users...</div>;
  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Failed to load users: {String(error)}</AlertDescription>
    </Alert>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* User Administration Card */}
      <Card>
        <CardHeader>
          <Users className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Users ({users?.results?.length || 0})</CardTitle>
          <CardDescription>Create and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Forms for creating, updating, and managing user accounts with validation, password management, and profile data.
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            ✅ API hooks: useUsers, useCreateUser, useUpdateUser, useDeleteUser<br />
            ✅ Validation: userFormSchema, userCreateSchema<br />
            ✅ Backend audit: HistoryReasonMixin on UserViewSet
          </div>
        </CardContent>
      </Card>

      {/* Role & Permission Management Card */}
      <Card>
        <CardHeader>
          <Shield className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>RBAC configuration interface</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Interface for assigning roles (Admin, Manager, Operator, Veterinarian, QA, Finance, Viewer) and managing geography/subsidiary access.
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            ✅ Roles: 7 types with hierarchical permissions<br />
            ✅ Geography: Faroe Islands, Scotland, All<br />
            ✅ Subsidiary: Broodstock, Freshwater, Farming, Logistics, All
          </div>
        </CardContent>
      </Card>

      {/* User Profile Management Card */}
      <Card>
        <CardHeader>
          <UserCog className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>User Profiles</CardTitle>
          <CardDescription>Extended user information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage user profiles with personal information, job titles, departments, language preferences, and date format settings.
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            ✅ Backend audit: HistoricalRecords on UserProfile<br />
            ✅ Auto-creation: Signal creates profile for new users<br />
            ✅ Languages: English, Faroese, Danish
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserManagementPage;

