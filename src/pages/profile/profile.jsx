import './styleProfile.css';
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import Header from '../../components/global/header/header.jsx';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../../api.js';
import { useAuth } from '../../services/authContext.js';

function Profile() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const handleDeleteAccount = async () => {
        try {
            const userId = user.usuarioId;
            await deleteAccount(userId);
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error eliminando la cuenta:', error);
        }
    };

    return (
        <div className='profile'>
            <Header />
            <h1>Perfil</h1>
            <button className='profile_deleteAccount' onClick={handleDeleteAccount}>Eliminar mi cuenta</button>
        </div>
    )
}

export default Profile;