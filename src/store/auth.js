import { create } from 'zustand';
import { api } from '@/api/client';
// Load persisted session synchronously
const persistedToken = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_token') : null)
    || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null);
const persistedUser = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_user') : null)
    || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null);
export const useAuth = create((set, get) => ({
    user: persistedToken && persistedUser ? JSON.parse(persistedUser) : null,
    token: persistedToken,
    isLoading: false,
    login: async (email, password, remember) => {
        set({ isLoading: true });
        try {
            const resp = await api('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            // Support both { token, user } and Supabase-like { access_token, token_type, refresh_token, expires_at, user }
            const token = resp?.token ?? resp?.access_token;
            const tokenType = resp?.token_type ?? 'bearer';
            const refreshToken = resp?.refresh_token;
            const expiresAt = resp?.expires_at;
            const user = resp?.user ?? resp?.user_data ?? { id: '', email };
            if (!token)
                throw new Error('Login response missing access token');
            try {
                const persist = remember ? localStorage : sessionStorage;
                const clear = remember ? sessionStorage : localStorage;
                persist.setItem('auth_token', token);
                persist.setItem('auth_user', JSON.stringify(user));
                persist.setItem('auth_token_type', tokenType);
                if (refreshToken)
                    persist.setItem('auth_refresh_token', refreshToken);
                if (expiresAt)
                    persist.setItem('auth_expires_at', String(expiresAt));
                clear.removeItem('auth_token');
                clear.removeItem('auth_user');
                clear.removeItem('auth_token_type');
                clear.removeItem('auth_refresh_token');
                clear.removeItem('auth_expires_at');
            }
            catch { }
            set({ user, token, isLoading: false });
        }
        catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
    logout: () => {
        try {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token_type');
            localStorage.removeItem('auth_refresh_token');
            localStorage.removeItem('auth_expires_at');
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_user');
            sessionStorage.removeItem('auth_token_type');
            sessionStorage.removeItem('auth_refresh_token');
            sessionStorage.removeItem('auth_expires_at');
        }
        catch { }
        set({ user: null, token: null });
    },
}));
