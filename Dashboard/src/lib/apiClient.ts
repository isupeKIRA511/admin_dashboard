import type { ApiGetOneResponse, AuthResponse } from '../types/admin';
import { logError } from './logger';

const rawApiBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
// Default to the production API base if the env var is not provided.
// This ensures the client targets the correct backend by default.
const API_BASE = rawApiBase && rawApiBase !== '/' ? rawApiBase.replace(/\/$/, '') : 'https://aqaariq.com/marketplace/api/v1';

type ApiError = Error & {
    status?: number;
    data?: unknown;
    url?: string;
};

const isAuthResponseWrapper = (
    response: AuthResponse | ApiGetOneResponse<AuthResponse>,
): response is ApiGetOneResponse<AuthResponse> => (
    typeof response === 'object' && response !== null && 'data' in response
);

/**
 * Generic API fetcher with authentication and error handling
 */
export async function fetchApi<T>(endpoint: string, method = 'GET', body?: unknown): Promise<T> {
    const token = sessionStorage.getItem('token');
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {};

    // Let the browser add the multipart boundary when files are uploaded.
    if (!isFormData) headers['Content-Type'] = 'application/json';

    // Add Authorization header if token exists and it's not an auth request
    // (OTP and public auth endpoints should be called without an Authorization header)
    const lowerEndpoint = endpoint.toLowerCase();
    if (token && !lowerEndpoint.startsWith('/auth')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(`${API_BASE}${normalizedEndpoint}`, config);

        // Handle unauthorized (expired token)
        if (response.status === 401 && !endpoint.toLowerCase().includes('/auth/admin/login')) {
            sessionStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('جلسة العمل انتهت، يرجى تسجيل الدخول مرة أخرى');
        }

        let data: unknown;
        try {
            data = await response.json();
        } catch {
            // Empty response or non-JSON
            if (response.ok) return { success: true } as T;
        }

        if (!response.ok) {
            // Include server response body when throwing so callers can inspect validation details
            const message = typeof data === 'object' && data !== null && 'message' in data
                ? String(data.message)
                : `خطأ بالاتصال: ${response.status}`;
            const err: ApiError = new Error(message);
            err.status = response.status;
            err.data = data;
            err.url = `${API_BASE}${normalizedEndpoint}`;
            throw err;
        }

        return data as T;
    } catch (error) {
        logError(`API Error: ${endpoint}`, error);
        throw error;
    }
}

/**
 * specialized login function
 */
export const adminLogin = async (phoneNumber: string, password: string): Promise<AuthResponse> => {
    const response = await fetchApi<AuthResponse | ApiGetOneResponse<AuthResponse>>(
        '/Auth/admin/login',
        'POST',
        { PhoneNumber: phoneNumber, Password: password },
    );

    if (isAuthResponseWrapper(response)) return response.data;
    return response;
};
