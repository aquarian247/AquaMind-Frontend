import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, User, Tag, FileText, Database, Link as LinkIcon, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TypeBadge } from "../components/TypeBadge";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ErrorState, NotFoundErrorState } from "../components/ErrorState";
import { PageLoadingState } from "../components/LoadingState";
import { useHistoryDetail } from "../hooks/useHistory";
import { HistoryType } from "../hooks/useHistoryFilters";
import { ApiError, AppDomain } from "../api/api";
import { APP_DOMAINS } from "../api/api";
import { format } from "date-fns";

interface RecordDetailPageProps {
  params?: {
    domain?: string;
    model?: string;
    id?: string;
  };
}

export function RecordDetailPage({ params }: RecordDetailPageProps = {}) {
  const routeParams = useParams();
  const domain = (params?.domain || routeParams.domain) as AppDomain;
  const model = params?.model || routeParams.model;
  const historyId = parseInt((params?.id || routeParams.id) || "0");

  const { data, isLoading, error, refetch } = useHistoryDetail(domain || '', model || '', historyId);

  const handleRetry = () => {
    refetch();
  };

  // Enhanced field formatting with type detection
  const formatFieldValue = (value: any, fieldName?: string): { value: string; type: string; isEmpty: boolean } => {
    if (value === null || value === undefined) {
      return { value: "N/A", type: "empty", isEmpty: true };
    }

    if (typeof value === "boolean") {
      return { value: value ? "Yes" : "No", type: "boolean", isEmpty: false };
    }

    if (typeof value === "number") {
      // Format dates if field name suggests it
      if (fieldName?.toLowerCase().includes('date') || fieldName?.toLowerCase().includes('time')) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return {
            value: format(date, "PPP 'at' p"),
            type: "date",
            isEmpty: false
          };
        }
      }
      return { value: value.toLocaleString(), type: "number", isEmpty: false };
    }

    if (typeof value === "string") {
      // Check if it's a date string
      const date = new Date(value);
      if (!isNaN(date.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return {
          value: format(date, "PPP"),
          type: "date",
          isEmpty: false
        };
      }
      // Check if it's an email
      if (value.includes('@') && value.includes('.')) {
        return { value, type: "email", isEmpty: false };
      }
      return { value, type: "string", isEmpty: false };
    }

    if (typeof value === "object") {
      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return { value: "Empty list", type: "array", isEmpty: true };
        }
        return { value: `${value.length} items`, type: "array", isEmpty: false };
      }
      // Handle objects (relationships)
      return { value: JSON.stringify(value, null, 2), type: "object", isEmpty: false };
    }

    return { value: String(value), type: "unknown", isEmpty: false };
  };

  // Get display name for field with proper capitalization
  const getFieldDisplayName = (fieldName: string): string => {
    // Handle special cases
    const specialNames: Record<string, string> = {
      'batch_number': 'Batch Number',
      'species_name': 'Species Name',
      'current_lifecycle_stage': 'Current Lifecycle Stage',
      'container_name': 'Container Name',
      'area_name': 'Area Name',
      'station_name': 'Station Name',
      'user_full_name': 'Full Name',
      'job_title': 'Job Title',
      'geography_name': 'Geography',
      'container_type_name': 'Container Type',
      'feed_container_name': 'Feed Container',
      'freshwater_station_name': 'Freshwater Station',
      'hall_name': 'Hall Name',
      'sensor_name': 'Sensor Name',
      'feed_name': 'Feed Name',
      'treatment_type_name': 'Treatment Type',
      'scenario_name': 'Scenario Name',
      'fcr_model_name': 'FCR Model',
      'mortality_model_name': 'Mortality Model',
      'tgc_model_name': 'TGC Model',
      'journal_entry_title': 'Entry Title',
      'health_lab_sample_type': 'Sample Type',
      'lice_count_value': 'Lice Count',
      'mortality_record_cause': 'Cause of Death'
    };

    if (specialNames[fieldName]) {
      return specialNames[fieldName];
    }

    // Convert snake_case to Title Case
    return fieldName
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get domain display name
  const getDomainDisplayName = (domain: AppDomain): string => {
    const names: Record<AppDomain, string> = {
      [APP_DOMAINS.BATCH]: 'Batch Management',
      [APP_DOMAINS.INFRASTRUCTURE]: 'Infrastructure',
      [APP_DOMAINS.INVENTORY]: 'Inventory',
      [APP_DOMAINS.HEALTH]: 'Health & Welfare',
      [APP_DOMAINS.SCENARIO]: 'Scenario Planning',
      [APP_DOMAINS.USERS]: 'User Management'
    };
    return names[domain] || domain;
  };

  // Get model display name
  const getModelDisplayName = (model: string): string => {
    return model.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Check if field represents a relationship (foreign key)
  const isRelationshipField = (fieldName: string, value: any): boolean => {
    if (typeof value !== 'object' || Array.isArray(value)) return false;

    // Common relationship patterns
    const relationshipFields = [
      'batch', 'container', 'area', 'station', 'hall', 'sensor',
      'species', 'user', 'feed', 'scenario', 'treatment', 'sample',
      'geography', 'container_type', 'freshwater_station'
    ];

    return relationshipFields.some(rel =>
      fieldName.toLowerCase().includes(rel) ||
      fieldName.toLowerCase().endsWith(`_${rel}_id`) ||
      fieldName.toLowerCase().endsWith(`_${rel}`)
    );
  };

  // Extract fields to display (exclude history-specific and system fields)
  const getDisplayFields = (record: any): Array<{key: string, value: any, formatted: ReturnType<typeof formatFieldValue>}> => {
    if (!record) return [];

    const excludeFields = new Set([
      'history_id', 'history_user', 'history_date', 'history_type',
      'history_change_reason', 'id', 'created_at', 'updated_at',
      'created_by', 'updated_by', 'version', 'is_active'
    ]);

    return Object.entries(record)
      .filter(([key]) => !excludeFields.has(key) && !key.startsWith('history_'))
      .map(([key, value]) => ({
        key,
        value,
        formatted: formatFieldValue(value, key)
      }))
      .sort((a, b) => {
        // Sort by field type priority for better UX
        const typePriority = { relationship: 1, date: 2, string: 3, number: 4, boolean: 5, array: 6, object: 7, empty: 8 };
        const aPriority = typePriority[a.formatted.type as keyof typeof typePriority] || 99;
        const bPriority = typePriority[b.formatted.type as keyof typeof typePriority] || 99;
        return aPriority - bPriority;
      });
  };

  // Generate breadcrumb navigation
  const getBreadcrumbItems = () => [
    { label: 'Audit Trail', href: '/audit-trail' },
    { label: getDomainDisplayName(domain), href: `/audit-trail?tab=${domain}` },
    { label: getModelDisplayName(model || ''), href: '#' },
    { label: `Record #${historyId}`, href: '#' }
  ];

  // Show loading state
  if (isLoading && !data) {
    return <PageLoadingState />;
  }

  // Show error state with appropriate messages
  if (error) {
    const apiError = error as ApiError;

    // Special handling for 404 errors
    if (apiError.statusCode === 404) {
      return (
        <div className="container mx-auto p-4">
          <NotFoundErrorState />
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <ErrorState
          error={apiError}
          statusCode={apiError.statusCode}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Show not found if no data but no error (shouldn't happen with proper error handling)
  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <NotFoundErrorState />
      </div>
    );
  }

  const displayFields = getDisplayFields(data);
  const breadcrumbItems = getBreadcrumbItems();

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
              {item.href !== '#' ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/audit-trail">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Audit Trail
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">History Record Details</h1>
            <p className="text-muted-foreground">
              {getModelDisplayName(model || '')} • Record #{data.history_id || data.id}
            </p>
          </div>
        </div>

        {/* Record Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Record Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">Date & Time</div>
                  <div className="font-medium truncate">
                    {format(new Date(data.history_date), "MMM dd, yyyy")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(data.history_date), "HH:mm:ss")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">User</div>
                  <div className="font-medium truncate">{data.history_user || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">Change Type</div>
                  <TypeBadge type={data.history_type as HistoryType} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground">Domain</div>
                  <div className="font-medium truncate">{getDomainDisplayName(domain)}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {getModelDisplayName(model || '')}
                  </div>
                </div>
              </div>
            </div>

            {data.history_change_reason && (
              <div className="flex items-start gap-3 pt-4 border-t">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-muted-foreground">Change Reason</div>
                  <div className="font-medium text-sm mt-1">{data.history_change_reason}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Record Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Record Data
              </span>
              <Badge variant="outline" className="text-xs">
                {displayFields.length} fields
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete snapshot of the record at the time of this change
            </p>
          </CardHeader>
          <CardContent>
            {displayFields.length > 0 ? (
              <div className="space-y-4">
                {/* Group fields by type for better organization */}
                {['relationship', 'date', 'string', 'number', 'boolean'].map(fieldType => {
                  const fieldsOfType = displayFields.filter(field => field.formatted.type === fieldType);
                  if (fieldsOfType.length === 0) return null;

                  return (
                    <div key={fieldType} className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {fieldType === 'relationship' ? 'Relationships' :
                         fieldType === 'date' ? 'Dates & Times' :
                         fieldType === 'string' ? 'Text Fields' :
                         fieldType === 'number' ? 'Numeric Values' :
                         'Boolean Values'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fieldsOfType.map(({ key, value, formatted }) => (
                          <div key={key} className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium text-sm text-muted-foreground">
                              {getFieldDisplayName(key)}
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              {isRelationshipField(key, value) && (
                                <LinkIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className={`text-sm break-all ${
                                formatted.isEmpty ? 'text-muted-foreground italic' : 'text-foreground'
                              } ${
                                formatted.type === 'number' || formatted.type === 'object' ? 'font-mono' : 'font-sans'
                              }`}>
                                {formatted.type === 'email' ? (
                                  <a
                                    href={`mailto:${formatted.value}`}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {formatted.value}
                                  </a>
                                ) : formatted.type === 'date' ? (
                                  <span className="font-sans">{formatted.value}</span>
                                ) : (
                                  formatted.value
                                )}
                              </div>
                            </div>
                            {isRelationshipField(key, value) && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ExternalLink className="h-3 w-3" />
                                <span>Related entity</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Handle remaining field types */}
                {displayFields.filter(field =>
                  !['relationship', 'date', 'string', 'number', 'boolean'].includes(field.formatted.type)
                ).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Other Fields
                    </h4>
                    <div className="space-y-3">
                      {displayFields
                        .filter(field => !['relationship', 'date', 'string', 'number', 'boolean'].includes(field.formatted.type))
                        .map(({ key, value, formatted }) => (
                          <div key={key} className="flex flex-col gap-2">
                            <div className="font-medium text-sm text-muted-foreground">
                              {getFieldDisplayName(key)}
                            </div>
                            <div className={`text-sm bg-muted px-3 py-2 rounded break-all ${
                              formatted.type === 'number' || formatted.type === 'object' ? 'font-mono' : 'font-sans'
                            }`}>
                              {formatted.value}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Data Fields Available</h3>
                <p className="text-muted-foreground">
                  This record doesn't contain any additional data fields beyond the audit metadata.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Before/After Comparison Card */}
        {data.history_type === '~' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Change Comparison
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparison of field values before and after this update
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">BEFORE</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Previous state
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">CHANGE</div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      What changed
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium text-green-900 dark:text-green-100">AFTER</div>
                    <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Current state
                    </div>
                  </div>
                </div>

                {/* Field comparison grid */}
                <div className="space-y-3">
                  {displayFields.slice(0, 5).map(({ key, value, formatted }) => {
                    // For demo purposes, we'll show N/A for before values since we don't have historical comparison API
                    // In a real implementation, this would come from the API response
                    const beforeValue = 'N/A'; // This would be data.previous_values?.[key] || 'N/A'
                    const hasChanged = beforeValue !== formatted.value && beforeValue !== 'N/A';

                    return (
                      <div key={`comparison-${key}`} className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-3 border rounded-lg">
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground mb-1">Before</div>
                          <div className={`text-sm ${beforeValue === 'N/A' ? 'text-muted-foreground italic' : 'font-sans'}`}>
                            {beforeValue}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground mb-1">Field</div>
                          <div className="text-sm font-medium">{getFieldDisplayName(key)}</div>
                          {hasChanged && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Modified
                            </Badge>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground mb-1">After</div>
                          <div className={`text-sm ${formatted.isEmpty ? 'text-muted-foreground italic' : 'font-sans'} ${
                            formatted.type === 'number' || formatted.type === 'object' ? 'font-mono' : 'font-sans'
                          }`}>
                            {formatted.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {displayFields.length > 5 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Showing comparison for first 5 fields. {displayFields.length - 5} additional fields updated.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <div className="text-xs text-muted-foreground">
                    Comparison data not available from API - showing current values only
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Secondary Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Record ID</div>
                <div className="font-medium">{data.id || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">History ID</div>
                <div className="font-medium">{data.history_id || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Domain</div>
                <div className="font-medium">{getDomainDisplayName(domain)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Model</div>
                <div className="font-medium">{getModelDisplayName(model || '')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">API Endpoint</div>
                <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  /api/v1/{domain}/{(model || '').replace('-', '_')}s/{data.id || 'unknown'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Audit Trail URL</div>
                <div className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                  /audit-trail/{domain}/{model || ''}/{data.history_id || data.id}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
