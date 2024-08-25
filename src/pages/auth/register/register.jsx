/* eslint-disable jsx-a11y/anchor-is-valid */
import './styleRegister.css';
import '../../../global/styles/globalStyles.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../../api.js';
import Header from '../../../components/global/header/header.jsx';

const Register = () => {
  const navigate = useNavigate();

  const [visibilityPasswd, setVisibilityPasswd] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellidos: '',
      correo: '',
      contraseña: '',
      confirmarContraseña: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellidos: Yup.string().required('Los apellidos son obligatorios'),
      correo: Yup.string().email('Correo electrónico inválido').required('El correo es obligatorio'),
      contraseña: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/, 'Debe contener al menos una minúscula')
        .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .matches(/\d/, 'Debe contener al menos un número')
        .matches(/[@$!%*?&]/, 'Debe contener al menos un símbolo')
        .required('La contraseña es requerida'),
      confirmarContraseña: Yup.string()
        .oneOf([Yup.ref('contraseña'), null], 'Las contraseñas no coinciden')
        .required('Debe confirmar la contraseña')
    }),
    onSubmit: async (values, { setSubmitting, setErrors, setFieldError }) => {
      try {
        await registerUser(values);
        localStorage.setItem('showConfirmationMessage', 'true');
        navigate('/login');
      } catch (error) {
        console.error('Error registrando usuario:', error.response);
        if (error.response && error.response.status === 409) {
          setFieldError('correo', 'El correo electrónico ya está registrado.');
        } else {
          setErrors({ general: 'Error en la base de datos, por favor, inténtelo de nuevo mas tarde.' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setVisibilityPasswd(!visibilityPasswd);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="register">
      <Header />
      <form className='register_form' onSubmit={formik.handleSubmit}>
        <h1>Registro</h1>
        <div>
          <div className="register_form_inputs">
            <input
              className='input'
              type='text'
              name='nombre'
              placeholder='Nombre'
              {...formik.getFieldProps('nombre')}
              style={{ borderColor: formik.touched.nombre && formik.errors.nombre ? 'red' : '' }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56" /></svg>
          </div>
          {formik.touched.nombre && formik.errors.nombre && <p className="error-message">{formik.errors.nombre}</p>}
        </div>
        <div>
          <div className="register_form_inputs">
            <input
              className='input'
              type='text'
              name='apellidos'
              placeholder='Apellidos'
              {...formik.getFieldProps('apellidos')}
              style={{ borderColor: formik.touched.apellidos && formik.errors.apellidos ? 'red' : '' }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56" /></svg>
          </div>
          {formik.touched.apellidos && formik.errors.apellidos && <p className="error-message">{formik.errors.apellidos}</p>}
        </div>
        <div>
          <div className="register_form_inputs">
            <input
              className='input'
              type='text'
              name='correo'
              placeholder='Email'
              {...formik.getFieldProps('correo')}
              style={{ borderColor: formik.touched.correo && formik.errors.correo ? 'red' : '' }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-2.2 2L16 14.78L6.2 8ZM4 24V8.91l11.43 7.91a1 1 0 0 0 1.14 0L28 8.91V24Z" /></svg>
          </div>
          {formik.touched.correo && formik.errors.correo && <p className="error-message">{formik.errors.correo}</p>}
        </div>
        <div>
          <div className="register_form_inputs">
            <input
              className='input'
              type={visibilityPasswd ? 'text' : 'password'}
              name='contraseña'
              placeholder='Contraseña'
              {...formik.getFieldProps('contraseña')}
              style={{ borderColor: formik.touched.contraseña && formik.errors.contraseña ? 'red' : '' }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, }}
            >
              {visibilityPasswd ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v4a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 9.5zm4.146.646l-.646.647l-.646-.647a.5.5 0 1 0-.708.708l.647.646l-.647.646a.5.5 0 1 0 .708.708l.646-.647l.646.647a.5.5 0 1 0 .708-.708L5.207 7.5l.647-.646a.5.5 0 1 0-.708-.708m4 0l-.646.647l-.646-.647a.5.5 0 1 0-.708.708l.647.646l-.647.646a.5.5 0 1 0 .708.708l.646-.647l.646.647a.5.5 0 1 0 .708-.708L9.207 7.5l.647-.646a.5.5 0 0 0-.708-.708M11 8.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M10.25 10A6.25 6.25 0 0 0 4 16.25v15.5A6.25 6.25 0 0 0 10.25 38h27.5A6.25 6.25 0 0 0 44 31.75v-15.5A6.25 6.25 0 0 0 37.75 10zM6.5 16.25a3.75 3.75 0 0 1 3.75-3.75h27.5a3.75 3.75 0 0 1 3.75 3.75v15.5a3.75 3.75 0 0 1-3.75 3.75h-27.5a3.75 3.75 0 0 1-3.75-3.75zm5.634 4.116a1.25 1.25 0 0 0-1.768 1.768L12.232 24l-1.866 1.866a1.25 1.25 0 0 0 1.768 1.768L14 25.768l1.866 1.866a1.25 1.25 0 0 0 1.768-1.768L15.768 24l1.866-1.866a1.25 1.25 0 0 0-1.768-1.768L14 22.232zm9.232 0a1.25 1.25 0 0 1 1.768 0L25 22.232l1.866-1.866a1.25 1.25 0 0 1 1.768 1.768L26.768 24l1.866 1.866a1.25 1.25 0 0 1-1.768 1.768L25 25.768l-1.866 1.866a1.25 1.25 0 0 1-1.768-1.768L23.232 24l-1.866-1.866a1.25 1.25 0 0 1 0-1.768M33.25 25.5a1.25 1.25 0 1 0 0 2.5h4.5a1.25 1.25 0 1 0 0-2.5z" />
                </svg>
              )}
            </button>
          </div>
          {formik.touched.contraseña && formik.errors.contraseña && <p className="error-message">{formik.errors.contraseña}</p>}
        </div>
        <div>
          <div className="register_form_inputs">
            <input
              className='input'
              type={visibilityPasswd ? 'text' : 'password'}
              name='confirmarContraseña'
              placeholder='Confirmar contraseña:'
              {...formik.getFieldProps('confirmarContraseña')}
              style={{ borderColor: formik.touched.confirmarContraseña && formik.errors.confirmarContraseña ? 'red' : '' }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, }}
            >
              {visibilityPasswd ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v4a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 9.5zm4.146.646l-.646.647l-.646-.647a.5.5 0 1 0-.708.708l.647.646l-.647.646a.5.5 0 1 0 .708.708l.646-.647l.646.647a.5.5 0 1 0 .708-.708L5.207 7.5l.647-.646a.5.5 0 1 0-.708-.708m4 0l-.646.647l-.646-.647a.5.5 0 1 0-.708.708l.647.646l-.647.646a.5.5 0 1 0 .708.708l.646-.647l.646.647a.5.5 0 1 0 .708-.708L9.207 7.5l.647-.646a.5.5 0 0 0-.708-.708M11 8.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0-.5.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M10.25 10A6.25 6.25 0 0 0 4 16.25v15.5A6.25 6.25 0 0 0 10.25 38h27.5A6.25 6.25 0 0 0 44 31.75v-15.5A6.25 6.25 0 0 0 37.75 10zM6.5 16.25a3.75 3.75 0 0 1 3.75-3.75h27.5a3.75 3.75 0 0 1 3.75 3.75v15.5a3.75 3.75 0 0 1-3.75 3.75h-27.5a3.75 3.75 0 0 1-3.75-3.75zm5.634 4.116a1.25 1.25 0 0 0-1.768 1.768L12.232 24l-1.866 1.866a1.25 1.25 0 0 0 1.768 1.768L14 25.768l1.866 1.866a1.25 1.25 0 0 0 1.768-1.768L15.768 24l1.866-1.866a1.25 1.25 0 0 0-1.768-1.768L14 22.232zm9.232 0a1.25 1.25 0 0 1 1.768 0L25 22.232l1.866-1.866a1.25 1.25 0 0 1 1.768 1.768L26.768 24l1.866 1.866a1.25 1.25 0 0 1-1.768 1.768L25 25.768l-1.866 1.866a1.25 1.25 0 0 1-1.768-1.768L23.232 24l-1.866-1.866a1.25 1.25 0 0 1 0-1.768M33.25 25.5a1.25 1.25 0 1 0 0 2.5h4.5a1.25 1.25 0 1 0 0-2.5z" />
                </svg>
              )}
            </button>
          </div>
          {formik.touched.confirmarContraseña && formik.errors.confirmarContraseña && <p className="error-message">{formik.errors.confirmarContraseña}</p>}
        </div>
        <div>
          <input className='buttonAuth' type='submit' value='Registrarme' />
        </div>
      </form>
      {formik.errors.general && <p className="error-message">{formik.errors.general}</p>}
      <p className='linkLogin'>Si ya tienes cuenta <a href="#" onClick={handleLoginClick}>Inicia sesión</a></p>
    </div>
  );
}

export default Register;
