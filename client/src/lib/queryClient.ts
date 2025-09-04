import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function extractErrorMessage(res: Response): Promise<string> {
  // Use clones so we don't disturb the original body stream
  try {
    const data = await res.clone().json();
    // Prefer structured error field if present
    if (data && typeof data === "object" && (data as any).error) {
      return (data as any).error || res.statusText;
    }
    return JSON.stringify(data);
  } catch {
    try {
      const text = await res.clone().text();
      return text || res.statusText;
    } catch {
      return res.statusText;
    }
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const message = await extractErrorMessage(res);
    throw new Error(message);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
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
    const res = await fetch(queryKey.join("/") as string, {
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
