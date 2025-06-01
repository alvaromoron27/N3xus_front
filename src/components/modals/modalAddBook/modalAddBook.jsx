import "./modalAddBook.css";
import { useState } from "react";
import { addBook } from "../../../api.js";
import { useSelector } from "react-redux";

const ModalAddBook = ({ onClose }) => {

  const userId = useSelector((state) => state.auth.user.Id);

  const [bookData, setBookData] = useState({
    portada: "",
    titulo: "",
    descripcion: "",
    autor: "",
    categoria: "",
    numero_paginas: "",
    publicacion_original: "",
    user_id: userId
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addBook(bookData);
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      if (error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="modal-overlay-addEbook">
      <div className="modal-content-addEbook">
        <h2>Añadir Libro</h2>
        <form className="modal-content-addEbook-form" onSubmit={handleSubmit}>
          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="portada">
              Portada
            </label>
            <input
              type="text"
              id="portada"
              value={bookData.portada}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="titulo">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              value={bookData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="autor">
              Autor
            </label>
            <input
              type="text"
              id="autor"
              value={bookData.autor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="descripcion">
              Descripción o Sinopsis
            </label>
            <textarea
              placeholder="Introduce aquí una descripción o sinopsis del ebook"
              id="descripcion"
              cols="40"
              rows="7"
              value={bookData.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="numero_paginas">
              Nº Páginas
            </label>
            <input
              type="number"
              id="numero_paginas"
              value={bookData.numero_paginas}
              onChange={handleChange}
              required
              min='1'
              max='5000'
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="publicacion_original">
              Publicación Original:
            </label>
            <input
              type="date"
              id="publicacion_original"
              value={bookData.publicacion_original}
              onChange={handleChange}
              required
            />
          </div>
          <br />

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="categoria">
              Categoría
            </label>
            <select
              id="categoria"
              value={bookData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Educación">Educación</option>
              <option value="Ciencia">Ciencia</option>
              <option value="Arte">Arte</option>
              <option value="Fantasía">Fantasía</option>
              <option value="Deporte">Deporte</option>
              <option value="Mitología">Mitología</option>
              <option value="Autoayuda">Autoayuda</option>
            </select>
          </div>

          {errorMessage}

          <div className="modal-content-addEbook-save">
            <button type="submit" className="modal-content-addEbook-buttonSave">
              Guardar
            </button>
          </div>
        </form>

        <button onClick={onClose} className="close-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 21 21"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.5 15.5l-10-10zm0-10l-10 10"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModalAddBook;
