import { useFormik } from "formik";
import * as Yup from "yup";
import "./stylePasswordRecovery.css";
import "../../../global/styles/globalStyles.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { recoverPassword } from "../../../api.js";
import Header from "../../../components/global/header/header.jsx";

function PasswordRecovery() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    const validationSchema = Yup.object().shape({
        correo: Yup.string()
            .email("Debe ser un correo electrónico válido")
            .required("El correo electrónico es obligatorio"),
    });

    const handleBackClick = () => {
        navigate("/login");
    };

    const formik = useFormik({
        initialValues: {
            correo: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await recoverPassword(values.correo);

                // Si no hay error, continúa
                localStorage.setItem("showResetMessage", "true");
                localStorage.setItem("emailRecoveryPassword", values.correo);
                navigate("/login");
            } catch (error) {
                // Captura errores de Axios
                if (error.response && error.response.status === 404) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage("Error del servidor. Inténtalo más tarde.");
                }
            }
        },
    });

    return (
        <div className="passwd_recover">
            <Header />
            <form className="passwd_recover_form" onSubmit={formik.handleSubmit}>
                <h1>Recuperar contraseña</h1>
                <div>
                    <div className="passwd_recover_form_inputs">
                        <input
                            className="input"
                            type="text"
                            name="correo"
                            placeholder="Email"
                            {...formik.getFieldProps("correo")}
                            style={{
                                borderColor:
                                    formik.touched.correo && formik.errors.correo ? "red" : "",
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
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
                <div>
                    <input className="buttonAuth" type="submit" value="Enviar" />
                    <button className="buttonAuth buttonBack" onClick={handleBackClick}>
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PasswordRecovery;
