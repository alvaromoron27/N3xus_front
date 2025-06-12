import "./modalAddBook.css";
import { useState, useEffect } from "react";
import { addBook, editBook } from "../../../api.js";
import { useDispatch, useSelector } from "react-redux";
import { editBookReducer } from "../../../redux/reducers/bookReducer.js";

const ModalAddBook = ({
  onClose,
  titulo = "Añadir Libro",
  bookData = null,
  book_id = null,
  field = "añadir",
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.Id);

  const [formData, setFormData] = useState({
    portada: "",
    titulo: "",
    descripcion: "",
    autor: "",
    categoria: "",
    numero_paginas: "",
    publicacion_original: "",
    created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    user_id: userId,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (bookData) {
      setFormData({
        ...bookData,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        user_id: userId, // aseguramos consistencia
      });
    }
  }, [bookData, userId]);

  // Cambia handleChange para detectar input file
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  // Función para convertir la fecha a formato MySQL DATETIME
  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // Por si la fecha es inválida o vacía
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0") +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creamos FormData para enviar archivo + demás campos
    const data = new FormData();

    data.append("portada", formData.portada);
    data.append("titulo", formData.titulo);
    data.append("descripcion", formData.descripcion);
    data.append("autor", formData.autor);
    data.append("categoria", formData.categoria);
    data.append("numero_paginas", formData.numero_paginas);
    data.append(
      "publicacion_original",
      formatDateForMySQL(formData.publicacion_original)
    );
    data.append("user_id", formData.user_id);

    if (field === "Editar") {
      try {
        const response = await editBook(data, book_id);
        const { message, updatedBook } = response;
        dispatch(editBookReducer(updatedBook));
        setSuccessMessage(message);

        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (error) {
          setErrorMessage(
            error.message === "Network Error" ? "Error de red" : ""
          );
      }
    } else {
      try {
        await addBook(data);
        onClose();
      } catch (error) {
        if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className="modal-overlay-addEbook">
      <div className="modal-content-addEbook">
        <h2>{titulo}</h2>
        <form className="modal-content-addEbook-form" onSubmit={handleSubmit}>
          <div className="modal-content-addEbook-form-group">
            <label className={field !== "Editar" ? "required-label" : ""} htmlFor="portada">
              Portada
            </label>
            <input
              type="file"
              id="portada"
              accept="image/*"
              className="modal-content-addEbook-form-group-button-selectImage"
              onChange={handleChange}
              required={field !== "Editar"}
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="titulo">
              Título
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Introduce aquí el título del libro"
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
              value={formData.autor}
              onChange={handleChange}
              placeholder="Introduce aquí el nombre del autor"
              required
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="descripcion">
              Descripción o Sinopsis
            </label>
            <textarea
              placeholder="Introduce aquí una descripción o sinopsis del libro"
              id="descripcion"
              cols="40"
              rows="7"
              value={formData.descripcion}
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
              value={formData.numero_paginas}
              onChange={handleChange}
              required
              min="1"
              max="150000"
            />
          </div>

          <div className="modal-content-addEbook-form-group">
            <label className="required-label" htmlFor="publicacion_original">
              Publicación Original:
            </label>
            <input
              type="date"
              id="publicacion_original"
              value={formData.publicacion_original?.slice(0, 10)}
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
              value={formData.categoria}
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

          {successMessage && (
            <div className="addBook-message success-message">{successMessage}</div>
          )}
          {errorMessage && <div className="addBook-message error-message">{errorMessage}</div>}

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
