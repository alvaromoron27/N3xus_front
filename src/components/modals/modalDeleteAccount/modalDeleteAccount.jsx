import './modalDeleteAccount.css';
import { deleteAccount } from '../../../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearStateEbookSelected } from "../../../redux/reducers/bookReducer.js";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/reducers/authReducer.js";

function ModalDeleteAccount (props){

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate();

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = user.Id;
            await deleteAccount(userId);
            setLoading(false);
            setSuccess('Cuenta eliminada satisfactoriamente');
            dispatch(logout());
            dispatch(clearStateEbookSelected());
            setTimeout(function(){
                navigate('/')
            }, 2000)
          } catch (error) {
            console.error("Error eliminando la cuenta:", error);
          }
    };

    return (
        <div className='modal-overlay'>
            <div className="modal-contentDeleteBook">
            {loading ? 'Eliminando...' : '¿Seguro que deseas eliminar la cuenta?'}
            {error && <p className="error" style={{color:'red'}}>{error}</p>}
            {success && <p className="success" style={{color:'green'}}>{success}</p>}
                <div className="modalDeleteBook-buttons">
                    <button className='modalDeleteBook-delete' onClick={handleDelete} disabled={loading} style={{color:'white'}}>Eliminar</button>
                    <button className='modalDeleteBook-cancel' onClick={props.onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}

export default ModalDeleteAccount;