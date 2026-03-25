import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        if (token && userJson) {
            setUser(JSON.parse(userJson));
        }
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, login, logout };
}