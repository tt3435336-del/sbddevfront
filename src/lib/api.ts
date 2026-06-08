export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface StoredAuthSession {
  token: string;
  user: AuthUser;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  meta?: unknown;
}

const DEFAULT_API_BASE_URL = "http://localhost:3002";
const AUTH_STORAGE_KEY = "safetypro_admin_auth";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export const getStoredAuthSession = (): StoredAuthSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;

    return parsed as StoredAuthSession;
  } catch {
    return null;
  }
};

export const saveAuthSession = (session: StoredAuthSession) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getAuthToken = () => getStoredAuthSession()?.token || null;

export const apiRequest = async <T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<ApiResponse<T>> => {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers,
  });

  let payload: ApiResponse<T> | null = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.error || `Erreur HTTP ${response.status}`) as Error & { status?: number };
    error.status = response.status;

    if (response.status === 401 && options.auth) {
      clearAuthSession();
    }

    throw error;
  }

  return payload as ApiResponse<T>;
};
