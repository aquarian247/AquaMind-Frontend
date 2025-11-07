import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Edit, Trash2, Users, Mail, Phone, Shield, MapPin, Building } from 'lucide-react'
import { useUsers, useDeleteUser } from '../api'
import { UserForm } from './UserForm'
import type { User } from '@/api/generated'

/**
 * UserTable component - displays users in a card-based layout with actions
 * Provides create, edit, and delete functionality for user management
 */
export function UserTable() {
  const { data: usersData, isLoading, error } = useUsers()
  const deleteMutation = useDeleteUser()

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [creatingUser, setCreatingUser] = useState(false)

  const users = usersData?.results || []

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleDelete = async (userId: number) => {
    await deleteMutation.mutateAsync(userId)
  }

  const handleCloseDialog = () => {
    setEditingUser(null)
    setCreatingUser(false)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive'
      case 'MGR': return 'default'
      case 'OPR': return 'secondary'
      case 'VET': return 'outline'
      case 'QA': return 'outline'
      case 'FIN': return 'outline'
      case 'VIEW': return 'outline'
      default: return 'secondary'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrator'
      case 'MGR': return 'Manager'
      case 'OPR': return 'Operator'
      case 'VET': return 'Veterinarian'
      case 'QA': return 'Quality Assurance'
      case 'FIN': return 'Finance'
      case 'VIEW': return 'Viewer'
      default: return role
    }
  }

  const getGeographyLabel = (geography?: string) => {
    switch (geography) {
      case 'FO': return 'Faroe Islands'
      case 'SC': return 'Scotland'
      case 'ALL': return 'All Geographies'
      default: return 'Not Set'
    }
  }

  const getSubsidiaryLabel = (subsidiary?: string) => {
    switch (subsidiary) {
      case 'BS': return 'Broodstock'
      case 'FW': return 'Freshwater'
      case 'FM': return 'Farming'
      case 'LG': return 'Logistics'
      case 'ALL': return 'All Subsidiaries'
      default: return 'Not Set'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Users</CardTitle>
          <CardDescription>Failed to load user data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {String(error)}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center space-y-4">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-medium">No Users Found</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first user account.
            </p>
          </div>
          <Button onClick={() => setCreatingUser(true)}>
            Create First User
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Users ({users.length})</h2>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setCreatingUser(true)}>
          <Users className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* User Cards */}
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    {user.full_name || user.username}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(user.role || '')} className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {getRoleLabel(user.role || '')}
                  </Badge>
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Geography:</span>
                  <span>{getGeographyLabel(user.geography)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Subsidiary:</span>
                  <span>{getSubsidiaryLabel(user.subsidiary)}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Joined:</span>
                  <span>{new Date(user.date_joined).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(user)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the user account for "{user.username}"?
                        This action cannot be undone and will permanently remove the user.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={creatingUser || !!editingUser} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {creatingUser ? 'Create User' : 'Edit User'}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            user={editingUser || undefined}
            onSuccess={handleCloseDialog}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}






