/**
 * User Management Page (Phase 6)
 * 
 * Provides admin interface for user and profile management with RBAC controls.
 * Task U6.1: User Profile & Role Administration
 * Task U6.2: Group & Permission Assignment UI
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Shield, UserCog, AlertCircle, Lock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { UserTable } from '../components/UserTable';

/**
 * User Management Page - Admin interface for user and profile management
 *
 * Features:
 * - Admin-only access with permission guards
 * - User creation, editing, and deletion
 * - RBAC role and permission management
 * - Geographic and subsidiary restrictions
 * - User profile management
 */
export function UserManagementPage() {
  const { isAdmin } = useUser();

  return (
    <PermissionGuard
      require="admin"
      resource="user management"
      fallback={
        <div className="container mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span>Access Denied: Administrator role required</span>
              </div>
              <p className="text-sm mt-2">
                Only users with Administrator privileges can access user management.
                Contact your system administrator if you need access to this feature.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      }
    >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and permissions (Administrator access required)
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

          {/* Admin Access Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Administrator Access</CardTitle>
              <CardDescription>Current user permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isAdmin ? '✅ You have administrator access' : '❌ Administrator access required'}
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                ✅ Create, edit, and delete users<br />
                ✅ Assign roles and permissions<br />
                ✅ Configure geographic access<br />
                ✅ Manage account status
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <UserTable />
      </div>
    </PermissionGuard>
  );
}

export default UserManagementPage;

