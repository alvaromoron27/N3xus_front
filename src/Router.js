import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/auth/register/register.jsx';
import Login from './components/auth/login/login.jsx';
import RecoveryPassword from './components/auth/passwordRecovery/passwordRecovery.jsx';
import ResetPassword from './components/auth/resetPassword/resetPassword.jsx';
import Home from './components/home/home.jsx';
import Profile from './components/profile/profile.jsx';
import { AuthProvider } from './components/auth/authContext';
import PrivateRoute from './routes/privateRoutes.js';
import PublicRoute from './routes/publicRoutes.js';

const Router = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
            <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/register" element={<PublicRoute element={<Register />} />} />
                    <Route path="/login" element={<PublicRoute element={<Login />} />} />
                    <Route path="/recoveryPassword" element={<PublicRoute element={<RecoveryPassword />} />} />
                    <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default Router;
