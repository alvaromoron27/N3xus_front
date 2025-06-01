import './modalDeleteBook.css';
import { deleteBook } from '../../../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteSavedBookReducer } from '../../../redux/reducers/authReducer';
import { useSelector, useDispatch } from "react-redux";

function ModalDeleteBook (props){

    const dispatch = useDispatch();
    const bookSelected = useSelector((state) => state.book.selectedBook);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate();

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteBook(props.bookId);
            dispatch(deleteSavedBookReducer(bookSelected));
            setLoading(false);
            setSuccess('Libro eliminado satisfactoriamente');
            setTimeout(function(){
                navigate('/home')
            }, 2000)
        } catch (error) {
            setError('Error al eliminar el libro.');
            setLoading(false);
        }
    };

    return (
        <div className='modal-overlay'>
            <div className="modal-contentDeleteBook">
            {loading ? 'Eliminando...' : '¿Seguro que deseas eliminar el libro?'}
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

export default ModalDeleteBook;