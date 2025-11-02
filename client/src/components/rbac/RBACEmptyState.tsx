import React from 'react';
import { MapPin, Lock, AlertTriangle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  type?: 'no-assignments' | 'no-permission' | 'no-data' | 'geography-restricted';
}

/**
 * EmptyState component for RBAC-related scenarios
 * Provides helpful messages and actions based on user permissions and assignments
 */
export const RBACEmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  type = 'no-data'
}) => {
  const { isOperator, hasLocationAssignments, profile } = useUser();
  
  // Auto-detect empty state type if not specified
  const detectedType = type || (isOperator && !hasLocationAssignments ? 'no-assignments' : 'no-data');
  
  // Default configurations for each type
  const configs = {
    'no-assignments': {
      icon: <MapPin className="h-16 w-16 text-muted-foreground" />,
      title: 'No Location Assignments',
      description: 'You don\'t have any assigned areas, stations, or containers. Contact your manager to get location access.',
      action: (
        <Button 
          variant="outline" 
          onClick={() => window.location.href = 'mailto:admin@aquamind.com?subject=Location%20Assignment%20Request'}
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Administrator
        </Button>
      )
    },
    'no-permission': {
      icon: <Lock className="h-16 w-16 text-muted-foreground" />,
      title: 'Access Denied',
      description: 'You don\'t have permission to access this resource. Contact your administrator if you believe this is an error.',
      action: (
        <Button 
          variant="outline" 
          onClick={() => window.location.href = 'mailto:admin@aquamind.com?subject=Permission%20Request'}
        >
          <Mail className="mr-2 h-4 w-4" />
          Request Access
        </Button>
      )
    },
    'geography-restricted': {
      icon: <AlertTriangle className="h-16 w-16 text-muted-foreground" />,
      title: 'Geography Restriction',
      description: `You only have access to ${profile?.geography === 'SC' ? 'Scotland' : profile?.geography === 'FO' ? 'Faroe Islands' : 'your assigned'} data. This resource is outside your geography.`,
      action: null
    },
    'no-data': {
      icon: <AlertTriangle className="h-16 w-16 text-muted-foreground" />,
      title: 'No Data Available',
      description: 'There is no data to display at this time.',
      action: null
    }
  };
  
  const config = configs[detectedType];
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {icon || config.icon}
          </div>
          <CardTitle>{title || config.title}</CardTitle>
          <CardDescription className="text-base">
            {description || config.description}
          </CardDescription>
        </CardHeader>
        {(action || config.action) && (
          <CardContent className="flex justify-center">
            {action || config.action}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

/**
 * Specialized empty state for operator location assignments
 */
export const OperatorNoLocationState: React.FC = () => {
  return (
    <RBACEmptyState type="no-assignments" />
  );
};

/**
 * Specialized empty state for permission denied
 */
export const PermissionDeniedState: React.FC<{ resource?: string }> = ({ resource = 'this resource' }) => {
  return (
    <RBACEmptyState 
      type="no-permission"
      description={`You don't have permission to access ${resource}. Contact your administrator if you believe this is an error.`}
    />
  );
};

/**
 * Specialized empty state for geography restrictions
 */
export const GeographyRestrictedState: React.FC = () => {
  return (
    <RBACEmptyState type="geography-restricted" />
  );
};

export default RBACEmptyState;
