import "./modalAddEbook.css";
import { useState } from "react";
import { addEbook } from '../../../api.js';

const ModalAddEbook = ({ onClose }) => {
  const [ebookData, setEbookData] = useState({
    titulo: '',
    descripcion: '',
    edad_minima: '',
    edad_maxima: '',
    autor: '',
    isbn: '',
    categoria: '',
    idioma: '',
    numero_paginas: '',
    formato: '',
    portada: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setEbookData({
      ...ebookData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addEbook(ebookData);
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      if(error.response.data.message){
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="modal-overlay-addEbook">
      <div className="modal-content-addEbook">
        <h2>Añadir Ebook</h2>
        <form className="modal-content-addEbook-form" onSubmit={handleSubmit}>
          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="titulo">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              value={ebookData.titulo}
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
              value={ebookData.autor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              placeholder="Introduce aquí una descripción del ebook"
              id="descripcion"
              cols="40"
              rows="7"
              value={ebookData.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="edad-min">
              Edad Mínima
            </label>
            <input
              type="number"
              id="edad_minima"
              min="0"
              max="100"
              value={ebookData.edad_minima}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="edad-max">
              Edad Máxima
            </label>
            <input
              type="number"
              id="edad_maxima"
              min="0"
              max="100"
              value={ebookData.edad_maxima}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label htmlFor="isbn">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              value={ebookData.isbn}
              onChange={handleChange}
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="num-pags">
              Nº Páginas
            </label>
            <input
              type="number"
              id="numero_paginas"
              value={ebookData.numero_paginas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="categoria">
              Categoría
            </label>
            <select
              id="categoria"
              value={ebookData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Ciencia">Ciencia</option>
              <option value="Arte">Arte</option>
              <option value="Deporte">Deporte</option>
              <option value="Mitología">Mitología</option>
            </select>
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="idioma">
              Idioma
            </label>
            <select
              id="idioma"
              value={ebookData.idioma}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un idioma</option>
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Alemán">Alemán</option>
              <option value="Italiano">Italiano</option>
            </select>
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="formato">
              Formato
            </label>
            <select
              id="formato"
              value={ebookData.formato}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un formato</option>
              <option value="PDF">PDF</option>
              <option value="EPUB">EPUB</option>
              <option value="MOBI">MOBI</option>
              <option value="AZW">AZW</option>
            </select>
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="portada">
              Portada
            </label>
            <input
              type="text"
              id="portada"
              value={ebookData.portada}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Guardar</button>
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

export default ModalAddEbook;
