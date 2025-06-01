import "./styleProfile.css";
import React, { useState } from "react";
import Header from "../../components/global/header/header.jsx";
import { useSelector } from "react-redux";
import ModalSavedBooks from "../../components/modals/modalSavedBooks/modalSavedBooks.jsx";
import ModalUploadedBooks from "../../components/modals/modalUploadedBooks/modalUploadedBooks.jsx";
import ModalDeleteAccount from "../../components/modals/modalDeleteAccount/modalDeleteAccount.jsx";
import { editUsername } from "../../api.js";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [tempUser, setTempUser] = useState(user.Usuario);
  const [tempName, setTempName] = useState(`${user.Nombre} ${user.Apellidos}`);
  const [tempEmail, setTempEmail] = useState(user.Correo);

  const [modalSavedEbookOpen, setModalSavedEbookOpen] = useState(false);
  const [modalUploadedEbookOpen, setModalUploadedEbookOpen] = useState(false);
  const [modalDeleteAccountOpen, setModalDeleteAccountOpen] = useState(false);

  const handleEditUser = async (field) => {
    switch (field) {
      case "username":
        if (isEditingUser) {
          // Guardar cambios
          const result = await editUsername(user.Id, tempUser);

          if (result.status === 200) {
            // Actualiza el estado si la operación es exitosa
            console.log("Nombre de usuario editado con exito!")
          }
        } else {
          // Entrando en edición, sincronizamos el temp con valor actual
          setTempUser(user.Usuario);
        }
        setIsEditingUser(!isEditingUser);
        break;
      case "name":
        if (isEditingName) {
          // Guardar cambios: dividir nombre y apellidos
          const [Nombre, ...Apellidos] = tempName.trim().split(" ");
          // Actualizar estado o redux
          console.log("Guardando Nombre:", Nombre, Apellidos.join(" "));
        } else {
          setTempName(`${user.Nombre} ${user.Apellidos}`);
        }
        setIsEditingName(!isEditingName);
        break;
      case "email":
        if (isEditingEmail) {
          // Guardar cambios
          console.log("Guardando Email:", tempEmail);
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
        setTempUser(user.Usuario);
        setIsEditingUser(false);
        break;
      case "name":
        setTempName(`${user.Nombre} ${user.Apellidos}`);
        setIsEditingName(false);
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
      <h1>Perfil</h1>
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
            value={tempUser}
            onChange={(e) => setTempUser(e.target.value)}
            disabled={!isEditingUser}
            className="profileInput"
          />
          <button
            className="editButton"
            name="user"
            onClick={() => handleEditUser("username")}
          >
            {isEditingUser ? "Guardar" : "Editar"}
          </button>
          {isEditingUser ? (
            <button
              className="cancelButton"
              onClick={() => handleCancelEdit("username")}
            >
              Cancelar
            </button>
          ) : null}
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
