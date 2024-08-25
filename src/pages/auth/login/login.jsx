/* eslint-disable jsx-a11y/anchor-is-valid */
import "./styleLogin.css";
import "../../../global/styles/globalStyles.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../../services/authContext.js";
import {
  recoverPassword,
  resendConfirmationEmail,
  loginUser,
} from "../../../api.js";
import Header from "../../../components/global/header/header.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [visibilityPasswd, setVisibilityPasswd] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [showResetMessage, setShowResetMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // Tiempo restante para el contador
  const [isDisabled, setIsDisabled] = useState(true);

  const formik = useFormik({
    initialValues: {
      correo: "",
      contraseña: "",
    },
    validationSchema: Yup.object({
      correo: Yup.string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      contraseña: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors, setFieldError }) => {
      try {
        const userData = await loginUser(values);
        login(userData);
        navigate("/");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);

        if (error.response && error.response.data.unconfirmed) {
          // La cuenta no está confirmada
          // Enviar el correo de confirmación
          await handleResendConfirmation(values.correo);
          setShowConfirmationMessage(true);
          setError(
            "Tu cuenta no está confirmada. Se ha enviado un correo de confirmación a tu dirección de email."
          );
        } else if(error.response.data.message === 'Usuario no encontrado'){
          setFieldError('general', 'El correo o la contraseña son incorrectos');
        }else if(error.response.status === 404){
          setFieldError('general', 'Error en la base de datos');
        } else {
          // Mostrar error de credenciales
          setError(
            "Error al iniciar sesión. Por favor, verifica tus credenciales."
          );
          setErrors({ general: "Error al iniciar sesión." });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const messageConfirmation = localStorage.getItem("showConfirmationMessage");
    const messageReset = localStorage.getItem("showResetMessage");
    if (messageConfirmation === "true") {
      setShowConfirmationMessage(true);
      localStorage.removeItem("showConfirmationMessage");
    }
    if (messageReset === "true") {
      setShowResetMessage(true);
      localStorage.removeItem("showResetMessage");
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsDisabled(false); // Habilitar el botón cuando el tiempo llegue a 0
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId); // Limpiar el timeout cuando se desmonta o reinicia
  }, [timeLeft]);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const togglePasswordVisibility = () => {
    setVisibilityPasswd(!visibilityPasswd);
  };

  const handleRecoveryClick = () => {
    navigate("/recoveryPassword");
  };

  const handleSubmit = async () => {
    const emailResetPassword = localStorage.getItem("emailRecoveryPassword");
    if (emailResetPassword) {
      try {
        await recoverPassword(emailResetPassword);
        // Deshabilitar el botón y comenzar el contador
        setTimeLeft(120); // 2 minutos
        setIsDisabled(true);
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
      }
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await resendConfirmationEmail(formik.values.correo);
      setError(
        "Correo de confirmación reenviado. Por favor, verifica tu bandeja de entrada."
      );
      setTimeLeft(120); // Reiniciar el contador a 2 minutos
      setIsDisabled(true); // Deshabilitar el botón
    } catch (error) {
      setError(
        "Error al reenviar el correo de confirmación. Inténtalo de nuevo."
      );
    }
  };
  return (
    <div className="login">
      <Header />
      <div className="content-login">
        {showConfirmationMessage && (
          <div className="confirmation">
            <p>
              Se ha enviado un correo de confirmación de cuenta a tu dirección
              de email,
              <br />
              por favor, sigue las instrucciones para confirmar tu registro.
              <br />
              <br />
              ¿No recibiste nuestro correo?{" "}
              <button onClick={handleResendConfirmation} disabled={isDisabled}>
                Reenviar
              </button>
              {isDisabled && (
                <span style={{ marginLeft: "10px" }}>
                  ({Math.floor(timeLeft / 60)}:
                  {("0" + (timeLeft % 60)).slice(-2)})
                </span>
              )}
              <br />
              <br />
              Una vez que confirmes tu cuenta, recarga la página e inicia sesión.
            </p>
          </div>
        )}
        {showResetMessage && (
          <div className="confirmation">
            <p>
              Se ha enviado un correo electrónico con instrucciones para
              restablecer la contraseña.
              <br />
              <br />
              ¿No recibiste nuestro correo?{" "}
              <button onClick={handleSubmit} disabled={isDisabled}>
                Reenviar
              </button>
              {isDisabled && (
                <span style={{ marginLeft: "10px" }}>
                  ({Math.floor(timeLeft / 60)}:
                  {("0" + (timeLeft % 60)).slice(-2)})
                </span>
              )}
            </p>
          </div>
        )}
        <div className="formAndErrors">
          <form className="login_form" onSubmit={formik.handleSubmit}>
            <h1>Login</h1>
            <div>
              <div className="login_form_inputs">
                <input
                  className="input"
                  type="text"
                  name="correo"
                  placeholder="Email"
                  {...formik.getFieldProps("correo")}
                  style={{
                    borderColor:
                      formik.touched.correo && formik.errors.correo
                        ? "red"
                        : "",
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-2.2 2L16 14.78L6.2 8ZM4 24V8.91l11.43 7.91a1 1 0 0 0 1.14 0L28 8.91V24Z"
                  />
                </svg>
              </div>
              {formik.touched.correo && formik.errors.correo && (
                <p className="error-message">{formik.errors.correo}</p>
              )}
            </div>
            <div>
              <div className="login_form_inputs">
                <input
                  className="input"
                  type={visibilityPasswd ? "text" : "password"}
                  name="contraseña"
                  placeholder="Contraseña"
                  {...formik.getFieldProps("contraseña")}
                  style={{
                    borderColor:
                      formik.touched.correo && formik.errors.correo
                        ? "red"
                        : "",
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {visibilityPasswd ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v4a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 9.5zm4.146.646l-.646.647l-.646-.647a.5.5 0 1 0-.708.708l.647.646l-.647.646a.5.5 0 1 0 .708.708l.646-.647l.646.647a.5.5 0 1 0 .708-.708L5.207 7.5l.647-.646a.5.5 0 1 0-.708-.708m4 0l-.646.647l-.646-.647a.5.5 0 1 0-.708.708l.647.646l-.647.646a.5.5 0 1 0 .708.708l.646-.647l.646.647a.5.5 0 1 0 .708-.708L9.207 7.5l.647-.646a.5.5 0 0 0-.708-.708M11 8.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                      fill="currentColor"
                    >
                      <path d="M10.25 10A6.25 6.25 0 0 0 4 16.25v15.5A6.25 6.25 0 0 0 10.25 38h27.5A6.25 6.25 0 0 0 44 31.75v-15.5A6.25 6.25 0 0 0 37.75 10zM6.5 16.25a3.75 3.75 0 0 1 3.75-3.75h27.5a3.75 3.75 0 0 1 3.75 3.75v15.5a3.75 3.75 0 0 1-3.75 3.75h-27.5a3.75 3.75 0 0 1-3.75-3.75zm5.634 4.116a1.25 1.25 0 0 0-1.768 1.768L12.232 24l-1.866 1.866a1.25 1.25 0 0 0 1.768 1.768L14 25.768l1.866 1.866a1.25 1.25 0 0 0 1.768-1.768L15.768 24l1.866-1.866a1.25 1.25 0 0 0-1.768-1.768L14 22.232zm9.232 0a1.25 1.25 0 0 1 1.768 0L25 22.232l1.866-1.866a1.25 1.25 0 0 1 1.768 1.768L26.768 24l1.866 1.866a1.25 1.25 0 0 1-1.768 1.768L25 25.768l-1.866 1.866a1.25 1.25 0 0 1-1.768-1.768L23.232 24l-1.866-1.866a1.25 1.25 0 0 1 0-1.768M33.25 25.5a1.25 1.25 0 1 0 0 2.5h4.5a1.25 1.25 0 1 0 0-2.5z" />
                    </svg>
                  )}
                </button>
              </div>
              {formik.touched.contraseña && formik.errors.contraseña && (
                <p className="error-message">{formik.errors.contraseña}</p>
              )}
              <p onClick={handleRecoveryClick}>He olvidado mi contraseña</p>
            </div>
            <div>
              <input className="buttonAuth" type="submit" value="Login" disabled={showConfirmationMessage}/>
            </div>
          </form>
          {formik.errors.general && <p className="error-message">{formik.errors.general}</p>}
          <p className="linkRegister">
            Si aun no tienes cuenta{" "}
            <a href="#" onClick={handleRegisterClick}>
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
