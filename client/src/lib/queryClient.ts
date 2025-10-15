import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG, getApiUrl, getAuthToken } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const text = await res.text();
      errorMessage = text || res.statusText;
    } catch (e) {
      console.error('[apiRequest] Failed to read error response body:', e);
    }
    console.error('[apiRequest] HTTP Error:', {
      status: res.status,
      statusText: res.statusText,
      message: errorMessage,
      url: res.url
    });
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

/**
 * Centralized API request function with JWT authentication
 * 
 * ⚠️ IMPORTANT: Only use this for endpoints NOT in the generated ApiService!
 * 
 * For 95% of API calls, use the generated client:
 *   import { ApiService } from '@/api/generated';
 *   await ApiService.apiV1SomeEndpoint();
 * 
 * This function is ONLY for:
 *   - Bulk endpoints not in OpenAPI spec
 *   - Custom action endpoints (duplicate, run_projection, etc.)
 * 
 * Authentication & Configuration:
 *   - Uses OpenAPI.BASE (same as generated client) - ensures consistency
 *   - Uses getAuthToken() (same as generated client) - centralized auth
 *   - If infrastructure pages work, this will work too (same config)
 * 
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param url - API endpoint URL (e.g., "/api/v1/scenario/temperature-profiles/bulk_date_ranges/")
 * @param data - Request body data (will be JSON stringified)
 * @returns Response object
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = getApiUrl(url);
  const headers: Record<string, string> = {};
  
  // Add JWT authentication token using centralized getAuthToken()
  // Same pattern as OpenAPI.TOKEN = async () => getAuthToken()
  const token = getAuthToken();
  console.log('[apiRequest] Starting request:', { method, url, fullUrl, hasToken: !!token, hasData: !!data });
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn('[apiRequest] No auth token found!');
  }
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }

  try {
    console.log('[apiRequest] Calling fetch with:', { fullUrl, method, headers, bodyPreview: data ? JSON.stringify(data).substring(0, 100) : 'none' });
    
    const fetchPromise = fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    console.log('[apiRequest] Fetch promise created, awaiting response...');
    const res = await fetchPromise;
    console.log('[apiRequest] ✅ Response received!');

    console.log('[apiRequest] Response details:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      url: res.url,
      type: res.type,
      redirected: res.redirected
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('[apiRequest] ❌ Request failed with error:', error);
    console.error('[apiRequest] Error type:', error instanceof TypeError ? 'TypeError (Network/CORS)' : error?.constructor?.name);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
