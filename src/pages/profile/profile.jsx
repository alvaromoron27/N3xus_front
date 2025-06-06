import "./styleProfile.css";
import React, { useRef, useState } from "react";
import Header from "../../components/global/header/header.jsx";
import { useDispatch, useSelector } from "react-redux";
import ModalSavedBooks from "../../components/modals/modalSavedBooks/modalSavedBooks.jsx";
import ModalUploadedBooks from "../../components/modals/modalUploadedBooks/modalUploadedBooks.jsx";
import ModalDeleteAccount from "../../components/modals/modalDeleteAccount/modalDeleteAccount.jsx";
import { editUserField } from "../../redux/reducers/authReducer.js";
import { editAvatar, editUsername, editName, editSurname, editEmail } from "../../api.js";
import fotoPerfilDefault from "../../assets/foto_perfil_default.png";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [errorMsgAvatar, setErrorMsgAvatar] = useState("");
  const [successMsgAvatar, setSuccessMsgAvatar] = useState("");

  const [errorMsgUsername, setErrorMsgUsername] = useState("");
  const [successMsgUsername, setSuccessMsgUsername] = useState("");

  const [errorMsgName, setErrorMsgName] = useState("");
  const [successMsgName, setSuccessMsgName] = useState("");

  const [errorMsgSurname, setErrorMsgSurname] = useState("");
  const [successMsgSurname, setSuccessMsgSurname] = useState("");

  const [errorMsgEmail, setErrorMsgEmail] = useState("");
  const [successMsgEmail, setSuccessMsgEmail] = useState("");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSurname, setIsEditingSurname] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const inputRef = useRef(null);
  const [tempAvatar, setTempAvatar] = useState(user.Avatar);
  const [tempUsername, setTempUsername] = useState(user.Usuario);
  const [tempName, setTempName] = useState(user.Nombre);
  const [tempSurname, setTempSurname] = useState(user.Apellidos);
  const [tempEmail, setTempEmail] = useState(user.Correo);

  const [modalSavedEbookOpen, setModalSavedEbookOpen] = useState(false);
  const [modalUploadedEbookOpen, setModalUploadedEbookOpen] = useState(false);
  const [modalDeleteAccountOpen, setModalDeleteAccountOpen] = useState(false);

  const handleClick = () => {
    inputRef.current.click(); // Abre el explorador de archivos
  };

  const handleFileChange = async (e) => {
  const archivo = e.target.files[0];

  if (archivo && archivo.type.startsWith("image/")) {
    try {
      setTempAvatar(URL.createObjectURL(archivo)); // Preview local inmediata

      const response = await editAvatar(archivo, user.Id); // O el ID que uses
      setTempAvatar(response.avatar); // Actualiza con la URL real de Cloudinary

      setSuccessMsgAvatar(response.message);
      setErrorMsgAvatar("");
      setTimeout(() => setSuccessMsgAvatar(""), 5000);
      dispatch(
                editUserField({ field: "Avatar", value: response.avatar })
              );
    } catch (err) {
      setSuccessMsgAvatar("");
      setErrorMsgAvatar("Error al subir avatar");
      setTimeout(() => setErrorMsgAvatar(""), 5000);
    }
  } else {
    setSuccessMsgAvatar("");
    setErrorMsgAvatar("Archivo inválido");
    setTimeout(() => setErrorMsgAvatar(""), 5000);
  }
};


  const handleEditUser = async (field) => {
    switch (field) {
      case "username":
        if (isEditingUsername) {
          try {
            const result = await editUsername(user.Id, tempUsername); // leer el texto devuelto por el servidor

            if (result.status === 200) {
              setSuccessMsgUsername(result.data.res);
              setErrorMsgUsername("");
              setTimeout(() => setSuccessMsgUsername(""), 5000);
              dispatch(
                editUserField({ field: "Usuario", value: result.data.Usuario })
              );
            } else {
              setErrorMsgUsername(result.data.res); // ← aquí se guarda el error
              setSuccessMsgUsername(""); //Mensaje de success vacio
              setTimeout(() => setErrorMsgUsername(""), 5000);
              setTempUsername(user.Usuario);
            }
          } catch (error) {
            if (error.response) {
              // El backend respondió con error, pero no es un fallo de red
              setErrorMsgUsername(error.response.data); // ← Aquí viene el mensaje del backend
              setTempUsername(user.Usuario);
              setTimeout(() => setErrorMsgUsername(""), 5000);
            } else {
              setErrorMsgUsername("Error de red o del servidor.");
              setTempUsername(user.Usuario);
              setTimeout(() => setErrorMsgUsername(""), 5000);
            }
            setSuccessMsgUsername("");
          }
        } else {
          setTempUsername(user.Usuario);
        }
        setIsEditingUsername(!isEditingUsername);
        break;
      case "name":
        if (isEditingName) {
          try {
            const result = await editName(user.Id, tempName); // leer el texto devuelto por el servidor

            if (result.status === 200) {
              setSuccessMsgName(result.data.res);
              setErrorMsgName("");
              setTimeout(() => setSuccessMsgName(""), 5000);
              dispatch(
                editUserField({ field: "Nombre", value: result.data.Nombre })
              );
            } else {
              setErrorMsgName(result.data.res); // ← aquí se guarda el error
              setSuccessMsgName(""); //Mensaje de success vacio
              setTimeout(() => setErrorMsgName(""), 5000);
              setTempName(user.Nombre);
            }
          } catch (error) {
            if (error.response) {
              // El backend respondió con error, pero no es un fallo de red
              setErrorMsgName(error.response.data); // ← Aquí viene el mensaje del backend
              setTempName(user.Nombre);
              setTimeout(() => setErrorMsgName(""), 5000);
            } else {
              setErrorMsgName("Error de red o del servidor.");
              setTempName(user.Nombre);
              setTimeout(() => setErrorMsgName(""), 5000);
            }
            setSuccessMsgName("");
          }
        } else {
          setTempName(user.Nombre);
        }
        setIsEditingName(!isEditingName);
        break;
      case "surname":
        if (isEditingSurname) {
          try {
            const result = await editSurname(user.Id, tempSurname); // leer el texto devuelto por el servidor

            if (result.status === 200) {
              setSuccessMsgSurname(result.data.res);
              setErrorMsgSurname("");
              setTimeout(() => setSuccessMsgSurname(""), 5000);
              // Aquí podrías actualizar el estado global/user si lo necesitas
              dispatch(
                editUserField({
                  field: "Apellidos",
                  value: result.data.Apellidos,
                })
              );
            } else {
              setErrorMsgSurname(result.data.res); // ← aquí se guarda el error
              setSuccessMsgSurname(""); //Mensaje de success vacio
              setTimeout(() => setErrorMsgSurname(""), 5000);
              setTempSurname(user.Apellidos);
            }
          } catch (error) {
            if (error.response) {
              // El backend respondió con error, pero no es un fallo de red
              setErrorMsgSurname(error.response.data); // ← Aquí viene el mensaje del backend
              setTempSurname(user.Apellidos);
              setTimeout(() => setErrorMsgSurname(""), 5000);
            } else {
              setErrorMsgSurname("Error de red o del servidor.");
              setTempSurname(user.Apellidos);
              setTimeout(() => setErrorMsgSurname(""), 5000);
            }
            setSuccessMsgSurname("");
          }
        } else {
          setTempSurname(user.Apellidos);
        }
        setIsEditingSurname(!isEditingSurname);
        break;
      case "email":
        if (isEditingEmail) {
          try {
            const result = await editEmail(user.Id, tempEmail); // leer el texto devuelto por el servidor

            if (result.status === 200) {
              setSuccessMsgEmail(result.data.res);
              setErrorMsgEmail("");
              setTimeout(() => setSuccessMsgEmail(""), 5000);
              // Aquí podrías actualizar el estado global/user si lo necesitas
              dispatch(
                editUserField({ field: "Correo", value: result.data.Correo })
              );
            } else {
              setErrorMsgEmail(result.data.res); // ← aquí se guarda el error
              setSuccessMsgEmail(""); //Mensaje de success vacio
              setTimeout(() => setErrorMsgEmail(""), 5000);
              setTempEmail(user.Correo);
            }
          } catch (error) {
            if (error.response) {
              // El backend respondió con error, pero no es un fallo de red
              setErrorMsgEmail(error.response.data); // ← Aquí viene el mensaje del backend
              setTempEmail(user.Correo);
              setTimeout(() => setErrorMsgEmail(""), 5000);
            } else {
              setErrorMsgEmail("Error de red o del servidor.");
              setTempEmail(user.Correo);
              setTimeout(() => setErrorMsgEmail(""), 5000);
            }
            setSuccessMsgEmail("");
          }
        } else {
          setTempEmail(user.Correo);
        }
        setIsEditingEmail(!isEditingEmail);
        break;
      default:
        break;
    }
  };

  const handleCancelEdit = (field) => {
    switch (field) {
      case "username":
        setTempUsername(user.Usuario);
        setIsEditingUsername(false);
        break;
      case "name":
        setTempName(user.Nombre);
        setIsEditingName(false);
        break;
      case "surname":
        setTempSurname(user.Apellidos);
        setIsEditingSurname(false);
        break;
      case "email":
        setTempEmail(user.Correo);
        setIsEditingEmail(false);
        break;
      default:
        break;
    }
  };

  const handleDeleteAccountClick = async () => {
    setModalDeleteAccountOpen(!modalDeleteAccountOpen);
  };

  const handleSavedEbookClick = () => {
    setModalSavedEbookOpen(!modalSavedEbookOpen);
  };

  const handleUploadedEbookClick = () => {
    setModalUploadedEbookOpen(!modalUploadedEbookOpen);
  };

  return (
    <div className="profile">
      <Header />

      <div className="profile_avatar">
        <img
          src={tempAvatar ? tempAvatar : fotoPerfilDefault}
          className="profile_avatar_img"
          alt="Avatar"
        />
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button className="boton-editar" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ffffff"
              d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"
            />
            <path
              fill="#ffffff"
              d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"
            />
          </svg>
        </button>
      </div>
      {errorMsgAvatar && (
        <div className="error-message-profile">
          <p style={{ color: "red", margin: "7px" }}>{errorMsgAvatar}</p>
        </div>
      )}
      {successMsgAvatar && (
        <div className="success-message-profile">
          <p style={{ color: "green", margin: "7px" }}>{successMsgAvatar}</p>
        </div>
      )}
      <div className="profileButtons">
        <button
          onClick={handleSavedEbookClick}
          className="profile-buttonSavedBooks"
        >
          Libros Guardados
        </button>
        <button
          onClick={handleUploadedEbookClick}
          className="profile-buttonSavedBooks"
        >
          Libros subidos
        </button>
      </div>
      <div className="profileData">
        <div className="inputGroup">
          <input
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            disabled={!isEditingUsername}
            className="profileInput"
          />
          <button
            className="editButton"
            name="user"
            onClick={() => handleEditUser("username")}
          >
            {isEditingUsername ? "Guardar" : "Editar"}
          </button>
          {isEditingUsername ? (
            <button
              className="cancelButton"
              onClick={() => handleCancelEdit("username")}
            >
              Cancelar
            </button>
          ) : null}
          {errorMsgUsername && (
            <div className="error-message-profile">
              <p style={{ color: "red", margin: "7px" }}>{errorMsgUsername}</p>
            </div>
          )}
          {successMsgUsername && (
            <div className="success-message-profile">
              <p style={{ color: "green", margin: "7px" }}>
                {successMsgUsername}
              </p>
            </div>
          )}
        </div>
        <div className="inputGroup">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            disabled={!isEditingName}
            className="profileInput"
          />
          <button
            className="editButton"
            name="name"
            onClick={() => handleEditUser("name")}
          >
            {isEditingName ? "Guardar" : "Editar"}
          </button>
          {isEditingName ? (
            <button
              className="cancelButton"
              onClick={() => handleCancelEdit("name")}
            >
              Cancelar
            </button>
          ) : null}
          {errorMsgName && (
            <div className="error-message-profile">
              <p style={{ color: "red", margin: "7px" }}>{errorMsgName}</p>
            </div>
          )}
          {successMsgName && (
            <div className="success-message-profile">
              <p style={{ color: "green", margin: "7px" }}>{successMsgName}</p>
            </div>
          )}
        </div>
        <div className="inputGroup">
          <input
            type="text"
            value={tempSurname}
            onChange={(e) => setTempSurname(e.target.value)}
            disabled={!isEditingSurname}
            className="profileInput"
          />
          <button
            className="editButton"
            name="surname"
            onClick={() => handleEditUser("surname")}
          >
            {isEditingSurname ? "Guardar" : "Editar"}
          </button>
          {isEditingSurname ? (
            <button
              className="cancelButton"
              onClick={() => handleCancelEdit("surname")}
            >
              Cancelar
            </button>
          ) : null}
          {errorMsgSurname && (
            <div className="error-message-profile">
              <p style={{ color: "red", margin: "7px" }}>{errorMsgSurname}</p>
            </div>
          )}
          {successMsgSurname && (
            <div className="success-message-profile">
              <p style={{ color: "green", margin: "7px" }}>
                {successMsgSurname}
              </p>
            </div>
          )}
        </div>
        <div className="inputGroup">
          <input
            type="text"
            name="correo"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
            disabled={!isEditingEmail}
            className="profileInput"
          />
          <button
            className="editButton"
            name="correo"
            onClick={() => handleEditUser("email")}
          >
            {isEditingEmail ? "Guardar" : "Editar"}
          </button>
          {isEditingEmail ? (
            <button
              className="cancelButton"
              onClick={() => handleCancelEdit("email")}
            >
              Cancelar
            </button>
          ) : null}
          {errorMsgEmail && (
            <div className="error-message-profile">
              <p style={{ color: "red", margin: "7px" }}>{errorMsgEmail}</p>
            </div>
          )}
          {successMsgEmail && (
            <div className="success-message-profile">
              <p style={{ color: "green", margin: "7px" }}>{successMsgEmail}</p>
            </div>
          )}
        </div>
      </div>
      <div className="profile_deleteAccount">
        <button
          className="profile_deleteAccountButton"
          onClick={handleDeleteAccountClick}
        >
          <strong>Eliminar mi cuenta</strong>
        </button>
      </div>
      {modalSavedEbookOpen && (
        <ModalSavedBooks user={user} onClose={handleSavedEbookClick} />
      )}
      {modalUploadedEbookOpen && (
        <ModalUploadedBooks
          userId={user.Id}
          onClose={handleUploadedEbookClick}
        />
      )}
      {modalDeleteAccountOpen && (
        <ModalDeleteAccount onClose={handleDeleteAccountClick} />
      )}
    </div>
  );
}

export default Profile;
