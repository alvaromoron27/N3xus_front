import { useFormik } from "formik";
import * as Yup from "yup";
import "./styleResetPassword.css";
import "../../../global/styles/globalStyles.css";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { resetPassword } from "../../../api";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [visibilityPasswd, setVisibilityPasswd] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [succesfullMessage, setSuccesfullMessage] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Lógica de validación del token
    if (token && token.length === 64) {
      setIsValidToken(true);
    }
  }, [token, isValidToken]);

  const formik = useFormik({
    initialValues: {
      contraseña: "",
      confirmarContraseña: "",
    },
    validationSchema: Yup.object({
      contraseña: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(/[a-z]/, "Debe contener al menos una minúscula")
        .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
        .matches(/\d/, "Debe contener al menos un número")
        .matches(/[@$!%*?&]/, "Debe contener al menos un símbolo")
        .required("La contraseña es obligatoria"),
      confirmarContraseña: Yup.string()
        .oneOf([Yup.ref("contraseña"), null], "Las contraseñas no coinciden")
        .required("Debe confirmar la contraseña"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await resetPassword(token, values.contraseña);
        setDisabled(true);
        setSuccesfullMessage(true);
        // Espera 5 segundos (5000 milisegundos), luego redirige
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        console.error("Error al cambiar la constraseña:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setVisibilityPasswd(!visibilityPasswd);
  };

  return (
    <div className="resetPassword">
      {succesfullMessage ? (
        <div className="reset-password-succesfullMessage">
          <p>
            Su contraseña ha sido cambiada correctamente. En unos instantes se redirigirá a la página de login.
          </p>
        </div>
      ) : (
        ""
      )}
      {isValidToken ? (
        <form
          className={`resetPassword_form ${
            succesfullMessage ? "formDisplayNone" : ""
          }`}
          onSubmit={formik.handleSubmit}
        >
          <h1>Establecer contraseña</h1>
          <div>
            <div className="resetPassword_form_inputs">
              <input
                className="input"
                type={visibilityPasswd ? "text" : "password"}
                name="contraseña"
                placeholder="Contraseña"
                {...formik.getFieldProps("contraseña")}
                style={{
                  borderColor:
                    formik.touched.contraseña && formik.errors.contraseña
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
          </div>
          <div>
            <div className="resetPassword_form_inputs">
              <input
                className="input"
                type={visibilityPasswd ? "text" : "password"}
                name="confirmarContraseña"
                placeholder="Confirmar contraseña:"
                {...formik.getFieldProps("confirmarContraseña")}
                style={{
                  borderColor:
                    formik.touched.confirmarContraseña &&
                    formik.errors.confirmarContraseña
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
            {formik.touched.confirmarContraseña &&
              formik.errors.confirmarContraseña && (
                <p className="error-message">
                  {formik.errors.confirmarContraseña}
                </p>
              )}
          </div>
          <div>
            <input
              className="buttonAuth"
              type="submit"
              value="Cambiar"
              disabled={disabled}
            />
          </div>
        </form>
      ) : (
        <p>Token inválido o no proporcionado.</p>
      )}
    </div>
  );
}

export default ResetPassword;
