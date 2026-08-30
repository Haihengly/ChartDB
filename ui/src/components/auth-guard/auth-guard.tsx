import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};
