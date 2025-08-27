import { create } from 'zustand';
export const API_BASE = import.meta.env?.VITE_API_BASE ?? 'https://genspec-backend-core-production.up.railway.app';
export async function api(path, init) {
    // Prefer sessionStorage (non-remember sessions), then fall back to localStorage
    const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_token') : null)
        || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
    const tokenType = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_token_type') : null)
        || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token_type') : null)
        || 'Bearer';
    const headers = {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
    };
    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `${tokenType} ${token}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
        headers,
        ...init,
    });
    if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`API ${res.status}: ${errorText || res.statusText}`);
        err.status = res.status;
        err.body = errorText;
        throw err;
    }
    return res.json();
}
export const useUIStore = create((set) => ({
    busy: false,
    setBusy: (v) => set({ busy: v }),
}));
