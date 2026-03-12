import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    // Data is stored directly as { role, token, email, ... } — no `.user` wrapper
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo.token) {
        return <Navigate to="/login" replace />;
    }

    // Check role directly on userInfo, NOT userInfo.user
    if (adminOnly && userInfo.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
