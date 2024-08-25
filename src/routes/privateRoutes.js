import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';

const PrivateRoute = ({ element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
