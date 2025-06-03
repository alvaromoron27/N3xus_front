import "./bookCard.css";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/global/header/header";
import { formatDate } from "../../global/functions/globalFunctions";
import { useState, useEffect } from "react";
import { saveBook, removeSavedBook } from "../../api";
import {
  addSavedBook,
  deleteSavedBookReducer,
} from "../../redux/reducers/authReducer";
import ModalDeleteBook from "../../components/modals/modalDeleteBook/modalDeleteBook";

import ModalAddBook from "../../components/modals/modalAddBook/modalAddBook";

function BookCard() {
  const dispatch = useDispatch();
  const bookSelected = useSelector((state) => state.book.selectedBook);
  const userId = useSelector((state) => state.auth.user?.Id);
  const [pulsedSaveEbook, setPulsedSaveEbook] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const savedEbooks = useSelector(
    (state) => state.auth.user?.LibrosGuardados || []
  );
  const [uploadedByUser, setUploadedByUser] = useState(false);
  const [modalEditBookOpen, setModalEditBookOpen] = useState(false);
  const [modalDeleteBookOpen, setModalDeleteBookOpen] = useState(false);

  useEffect(() => {
    //Si el usuario logueado ha subido el libro establece uploadedByUser a true
    if (bookSelected.user_id === userId) {
      setUploadedByUser(true);
    }
    // Actualiza el estado si el eBook seleccionado ya está guardado
    if (savedEbooks.some((book) => book?.id === bookSelected.id)) {
      setPulsedSaveEbook(true);
    } else {
      setPulsedSaveEbook(false);
    }
  }, [bookSelected, savedEbooks, uploadedByUser, userId]);

  const handleSaveEbook = async () => {
    if (!pulsedSaveEbook) {
      try {
        // Llama a la función saveEbook y espera su resolución
        const result = await saveBook(userId, bookSelected.id);

        if (result.success) {
          // Actualiza el estado si la operación es exitosa
          setPulsedSaveEbook(true);
          dispatch(addSavedBook(bookSelected));
        }
      } catch (error) {}
    } else {
      // Si ya está guardado, llamamos a removeEbook para eliminarlo
      try {
        const result = await removeSavedBook(userId, bookSelected.id);

        if (result.success) {
          setPulsedSaveEbook(false);
          dispatch(deleteSavedBookReducer(bookSelected));
          // Actualizar la lista de libros guardados en Redux si es necesario
        }
      } catch (error) {}
    }
  };

  function handleDeleteBookClick() {
    setModalDeleteBookOpen(!modalDeleteBookOpen);
  };

  function handleEditBookClick() {
    setModalEditBookOpen(!modalEditBookOpen);
  };

  return (
    <div className="container-EbookCard">
      <Header />
      <div className="ebookCard">
        <div className="ebookCard-portAndButtons">
          <img
            src={bookSelected.portada}
            alt=""
            className="ebook-card-data-front-ebook"
          />
          {isAuthenticated && (
            <>
              {pulsedSaveEbook ? (
                <button
                  className="ebookCard-saveEbook"
                  onClick={handleSaveEbook}
                >
                  Eliminar de guardados{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                    width="22"
                    height="22"
                  >
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" />
                  </svg>
                </button>
              ) : (
                <button
                  className="ebookCard-saveEbook"
                  onClick={handleSaveEbook}
                >
                  Guardar libro{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    width="22"
                    height="22"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
        <div className="ebookCard-right">
          <div className="ebookCard-data">
            <p>{bookSelected.titulo}</p>
            <p>{bookSelected.descripcion}</p>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#7b6500"
                  d="M496.938 14.063c-95.14 3.496-172.297 24.08-231.282 55.812l-29.47 49.28l-4.967-28.093c-10.535 7.402-20.314 15.222-29.314 23.407l-14.687 45.06l-5.032-25.155c-40.65 45.507-60.41 99.864-58.938 155.906c47.273-93.667 132.404-172.727 211.97-221.155l9.717 15.97c-75.312 45.838-156.387 121.202-202.187 208.25h12.156c19.78-12.02 39.16-26.858 58.406-43.44l-30.28 1.595l54.218-23.094c46.875-43.637 93.465-94.974 143.313-138.28l-24.47-5.19l56.5-21.03c26.853-20.485 54.8-37.844 84.344-49.843zM59.53 312.03v30.408H194V312.03zm20.376 49.095L47.25 389.813L24.97 474.78l14.53 15.876h177.22l14.56-15.875L209 389.814l-30.906-28.688H79.906z"
                />
              </svg>
              {bookSelected.autor}
            </p>
            <p>Nº páginas: {bookSelected.numero_paginas}</p>
            <p
              className={`ebook-category ${
                bookSelected.categoria ? bookSelected.categoria : ""
              }`}
            >
              {bookSelected.categoria}
            </p>
            <p>Isbn: {bookSelected.isbn ? bookSelected.isbn : "No tiene"}</p>
            <p>
              Publicación original:{" "}
              {formatDate(bookSelected.publicacion_original)}
            </p>
            <p>Última modificación: {formatDate(bookSelected.created_at)}</p>
          </div>
          {uploadedByUser && (
            <div className="ebookCard-editAndDelete">
              <div className="ebookCard-deleteBook">
                <button
                  className="button-editBook"
                  onClick={handleEditBookClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="rgb(15, 54, 138)"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    >
                      <path
                        strokeDasharray="20"
                        strokeDashoffset="20"
                        d="M3 21h18"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="0.2s"
                          values="20;0"
                        />
                      </path>
                      <path
                        strokeDasharray="48"
                        strokeDashoffset="48"
                        d="M7 17v-4l10 -10l4 4l-10 10h-4"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.2s"
                          dur="0.6s"
                          values="48;0"
                        />
                      </path>
                      <path
                        strokeDasharray="8"
                        strokeDashoffset="8"
                        d="M14 6l4 4"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.8s"
                          dur="0.2s"
                          values="8;0"
                        />
                      </path>
                    </g>
                  </svg>
                  Editar libro
                </button>
              </div>
              <div className="ebookCard-deleteBook">
                <button
                  className="button-deleteBook"
                  onClick={handleDeleteBookClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="red"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    >
                      <path
                        strokeDasharray="20"
                        strokeDashoffset="20"
                        d="M3 21h18"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="0.2s"
                          values="20;0"
                        />
                      </path>
                      <path
                        strokeDasharray="48"
                        strokeDashoffset="48"
                        d="M7 17v-4l10 -10l4 4l-10 10h-4"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.2s"
                          dur="0.6s"
                          values="48;0"
                        />
                      </path>
                      <path
                        strokeDasharray="8"
                        strokeDashoffset="8"
                        d="M14 6l4 4"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.8s"
                          dur="0.2s"
                          values="8;0"
                        />
                      </path>
                    </g>
                  </svg>
                  Eliminar libro
                </button>
              </div>
            </div>
          )}
        </div>
        {modalEditBookOpen && (
          <ModalAddBook
            titulo="Editar Libro"
            bookData={bookSelected}
            onClose={handleEditBookClick}
            field= "Editar"
            book_id={bookSelected.id}
          />
        )}
        {modalDeleteBookOpen && (
          <ModalDeleteBook
            bookId={bookSelected.id}
            userId={userId}
            onClose={handleDeleteBookClick}
          />
        )}
      </div>
    </div>
  );
}

export default BookCard;
