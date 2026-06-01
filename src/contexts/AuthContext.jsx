import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile/');
            setUser(response.data);
        } catch {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('/auth/login/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        await fetchProfile();
    };

    const register = async (username, email, password, password2) => {
        await api.post('/auth/register/', { username, email, password, password2 });
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            await api.post('/auth/logout/', { refresh });
        } catch {
            // игнорируем ошибку
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await fetchProfile();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);