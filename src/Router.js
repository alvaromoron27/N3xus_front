import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/auth/register/register.jsx';
import Login from './pages/auth/login/login.jsx';
import RecoveryPassword from './pages/auth/passwordRecovery/passwordRecovery.jsx';
import ResetPassword from './pages/auth/resetPassword/resetPassword.jsx';
import Home from './pages/home/home.jsx';
import Profile from './pages/profile/profile.jsx';
import ShoppingCart from './pages/shoppingCart/shoppingCart.jsx';
import { AuthProvider } from './services/authContext.js';
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
                    <Route path="/cart" element={<PrivateRoute element={<ShoppingCart />} />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default Router;
