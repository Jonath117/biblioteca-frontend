import {create} from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
    token: string | null;
    roleId: number | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token') || null,
    roleId: null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: (newToken: string) => {
        localStorage.setItem('token', newToken);

        const decoded: any = jwtDecode(newToken);
        const roleId = parseInt(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);

        set({
            token: newToken,
            roleId: roleId,
            isAuthenticated: true,
        });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({token: null, roleId: null, isAuthenticated: false});
    },
}));