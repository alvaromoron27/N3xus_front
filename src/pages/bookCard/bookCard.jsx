import "./bookCard.css";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Header from "../../components/global/header/header";
import { formatDate } from "../../global/functions/globalFunctions";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  saveBook,
  removeSavedBook,
  writeComment,
  getComments,
  writeReply,
} from "../../api";
import {
  addSavedBook,
  deleteSavedBookReducer,
} from "../../redux/reducers/authReducer";
import { addCommentToSelectedBook } from "../../redux/reducers/bookReducer.js";
import ModalDeleteBook from "../../components/modals/modalDeleteBook/modalDeleteBook";
import ModalAddBook from "../../components/modals/modalAddBook/modalAddBook";
import Comment from "../../components/commentSection/comment/comment.jsx";
import ModalDeleteComment from "../../components/modals/modalDeleteComment/modalDeleteComment.jsx";
import ModalDeleteReply from "../../components/modals/modalDeleteReply/modalDeleteReply.jsx";

function BookCard() {
  const dispatch = useDispatch();
  const bookSelected = useSelector(
    (state) => state.book.selectedBook,
    shallowEqual
  );
  const [comments, setComments] = useState([]);
  const [commentSelected, setCommentSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const COMMENTS_PER_PAGE = 5;
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);
  const replyCallbacks = useRef({});
  const deleteReplyCallbacks = useRef({});
  const userId = useSelector((state) => state.auth.user?.Id);
  const [pulsedSaveEbook, setPulsedSaveEbook] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const savedEbooksFromRedux = useSelector(
    (state) => state.auth.user?.LibrosGuardados
  );

  const savedEbooks = useMemo(
    () => savedEbooksFromRedux || [],
    [savedEbooksFromRedux]
  );
  const [uploadedByUser, setUploadedByUser] = useState(false);
  const [modalEditBookOpen, setModalEditBookOpen] = useState(false);
  const [modalDeleteBookOpen, setModalDeleteBookOpen] = useState(false);
  const [modalDeleteCommentOpen, setModalDeleteCommentOpen] = useState(false);
  const [modalDeleteReplyOpen, setModalDeleteReplyOpen] = useState(false);
  const [replySelected, setReplySelected] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyUser, setReplyUser] = useState(null);
  const [content, setContent] = useState("");
  const maxChars = 1500;
  const savedEbooksIds = useMemo(
    () => savedEbooks.map((b) => b.id).join(","),
    [savedEbooks]
  );
  const isSaved = savedEbooksIds.includes(bookSelected?.id);

  // Actualiza refs cada vez que cambian los estados
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  function registerReplyCallback(commentId, fn) {
    replyCallbacks.current[commentId] = fn;
  };

  function registerDeleteReplyCallback(commentId, fn) {
  deleteReplyCallbacks.current[commentId] = fn;
}

  const loadComments = useCallback(
    async (pageToLoad) => {
      if (loadingRef.current || !hasMoreRef.current) return;
      setLoading(true);
      try {
        const { comments: newComments, hasMore: more } = await getComments(
          bookSelected.id,
          COMMENTS_PER_PAGE,
          pageToLoad * COMMENTS_PER_PAGE
        );

        setComments((prev) => {
          const prevIds = new Set(prev.map((c) => c.id));
          const filteredNewComments = newComments.filter(
            (c) => !prevIds.has(c.id)
          );
          return [...prev, ...filteredNewComments];
        });

        setHasMore(more);
        setPage(pageToLoad + 1);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      } finally {
        setLoading(false);
      }
    },
    [bookSelected?.id]
  );

  useEffect(() => {
    if (
      modalEditBookOpen ||
      modalDeleteBookOpen ||
      modalDeleteCommentOpen ||
      modalDeleteReplyOpen
    ) {
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll"); // aplica al html
    } else {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    };
  }, [
    modalDeleteBookOpen,
    modalDeleteCommentOpen,
    modalEditBookOpen,
    modalDeleteReplyOpen,
  ]);

  useEffect(() => {
    if (bookSelected?.id) {
      setComments([]);
      setPage(0);
      setHasMore(true);
      loadComments(0);
    } else {
      setComments([]);
    }
  }, [bookSelected?.id, loadComments]);

  useEffect(() => {
    if (!bookSelected?.id) {
      setUploadedByUser(false);
      setPulsedSaveEbook(false);
      return;
    }
    setUploadedByUser(bookSelected.user_id === userId);
    setPulsedSaveEbook(isSaved);
  }, [bookSelected?.id, bookSelected?.user_id, userId, isSaved]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadComments(pageRef.current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadComments]);

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
  }

  function handleDeleteCommentClick() {
    setModalDeleteCommentOpen(!modalDeleteCommentOpen);
  }

  function handleDeleteReplyClick() {
    setModalDeleteReplyOpen(!modalDeleteReplyOpen);
  }

  function handleEditBookClick() {
    setModalEditBookOpen((prev) => !prev);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (replyingTo) {
        // Escribir una respuesta
        const { reply } = await writeReply({
          content,
          userId,
          commentId: replyingTo,
        });
        const cb = replyCallbacks.current[replyingTo];
        if (cb) cb(reply);

        setContent("");
        setReplyingTo(null);
        setReplyUser(null);
      } else {
        // Escribir comentario nuevo
        const { comment } = await writeComment({
          content,
          userId,
          bookId: bookSelected.id,
        });
        // Actualiza Redux
        dispatch(addCommentToSelectedBook(comment));
        // Actualiza local para render inmediato
        setComments((prev) => [comment, ...prev]);
      }

      // Limpia el formulario y estados de respuesta
      setContent("");
      setReplyingTo(null);
      setReplyUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  function handleSetReply(userName, commentId) {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyUser(null);
    } else {
      setReplyingTo(commentId);
      setReplyUser(userName);
    }
  }

  const handleCommentDeleted = (deletedId) => {
    setComments((prev) => prev.filter((comment) => comment.id !== deletedId));
  };

  const handleDeleteComment = (commentId) => {
    setCommentSelected(commentId);
    setModalDeleteCommentOpen(true);
  };

  const handleRequestDeleteReply = (commentId, replyId) => {
    setCommentSelected(commentId);
    setReplySelected(replyId);
    setModalDeleteReplyOpen(true);
  };

  const handleReplyDeleted = (deletedReplyId) => {
  // Itera por todos los comentarios para encontrar cuál tiene esa reply
  comments.forEach((comment) => {
    const cb = deleteReplyCallbacks.current[comment.id];
    if (cb) {
      cb(deletedReplyId);
    }
  });
};



  return (
    <div className="container-EbookCard">
      <Header />
      <div className="ebookCard">
        <h3 className="ebookCard-data-title">{bookSelected.titulo}</h3>
        <div className="ebookCard-esquema">
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
                <strong>{bookSelected.autor}</strong>
              </p>
              <p>
                Nº páginas: <strong>{bookSelected.numero_paginas}</strong>
              </p>
              <p
                className={`ebook-category ${
                  bookSelected.categoria ? bookSelected.categoria : ""
                }`}
              >
                {bookSelected.categoria}
              </p>
              <p>
                Publicación original:{" "}
                <strong>{formatDate(bookSelected.publicacion_original)}</strong>
              </p>
              <p>
                Última modificación:{" "}
                <strong>{formatDate(bookSelected.created_at)}</strong>
              </p>
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
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="#ffffff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
                      />
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
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ffffff"
                        d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                      />
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
              field="Editar"
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
          {modalDeleteCommentOpen && (
            <ModalDeleteComment
              commentId={commentSelected}
              onDelete={handleCommentDeleted}
              onClose={handleDeleteCommentClick}
            />
          )}
          {modalDeleteReplyOpen && (
            <ModalDeleteReply
              replyId={replySelected}
              commentId={commentSelected}
              onDelete={handleReplyDeleted}
              onClose={handleDeleteReplyClick}
            />
          )}
        </div>
      </div>
      {isAuthenticated && (
        <div className={`bookCard-write ${replyingTo ? "reply" : "comment"}`}>
          {replyingTo && (
            <div className="bookCard-write-replyTo">
              <p>
                Responder a <strong>{replyUser}</strong>
              </p>
              <div
                className="bookCard-write-replyTo-close"
                onClick={() => handleSetReply(null, replyingTo)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffffff"
                    d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z"
                  />
                </svg>
              </div>
            </div>
          )}
          <form className="bookCard-write-content" onSubmit={handleSubmit}>
            <textarea
              className="bookCard-write-textarea"
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setContent(e.target.value);
                }
              }}
              placeholder={
                replyingTo ? "Escribe tu respuesta..." : "Escribe tu comentario"
              }
            />
            <div>
              {content.length} / {maxChars}
            </div>
            <button disabled={content.trim().length === 0}>Enviar</button>
          </form>
        </div>
      )}

      <div className="comments-section">
        {comments.length === 0 && !loading ? (
          <p>No hay comentarios aún.</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              content={comment.content}
              userId={comment.user_id}
              createdAt={comment.created_at}
              isAuthenticated={isAuthenticated}
              setReply={(userName) => handleSetReply(userName, comment.id)}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replies={comment.replies || []}
              onRequestDelete={handleDeleteComment}
              onRequestDeleteReply={handleRequestDeleteReply}
              onRegisterReplyCallback={(cb) => {
                registerReplyCallback(comment.id, cb); // ← Registrar el callback
              }}
              onRegisterDeleteReplyCallback={(cb) => {
    registerDeleteReplyCallback(comment.id, cb);
  }}
            />
          ))
        )}
        {loading && <p>Cargando más comentarios...</p>}
      </div>
    </div>
  );
}

export default BookCard;
