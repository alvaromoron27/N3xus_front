/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './styleHeader.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/reducers/authReducer';
import { clearStateEbookSelected } from '../../../redux/reducers/bookReducer';
import logo from '../../../assets/portadaN3xus.png';

function Header() {
    const navigate = useNavigate();
    const location = useLocation(); // Obtén la ubicación actual
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleNavigation = (path) => (e) => {
        e.preventDefault();
        navigate(path);
    };

    // Función para determinar si la ruta está activa
    const isActive = (path) => location.pathname === path;

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout()); // Despacha la acción de logout
        dispatch(clearStateEbookSelected());
        navigate('/'); // Redirige al usuario a la página de inicio después de cerrar sesión
    };

    return (
        <header>
            <div>
            <a href="#" onClick={handleNavigation('/')} className={isActive('/') ? 'active' : ''}><img src={logo} alt='Logo' /></a>
            </div>
            <div>
            {!isAuthenticated ? (
                <>
                    <a href="#" onClick={handleNavigation('/login')} className={isActive('/login') ? 'active' : ''}>Inicia sesión</a>
                    <a href="#" onClick={handleNavigation('/register')} className={isActive('/register') ? 'active' : ''}>Regístrate</a>
                </>
            ) : (
                <>
                    <a href="#" onClick={handleNavigation('/profile')} className={isActive('/profile') ? 'active' : ''}>Perfil</a>
                    <a href="#" onClick={handleLogout} className={isActive('/logout') ? 'active' : ''}>Cerrar sesión</a>
                </>
            )}
            </div>
        </header>
    );
}

export default Header;
