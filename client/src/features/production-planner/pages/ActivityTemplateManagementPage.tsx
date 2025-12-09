/**
 * Activity Template Management Page
 *
 * Page for managing activity templates. Allows operators to:
 * - View all templates in a table
 * - Create new templates
 * - Edit existing templates
 * - Delete templates
 * - Toggle active/inactive status
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Loader2,
  Search,
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { useUser } from '@/contexts/UserContext';
import { useActivityTemplates } from '../api/api';
import { ActivityTemplateTable } from '../components/ActivityTemplateTable';
import { ActivityTemplateForm } from '../components/ActivityTemplateForm';
import { getActivityTypeOptions } from '../utils/activityHelpers';
import type { ActivityTemplate, ActivityType } from '../types';

type StatusFilter = 'all' | 'active' | 'inactive';

export function ActivityTemplateManagementPage() {
  const { isViewer } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ActivityTemplate | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<ActivityType | 'all'>('all');

  // Fetch templates
  const {
    data: templatesResponse,
    isLoading,
    isError,
    refetch,
  } = useActivityTemplates({
    search: searchQuery || undefined,
    activityType: activityTypeFilter === 'all' ? undefined : activityTypeFilter,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  });

  const templates = templatesResponse?.results || [];
  const activityTypeOptions = getActivityTypeOptions();

  // Compute stats
  const stats = useMemo(() => {
    return {
      total: templates.length,
      active: templates.filter((t) => t.is_active).length,
      inactive: templates.filter((t) => !t.is_active).length,
    };
  }, [templates]);

  // Filter templates by status (client-side when API doesn't filter)
  const filteredTemplates = useMemo(() => {
    if (statusFilter === 'all') return templates;
    return templates.filter((t) =>
      statusFilter === 'active' ? t.is_active : !t.is_active
    );
  }, [templates, statusFilter]);

  const handleCreateTemplate = () => {
    setTemplateToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: ActivityTemplate) => {
    setTemplateToEdit(template);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setTemplateToEdit(undefined);
  };

  const canManageTemplates = !isViewer;

  return (
    <PermissionGuard require="operational" resource="Activity Templates">
      <div className="container mx-auto py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/production-planner">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Activity Templates</h1>
              <p className="text-muted-foreground mt-1">
                Manage templates for automated activity scheduling
              </p>
            </div>
          </div>
          {canManageTemplates && (
            <Button onClick={handleCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Defined lifecycle activities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Will generate activities for new batches
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                Paused or deprecated templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filters</CardTitle>
            <CardDescription>
              Filter templates by status, activity type, or search by name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <Tabs
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Activity Type Filter */}
              <Select
                value={activityTypeFilter}
                onValueChange={(v) => setActivityTypeFilter(v as ActivityType | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {activityTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Templates</CardTitle>
              <CardDescription>
                There was a problem loading activity templates. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Templates Table */}
        {!isLoading && !isError && (
          <ActivityTemplateTable
            templates={filteredTemplates}
            onEdit={handleEditTemplate}
            isLoading={isLoading}
          />
        )}

        {/* Footer Stats */}
        {!isLoading && !isError && templates.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
            <div>
              Showing {filteredTemplates.length} of {templates.length} templates
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {stats.active} active
              </Badge>
              <Badge variant="outline" className="gap-1">
                <XCircle className="h-3 w-3 text-muted-foreground" />
                {stats.inactive} inactive
              </Badge>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        <ActivityTemplateForm
          template={templateToEdit}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            refetch();
          }}
        />
      </div>
    </PermissionGuard>
  );
}




