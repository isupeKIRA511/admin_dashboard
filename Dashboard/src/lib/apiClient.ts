import type { AuthResponse } from '../types/admin';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://aqaariq.com/marketplace/api/v1';

/**
 * Generic API fetcher with authentication and error handling
 */
export async function fetchApi<T>(endpoint: string, method = 'GET', body?: any): Promise<T> {
    const token = sessionStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists and it's not a login request
    // Corrected to use case-insensitive check or Swagger path
    if (token && !endpoint.toLowerCase().includes('/auth/admin/login')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);

        // Handle unauthorized (expired token)
        if (response.status === 401 && !endpoint.toLowerCase().includes('/auth/admin/login')) {
            sessionStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('جلسة العمل انتهت، يرجى تسجيل الدخول مرة أخرى');
        }

        let data;
        try {
            data = await response.json();
        } catch (e) {
            // Empty response or non-JSON
            if (response.ok) return { success: true } as any;
        }

        if (!response.ok) {
            const message = data?.message || `خطأ بالاتصال: ${response.status}`;
            throw new Error(message);
        }

        return data as T;
    } catch (error: any) {
        console.error(`API Error: ${endpoint}`, error);
        throw error;
    }
}

/**
 * specialized login function
 */
export const adminLogin = async (phoneNumber: string, password: string): Promise<AuthResponse> => {
    // Swagger confirmation: /Auth/admin/login
    return fetchApi<AuthResponse>('/Auth/admin/login', 'POST', { phoneNumber, password });
};
