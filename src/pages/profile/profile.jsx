import "./styleProfile.css";
import React, { useState } from "react";
import Header from "../../components/global/header/header.jsx";
import { useSelector } from "react-redux";
import ModalSavedBooks from "../../components/modals/modalSavedBooks/modalSavedBooks.jsx";
import ModalUploadedBooks from "../../components/modals/modalUploadedBooks/modalUploadedBooks.jsx";
import ModalDeleteAccount from "../../components/modals/modalDeleteAccount/modalDeleteAccount.jsx";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [modalSavedEbookOpen, setModalSavedEbookOpen] = useState(false);
  const [modalUploadedEbookOpen, setModalUploadedEbookOpen] = useState(false);
  const [modalDeleteAccountOpen, setModalDeleteAccountOpen] = useState(false);

  const handleEditEmail = () => {
          setIsEditingEmail(!isEditingEmail)
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
            value={user.Usuario}
            disabled
            className="profileInput"
          />
          <button className="editButton">{isEditingUser ? 'Guardar' : 'Editar'}</button>
        </div>
        <div className="inputGroup">
          <input
            type="text"
            value={`${user.Nombre} ${user.Apellidos}`}
            disabled
            className="profileInput"
          />
          <button className="editButton">{isEditingName ? 'Guardar' : 'Editar'}</button>
        </div>
        <div className="inputGroup">
          <input
            type="text"
            name="correo"
            value={user.Correo}
            disabled
            className="profileInput"
          />
          <button className="editButton" name="correo" onClick={handleEditEmail}>
            {isEditingEmail ? 'Guardar' : 'Editar'}
          </button>
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
