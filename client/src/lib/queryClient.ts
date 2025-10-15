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
 * Uses the same auth pattern as the generated ApiService (OpenAPI.TOKEN)
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
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log('[apiRequest] Response received:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      url: res.url,
      headers: Object.fromEntries(res.headers.entries())
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('[apiRequest] Request failed:', error);
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
