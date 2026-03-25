// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: JSX.Element;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if no token
        return <Navigate to="/login" replace />;
    }

    return children;
};