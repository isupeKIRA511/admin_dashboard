import type { AuthResponse } from '../types/admin';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://aqaariq.com/marketplace/api/v1';

export async function fetchApi<T>(endpoint: string, method = 'GET', body?: any): Promise<T> {
    const token = localStorage.getItem('token'); 
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    // Do not add token for login
    if (token && !endpoint.includes('/auth/admin/login')) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };
    
    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // We try to parse the result.
    let data;
    try {
        data = await response.json();
    } catch(e) {
        // Sometimes backend might return empty body on DELETE or 200 without JSON
        if (response.ok) {
           return { success: true } as any;
        }
    }

    if (!response.ok) {
        const message = data?.message || `خطأ بالاتصال: ${response.status}`;
        throw new Error(message);
    }
    
    return data as T;
}

export const adminLogin = async (phoneNumber: string, password: string): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/admin/login', 'POST', { phoneNumber, password });
};
