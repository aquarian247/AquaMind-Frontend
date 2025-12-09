import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiService } from '@/api/generated/services/ApiService';
import { User } from '@/api/generated/models/User';
import { UserProfile } from '@/api/generated/models/UserProfile';
import { TokenRefresh } from '@/api/generated/models/TokenRefresh';
import { setAuthToken, storeAuthToken, clearAuthToken } from '@/api/index';
import { ApiError } from '@/api/generated/core/ApiError';
import { jwtDecode } from 'jwt-decode';
import { AuthService, AuthTokens } from '@/services/auth.service';

// Types for JWT token response and decoded token
interface JWTTokens {
  access: string;
  refresh: string;
}


interface DecodedToken {
  user_id: number;
  exp: number;
  username?: string;
  email?: string;
  full_name?: string;
  auth_source?: 'ldap' | 'local';
  role?: string;
  geography?: string;
  subsidiary?: string;
  [key: string]: any;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenInfo: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    authSource?: 'ldap' | 'local';
  };
}

// Auth context interface with all methods
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  fetchUserProfile: () => Promise<UserProfile | null>;
}

// Default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading while we check for stored token
  error: null,
  tokenInfo: {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
  login: async () => false,
  logout: () => {},
  refreshToken: async () => false,
  clearError: () => {},
  hasPermission: () => false,
  isAdmin: () => false,
  fetchUserProfile: async () => null,
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that manages authentication state and provides
 * methods for login, logout, and token refresh.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auth state
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    tokenInfo: {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    },
  });

  // Fetch user profile from API
  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const profile = await ApiService.apiV1UsersAuthProfileRetrieve();

      // Update user state with profile data
      if (profile && state.user) {
        setState(prev => ({
          ...prev,
          user: {
            ...prev.user!,
            profile,
          }
        }));
      }

      return profile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Return a default profile to prevent infinite loading
      // This allows the app to function even if profile endpoint fails
      const defaultProfile: UserProfile = {
        full_name: state.user?.username || '',
        phone: null,
        profile_picture: null,
        job_title: null,
        department: null,
        geography: 'ALL',
        subsidiary: 'ALL',
        role: 'ADMIN', // Default to ADMIN if profile fails (can be overridden by backend)
        language_preference: 'en',
        date_format_preference: 'DMY',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Update state with default profile
      if (state.user) {
        setState(prev => ({
          ...prev,
          user: {
            ...prev.user!,
            profile: defaultProfile,
          }
        }));
      }
      
      return defaultProfile;
    }
  };

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const accessToken = AuthService.getAccessToken();
        const refreshToken = AuthService.getRefreshToken();

        if (!accessToken || !refreshToken) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Validate tokens are proper strings before decoding
        if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
          console.warn('Invalid token format detected, clearing authentication');
          handleLogout();
          return;
        }

        let decoded: DecodedToken;
        try {
          // Decode token to check expiration and get user info
          decoded = jwtDecode<DecodedToken>(accessToken);
        } catch (decodeError) {
          console.error('Failed to decode access token:', decodeError);
          console.warn('Invalid or corrupted access token, clearing authentication');
          handleLogout();
          return;
        }

        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired, try to refresh
          const authService = AuthService.getInstance();
          const newTokens = await authService.refreshTokens();

          if (!newTokens) {
            // If refresh fails, clear everything
            handleLogout();
            return;
          }

          let newDecoded: DecodedToken;
          try {
            // Update decoded token with new access token
            newDecoded = jwtDecode<DecodedToken>(newTokens.access);
          } catch (decodeError) {
            console.error('Failed to decode refreshed access token:', decodeError);
            console.warn('Invalid refreshed access token, clearing authentication');
            handleLogout();
            return;
          }

          setAuthToken(newTokens.access);

          // Set auth state with new token info
          setState({
            user: {
              id: newDecoded.user_id,
              username: newDecoded.username || '',
              email: newDecoded.email || '',
              is_active: true,
              date_joined: new Date().toISOString(),
              profile: {} as UserProfile,
            } as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokenInfo: {
              accessToken: newTokens.access,
              refreshToken: newTokens.refresh || null,
              expiresAt: newDecoded.exp,
              authSource: newDecoded.auth_source,
            },
          });

          // Schedule token refresh
          scheduleTokenRefresh(newDecoded.exp);
          
          // Fetch profile BEFORE setting isLoading=false
          try {
            const profile = await ApiService.apiV1UsersAuthProfileRetrieve();
            setState(prev => ({
              ...prev,
              user: prev.user ? { ...prev.user, profile } : prev.user,
            }));
          } catch (profileError) {
            console.error('Failed to fetch profile after token refresh:', profileError);
          }
        } else {
          // Valid token, set auth state (but keep loading until profile is fetched)
          setAuthToken(accessToken);

          // Fetch profile BEFORE setting isLoading=false
          let userProfile: UserProfile = {} as UserProfile;
          try {
            userProfile = await ApiService.apiV1UsersAuthProfileRetrieve();
          } catch (profileError) {
            console.error('Failed to fetch profile during init:', profileError);
          }

          // Set auth state with decoded token info and profile
          setState({
            user: {
              id: decoded.user_id,
              username: decoded.username || '',
              email: decoded.email || '',
              is_active: true,
              date_joined: new Date().toISOString(),
              profile: userProfile,
            } as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            tokenInfo: {
              accessToken,
              refreshToken,
              expiresAt: decoded.exp,
              authSource: decoded.auth_source,
            },
          });

          // Schedule token refresh
          scheduleTokenRefresh(decoded.exp);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleLogout();
      }
    };

    initAuth();
  }, []);

  // Listen for auth events from AuthService
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('AuthContext: Received unauthorized event, logging out');
      handleLogout();
    };

    const handleLogoutEvent = () => {
      console.log('AuthContext: Received logout event');
      handleLogout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  // Schedule token refresh before expiration
  const scheduleTokenRefresh = (expiresAt: number) => {
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = expiresAt - currentTime;
    
    // Refresh 5 minutes before expiration
    const refreshTime = Math.max(timeUntilExpiry - 300, 0) * 1000;
    
    const refreshTimer = setTimeout(() => {
      refreshTokenInternal(state.tokenInfo.refreshToken || '');
    }, refreshTime);
    
    // Clean up timer on unmount
    return () => clearTimeout(refreshTimer);
  };

  // Internal refresh token function
  const refreshTokenInternal = async (refreshToken: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await ApiService.apiTokenRefreshCreate(
        { access: '', refresh: refreshToken }
      );
      
      if (response.access) {
        // Store new access token
        localStorage.setItem('auth_token', response.access);
        setAuthToken(response.access);
        
        // Decode new token
        const decoded = jwtDecode<DecodedToken>(response.access);
        
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          tokenInfo: {
            ...prev.tokenInfo,
            accessToken: response.access,
            expiresAt: decoded.exp,
          },
        }));
        
        // Schedule next refresh
        scheduleTokenRefresh(decoded.exp);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleLogout();
      return false;
    }
  };

  // Login function
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Use the centralized AuthService for login
      const tokens = await AuthService.login(username, password);

      // Decode token to get user info and expiration
      const decoded = jwtDecode<DecodedToken>(tokens.access);

      // Update OpenAPI client with new token
      setAuthToken(tokens.access);

      // Fetch complete user profile BEFORE setting isLoading to false
      const userProfile = await fetchUserProfile();

      setState({
        user: {
          id: decoded.user_id,
          username: decoded.username || username,
          email: decoded.email || '',
          is_active: true,
          date_joined: new Date().toISOString(),
          profile: userProfile || ({} as UserProfile),
        } as User,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        tokenInfo: {
          accessToken: tokens.access,
          refreshToken: tokens.refresh || null,
          expiresAt: decoded.exp,
          authSource: decoded.auth_source,
        },
      });

      // Schedule token refresh
      scheduleTokenRefresh(decoded.exp);

      return true;
    } catch (error) {
      let errorMessage = 'Login failed: Unknown error';

      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Invalid username or password';
        } else {
          errorMessage = error.message;
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return false;
    }
  };

  // Logout function
  const handleLogout = () => {
    // Use centralized AuthService for logout
    AuthService.logout();
    clearAuthToken();

    // Reset auth state
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      tokenInfo: {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      },
    });
  };

  // Public refresh token function
  const handleRefreshToken = async (): Promise<boolean> => {
    return refreshTokenInternal(state.tokenInfo.refreshToken || '');
  };

  // Clear error function
  const handleClearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Permission checking helpers
  const hasPermission = (permission: string): boolean => {
    // This is a placeholder - in a real app, you'd check against user permissions
    // from the JWT token or from a separate API call
    return state.isAuthenticated && state.user !== null;
  };

  const isAdmin = (): boolean => {
    // Check if user has admin role
    return state.isAuthenticated && state.user?.role === 'ADMIN';
  };

  // Provide the auth context
  const contextValue: AuthContextType = {
    ...state,
    login: handleLogin,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    clearError: handleClearError,
    hasPermission,
    isAdmin,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
