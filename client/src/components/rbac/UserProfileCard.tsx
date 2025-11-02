import React from 'react';
import { User, MapPin, Building, Box, Globe, Briefcase, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';

/**
 * UserProfileCard component that displays user's RBAC information
 * including role, geography, subsidiary, and location assignments
 */
export const UserProfileCard: React.FC = () => {
  const { profile, isOperator, hasLocationAssignments } = useUser();

  // Fetch location details if user has assignments
  const { data: areas } = useQuery({
    queryKey: ['areas', profile?.allowed_areas],
    queryFn: async () => {
      if (!profile?.allowed_areas || profile.allowed_areas.length === 0) return [];
      // Fetch areas - note: this would need a bulk fetch endpoint or fetch individually
      const promises = profile.allowed_areas.map(id => 
        ApiService.apiV1InfrastructureAreasRetrieve(id).catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    enabled: !!profile?.allowed_areas && profile.allowed_areas.length > 0,
  });

  const { data: stations } = useQuery({
    queryKey: ['stations', profile?.allowed_stations],
    queryFn: async () => {
      if (!profile?.allowed_stations || profile.allowed_stations.length === 0) return [];
      const promises = profile.allowed_stations.map(id =>
        ApiService.apiV1InfrastructureFreshwaterStationsRetrieve(id).catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    enabled: !!profile?.allowed_stations && profile.allowed_stations.length > 0,
  });

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  const roleLabels: Record<string, string> = {
    'ADMIN': 'Administrator',
    'MGR': 'Manager',
    'OPR': 'Operator',
    'VET': 'Veterinarian',
    'QA': 'Quality Assurance',
    'FIN': 'Finance',
    'VIEW': 'Viewer',
  };

  const geographyLabels: Record<string, string> = {
    'FO': 'Faroe Islands',
    'SC': 'Scotland',
    'ALL': 'All Geographies',
  };

  const subsidiaryLabels: Record<string, string> = {
    'BS': 'Broodstock',
    'FW': 'Freshwater',
    'FM': 'Farming',
    'LG': 'Logistics',
    'ALL': 'All Subsidiaries',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <CardTitle>{profile.full_name || 'User Profile'}</CardTitle>
            <CardDescription>RBAC Profile Information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Role</span>
          </div>
          <Badge variant="default">{roleLabels[profile.role] || profile.role}</Badge>
        </div>

        <Separator />

        {/* Geography */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Geography</span>
          </div>
          <Badge variant="outline">{geographyLabels[profile.geography] || profile.geography}</Badge>
        </div>

        {/* Subsidiary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Subsidiary</span>
          </div>
          <Badge variant="outline">{subsidiaryLabels[profile.subsidiary] || profile.subsidiary}</Badge>
        </div>

        {/* Location Assignments (Phase 2) */}
        {isOperator && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location Assignments</span>
              </h4>

              {!hasLocationAssignments ? (
                <p className="text-sm text-muted-foreground">
                  No location assignments. Contact your manager to get access to specific areas or stations.
                </p>
              ) : (
                <div className="space-y-3">
                  {/* Assigned Areas */}
                  {areas && areas.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Areas ({areas.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {areas.map((area: any) => (
                          <Badge key={area.id} variant="secondary">
                            {area.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Stations */}
                  {stations && stations.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Box className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Stations ({stations.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stations.map((station: any) => (
                          <Badge key={station.id} variant="secondary">
                            {station.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Containers Count (if applicable) */}
                  {profile.allowed_containers && profile.allowed_containers.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2">
                        <Box className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Containers: {profile.allowed_containers.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
