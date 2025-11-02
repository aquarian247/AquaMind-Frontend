import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile } from '@/api/generated/models/UserProfile';

/**
 * Extended UserProfile interface to support Phase 2 location assignments
 * These fields will be added to the backend UserProfile model in Phase 2
 */
export interface ExtendedUserProfile extends UserProfile {
  allowed_areas?: number[];
  allowed_stations?: number[];
  allowed_containers?: number[];
}

/**
 * User context type with RBAC helper methods
 */
interface UserContextType {
  profile: ExtendedUserProfile | null;
  isLoading: boolean;
  
  // Role checks
  isAdmin: boolean;
  isManager: boolean;
  isOperator: boolean;
  isVeterinarian: boolean;
  isQA: boolean;
  isFinance: boolean;
  isViewer: boolean;
  
  // Permission checks
  hasHealthAccess: boolean;
  hasOperationalAccess: boolean;
  hasTreatmentEditAccess: boolean;
  hasFinanceAccess: boolean;
  
  // Location assignment checks (Phase 2)
  hasLocationAssignments: boolean;
  hasAreaAccess: (areaId: number) => boolean;
  hasStationAccess: (stationId: number) => boolean;
  hasContainerAccess: (containerId: number) => boolean;
  
  // Geography checks
  isAllGeographies: boolean;
  isScotland: boolean;
  isFaroeIslands: boolean;
  
  // Subsidiary checks
  isAllSubsidiaries: boolean;
  isBroodstock: boolean;
  isFreshwater: boolean;
  isFarming: boolean;
  isLogistics: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * UserProvider component that wraps AuthContext and provides
 * RBAC-specific helper methods and computed properties
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // Get user profile from auth context
  const profile = user?.profile as ExtendedUserProfile | null;
  
  // Role checks
  const isAdmin = useMemo(() => profile?.role === 'ADMIN', [profile]);
  const isManager = useMemo(() => profile?.role === 'MGR', [profile]);
  const isOperator = useMemo(() => profile?.role === 'OPR', [profile]);
  const isVeterinarian = useMemo(() => profile?.role === 'VET', [profile]);
  const isQA = useMemo(() => profile?.role === 'QA', [profile]);
  const isFinance = useMemo(() => profile?.role === 'FIN', [profile]);
  const isViewer = useMemo(() => profile?.role === 'VIEW', [profile]);
  
  // Permission checks
  const hasHealthAccess = useMemo(
    () => isAdmin || isVeterinarian || isQA,
    [isAdmin, isVeterinarian, isQA]
  );
  
  const hasOperationalAccess = useMemo(
    () => isAdmin || isManager || isOperator,
    [isAdmin, isManager, isOperator]
  );
  
  const hasTreatmentEditAccess = useMemo(
    () => isAdmin || isVeterinarian,
    [isAdmin, isVeterinarian]
  );
  
  const hasFinanceAccess = useMemo(
    () => isAdmin || isFinance,
    [isAdmin, isFinance]
  );
  
  // Location assignment checks (Phase 2)
  const hasLocationAssignments = useMemo(() => {
    if (!profile) return false;
    
    return (
      (profile.allowed_areas?.length ?? 0) > 0 ||
      (profile.allowed_stations?.length ?? 0) > 0 ||
      (profile.allowed_containers?.length ?? 0) > 0
    );
  }, [profile]);
  
  const hasAreaAccess = (areaId: number): boolean => {
    if (!profile) return false;
    if (isAdmin || profile.geography === 'ALL') return true;
    
    // If field is undefined (Phase 1 - field doesn't exist), grant access
    if (profile.allowed_areas === undefined) return true;
    
    // If field is defined but empty (Phase 2 - no assignments), deny access
    if (profile.allowed_areas.length === 0) return false;
    
    // Check if user has access to this specific area
    return profile.allowed_areas.includes(areaId);
  };
  
  const hasStationAccess = (stationId: number): boolean => {
    if (!profile) return false;
    if (isAdmin || profile.geography === 'ALL') return true;
    
    // If field is undefined (Phase 1 - field doesn't exist), grant access
    if (profile.allowed_stations === undefined) return true;
    
    // If field is defined but empty (Phase 2 - no assignments), deny access
    if (profile.allowed_stations.length === 0) return false;
    
    // Check if user has access to this specific station
    return profile.allowed_stations.includes(stationId);
  };
  
  const hasContainerAccess = (containerId: number): boolean => {
    if (!profile) return false;
    if (isAdmin || profile.geography === 'ALL') return true;
    
    // If field is undefined (Phase 1 - field doesn't exist), grant access
    if (profile.allowed_containers === undefined) return true;
    
    // If field is defined but empty (Phase 2 - no assignments), deny access
    if (profile.allowed_containers.length === 0) return false;
    
    // Check if user has access to this specific container
    return profile.allowed_containers.includes(containerId);
  };
  
  // Geography checks
  const isAllGeographies = useMemo(() => profile?.geography === 'ALL', [profile]);
  const isScotland = useMemo(() => profile?.geography === 'SC', [profile]);
  const isFaroeIslands = useMemo(() => profile?.geography === 'FO', [profile]);
  
  // Subsidiary checks
  const isAllSubsidiaries = useMemo(() => profile?.subsidiary === 'ALL', [profile]);
  const isBroodstock = useMemo(() => profile?.subsidiary === 'BS', [profile]);
  const isFreshwater = useMemo(() => profile?.subsidiary === 'FW', [profile]);
  const isFarming = useMemo(() => profile?.subsidiary === 'FM', [profile]);
  const isLogistics = useMemo(() => profile?.subsidiary === 'LG', [profile]);
  
  const contextValue: UserContextType = {
    profile,
    isLoading,
    
    // Role checks
    isAdmin,
    isManager,
    isOperator,
    isVeterinarian,
    isQA,
    isFinance,
    isViewer,
    
    // Permission checks
    hasHealthAccess,
    hasOperationalAccess,
    hasTreatmentEditAccess,
    hasFinanceAccess,
    
    // Location assignment checks
    hasLocationAssignments,
    hasAreaAccess,
    hasStationAccess,
    hasContainerAccess,
    
    // Geography checks
    isAllGeographies,
    isScotland,
    isFaroeIslands,
    
    // Subsidiary checks
    isAllSubsidiaries,
    isBroodstock,
    isFreshwater,
    isFarming,
    isLogistics,
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use the user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
