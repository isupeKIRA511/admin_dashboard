const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://aqaariq.com/marketplace/api/v1'; 

export async function fetchApi(endpoint: string, method = 'GET', body?: any) {
    const token = localStorage.getItem('token'); 
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
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
    
    if (!response.ok) {
        throw new Error(`خطأ بالاتصال: ${response.status}`);
    }
    
    return await response.json();
}