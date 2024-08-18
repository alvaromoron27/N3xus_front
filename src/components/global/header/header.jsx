/* eslint-disable jsx-a11y/anchor-is-valid */
import './styleHeader.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';

function Header() {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleHomeClick = (e) => {
        e.preventDefault();
        navigate('/')
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate('/login')
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate('/register')
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        navigate('/profile')
    };

    const handleLogoutClick = (e) => {
        logout();
        navigate('/')
    };

    return (
        <header>
            <a href="#" onClick={handleHomeClick}>Home</a>
            {!isAuthenticated ? (
                <>
                    <a href="#" onClick={handleLoginClick}>Inicia sesión</a>
                    <a href="#" onClick={handleRegisterClick}>Regístrate</a>
                </>
            ) : (
                <>
                    <a href="#" onClick={handleProfileClick}>Perfil</a>
                    <a href="#" onClick={handleLogoutClick}>Cerrar sesión</a>
                </>
            )}
        </header>
    )
}

export default Header;