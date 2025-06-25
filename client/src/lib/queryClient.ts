import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG, getApiUrl } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get CSRF token for Django requests
async function getCsrfToken(): Promise<string | null> {
  if (!API_CONFIG.USE_DJANGO_API) return null;
  
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith(API_CONFIG.CSRF_COOKIE_NAME + '=')
  );
  
  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  }
  
  // If no CSRF token found, fetch it from Django
  try {
    await fetch(getApiUrl('/api/v1/auth/csrf/'), {
      method: 'GET',
      credentials: 'include',
    });
    
    // Try again after fetching
    const newCookies = document.cookie.split(';');
    const newCsrfCookie = newCookies.find(cookie => 
      cookie.trim().startsWith(API_CONFIG.CSRF_COOKIE_NAME + '=')
    );
    
    return newCsrfCookie ? newCsrfCookie.split('=')[1] : null;
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
    return null;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = getApiUrl(url);
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add CSRF token for Django requests
  if (API_CONFIG.USE_DJANGO_API && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      headers[API_CONFIG.CSRF_HEADER_NAME] = csrfToken;
    }
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
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
