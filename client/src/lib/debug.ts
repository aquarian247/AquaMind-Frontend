// Debug and Development Utilities
import { API_CONFIG } from "./config";

export const DEBUG = {
  enabled: import.meta.env.VITE_DEBUG_MODE === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  log: (message: string, data?: any) => {
    if (!DEBUG.enabled) return;
    console.log(`[AquaMind] ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    if (!DEBUG.enabled && DEBUG.logLevel !== 'error') return;
    console.error(`[AquaMind ERROR] ${message}`, error || '');
  },
  
  warn: (message: string, data?: any) => {
    if (!DEBUG.enabled && !['warn', 'error'].includes(DEBUG.logLevel)) return;
    console.warn(`[AquaMind WARN] ${message}`, data || '');
  },
  
  api: (method: string, url: string, data?: any) => {
    if (!DEBUG.enabled || DEBUG.logLevel !== 'debug') return;
    console.log(`[API] ${method} ${url}`, data ? JSON.stringify(data, null, 2) : '');
  },
  
  response: (url: string, response: any) => {
    if (!DEBUG.enabled || DEBUG.logLevel !== 'debug') return;
    console.log(`[API Response] ${url}`, response);
  },
  
  connection: () => {
    const backend = API_CONFIG.USE_DJANGO_API ? 'Django' : 'Express';
    const url = API_CONFIG.USE_DJANGO_API ? API_CONFIG.DJANGO_API_URL : 'Local Express';
    DEBUG.log(`Connected to ${backend} backend at ${url}`);
  }
};

// Network diagnostics for production troubleshooting
export const NetworkDiagnostics = {
  async testConnection(): Promise<{
    backend: string;
    url: string;
    status: 'connected' | 'error';
    latency?: number;
    error?: string;
  }> {
    const backend = API_CONFIG.USE_DJANGO_API ? 'Django' : 'Express';
    const baseUrl = API_CONFIG.USE_DJANGO_API ? API_CONFIG.DJANGO_API_URL : window.location.origin;
    
    try {
      const start = Date.now();
      const response = await fetch(`${baseUrl}/api/health/`, {
        method: 'GET',
        credentials: 'include',
      });
      const latency = Date.now() - start;
      
      if (response.ok) {
        return { backend, url: baseUrl, status: 'connected', latency };
      } else {
        return { 
          backend, 
          url: baseUrl, 
          status: 'error', 
          error: `HTTP ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      return { 
        backend, 
        url: baseUrl, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
  
  async checkCORS(): Promise<{ corsEnabled: boolean; error?: string }> {
    if (!API_CONFIG.USE_DJANGO_API) {
      return { corsEnabled: true }; // Express server handles CORS locally
    }
    
    try {
      const response = await fetch(`${API_CONFIG.DJANGO_API_URL}/api/v1/auth/csrf/`, {
        method: 'GET',
        credentials: 'include',
      });
      
      return { corsEnabled: response.ok };
    } catch (error) {
      return { 
        corsEnabled: false, 
        error: error instanceof Error ? error.message : 'CORS check failed' 
      };
    }
  }
};

// Development helper for switching backends
export const DevelopmentTools = {
  switchToExpress: () => {
    localStorage.setItem('VITE_USE_DJANGO_API', 'false');
    window.location.reload();
  },
  
  switchToDjango: () => {
    localStorage.setItem('VITE_USE_DJANGO_API', 'true');
    window.location.reload();
  },
  
  getCurrentBackend: () => {
    return API_CONFIG.USE_DJANGO_API ? 'Django' : 'Express';
  },
  
  getEnvironmentInfo: () => {
    return {
      mode: import.meta.env.MODE,
      backend: DevelopmentTools.getCurrentBackend(),
      apiUrl: API_CONFIG.USE_DJANGO_API ? API_CONFIG.DJANGO_API_URL : 'Local Express',
      debug: DEBUG.enabled,
      logLevel: DEBUG.logLevel
    };
  }
};
