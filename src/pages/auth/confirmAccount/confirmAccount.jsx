import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './confirmAccount.css';
import { confirmAccount } from '../../../api';
import { confirmAccountReducer } from '../../../redux/reducers/authReducer';
import { useSelector, useDispatch } from 'react-redux';

function ConfirmAccount  () {

    const { token } = useParams();
    const [message, setMessage] = useState('Confirmando tu cuenta...');

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    useEffect(() => {
        const confirmUserAccount = async () => {
          try {
            const response = await confirmAccount(token);
            setMessage(response.data.message);
            dispatch(confirmAccountReducer());
          } catch (error) {
            setMessage('Enlace de confirmación inválido o expirado.');
          }
        };
        confirmUserAccount();
        console.log(user);
      }, [token, dispatch]);

    return(
        <p>{message}</p>
    )
}

export default ConfirmAccount