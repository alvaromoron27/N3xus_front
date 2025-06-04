import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./confirmAccount.css";
import { confirmAccount } from "../../../api";
import { confirmAccountAction } from "../../../redux/reducers/authReducer";
import { useDispatch } from "react-redux";

function ConfirmAccount() {
  const { token } = useParams();
  const [message, setMessage] = useState(
    "Cuenta confirmada correctamente. En unos momentos se redirigirá a la página de inicio de sesión."
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmUserAccount = async () => {
      try {
        const response = await confirmAccount(token);
        setMessage(response.data.message);
        dispatch(confirmAccountAction());
      } catch (error) {
        setMessage("Enlace de confirmación inválido o expirado.");
      }
    };

    confirmUserAccount();

    // Redirigir a login después de 10 segundos
    const timer = setTimeout(() => {
      navigate("/login"); // Cambia '/login' si tu ruta de login es diferente
    }, 10000);

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
  }, [token, dispatch, navigate]);

  return <p>{message}</p>;
}

export default ConfirmAccount;
