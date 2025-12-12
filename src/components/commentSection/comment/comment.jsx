import "./comment.css";
import {
  getUserById,
  getReplies,
  getReplyCount,
  addLikeComment,
  getCommentLikes,
  removeLikeComment,
} from "../../../api";
import { useEffect, useState, useCallback } from "react";
import { timeAgo } from "../../../utils/functions/timeAgo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fotoPerfilDefault from "../../../assets/foto_perfil_default.png";
import Reply from "../reply/reply";

const Comment = ({
  id,
  content,
  userId,
  createdAt,
  isAuthenticated,
  setReply,
  replyingTo,
  setReplyingTo,
  onRequestDelete,
  onRequestDeleteReply,
  replies: initialReplies = [],
  onRegisterReplyCallback,
  onRegisterDeleteReplyCallback,
}) => {
  const user = useSelector((state) => state?.auth?.user?.Id);
  const [userComment, setUserComment] = useState(null);
  const [replies, setReplies] = useState(initialReplies);
  const [totalReplies, setTotalReplies] = useState(0);
  const [replyUsers] = useState({});
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(0);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [likesComment, setLikesComment] = useState(0);
  const [userLikeComment, setUserLikeComment] = useState(false);
  const [userAuthor, setUserAuthor] = useState(false);
  const REPLIES_PER_PAGE = 5;
  const navigate = useNavigate();

  const addLocalReply = useCallback(
  (reply) => {
    setReplies((prev) => [reply, ...prev]);
    setTotalReplies((t) => t + 1);
    setShowReplies(true);
  },
  []
);

  const deleteLocalReply = useCallback(
  (replyId) => {
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
    setTotalReplies((t) => t - 1);
  },
  []
);

  // Registra el callback cuando el componente monta
  useEffect(() => {
    if (onRegisterReplyCallback) {
      onRegisterReplyCallback(addLocalReply);
    }
  }, [onRegisterReplyCallback, addLocalReply]);

  useEffect(() => {
  if (onRegisterDeleteReplyCallback) {
    onRegisterDeleteReplyCallback(deleteLocalReply);
  }
}, [onRegisterDeleteReplyCallback, deleteLocalReply]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const infoLikesComment = user
          ? await getCommentLikes(id, user)
          : await getCommentLikes(id);

        setLikesComment(infoLikesComment.likeCount);
        setUserLikeComment(!!infoLikesComment.likedByUser); // convierte a booleano
      } catch (error) {
        console.error("Error al obtener likes del comentario:", error);
      }
    };

    fetchLikes();
  }, [id, user]);

  useEffect(() => {
    const fetchReplyCount = async () => {
      try {
        const total = await getReplyCount(id);
        setTotalReplies(total);
      } catch (error) {
        console.error("Error obteniendo total de respuestas", error);
      }
    };

    fetchReplyCount();
  }, [id]);


  useEffect(() => {
    if (userId === user) {
      setUserAuthor(true);
    }
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUserComment(userData);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (userId) fetchUser();
  }, [user, userId]);

  const isReplying = replyingTo === id;

  const toggleReply = () => {
    if (isReplying) {
      setReply(null);
      setReplyingTo(null);
    } else {
      setReply(userComment.usuario);
      setReplyingTo(id);
    }
  };


  // Función para cargar respuestas cuando se hace click en "Respuestas"
  const handleToggleReplies = () => {
    if (showReplies) {
      setShowReplies(false);
    } else {
      setShowReplies(true);
      if (replies.length === 0) {
        loadReplies(); // carga inicial
      }
    }
  };

  const loadReplies = async (pageToLoad = 0) => {
    if (loadingReplies || !hasMoreReplies) return;
    setLoadingReplies(true);
    try {
      const {
        replies: newReplies,
        total,
        hasMore,
      } = await getReplies(id, REPLIES_PER_PAGE, pageToLoad * REPLIES_PER_PAGE);
      setReplies((prev) => {
        const prevIds = new Set(prev.map((r) => r.id));
        const filtered = newReplies.filter((r) => !prevIds.has(r.id));
        return [...prev, ...filtered];
      });
      setTotalReplies(total);
      setHasMoreReplies(hasMore);
      setRepliesPage(pageToLoad + 1);
    } catch (error) {
      console.error("Error al cargar respuestas:", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleLikeCommentClick = async () => {
    if (!user) {
      // Usuario no autenticado → redirigir a login
      navigate("/login");
      return;
    }

    try {
      if (!userLikeComment) {
        // El usuario aún no ha dado like → agregar like
        const resultLikes = await addLikeComment({
          userId: user,
          commentId: id,
        });
        setLikesComment(resultLikes.numberLikes);
        setUserLikeComment(true);
      } else {
        // El usuario ya dio like → eliminar like
        const resultLikes = await removeLikeComment({
          userId: user,
          commentId: id,
        });
        setLikesComment(resultLikes.numberLikes);
        setUserLikeComment(false);
      }
    } catch (error) {
      console.error("Error al alternar el like:", error);
    }
  };

  return (
    <div className="comment">
      {userComment ? (
        <>
          <div className="comment-user">
            <img
              src={
                userComment.avatar_url
                  ? userComment.avatar_url
                  : fotoPerfilDefault
              }
              alt=""
              className="comment-image"
            />
            <strong>{userComment.usuario}</strong>
          </div>
          <p>{content}</p>
          <div className="comment-footer">
            <div className="comment-footer-options">
              <small>{timeAgo(createdAt)}</small>
              {totalReplies > 0 ? (
                <div
                  className="comment-footer-replies"
                  style={{ cursor: "pointer" }}
                  onClick={handleToggleReplies}
                >
                  {loadingReplies ? (
                    "Cargando respuestas..."
                  ) : showReplies ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Ocultar respuestas
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#ffffff"
                          d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Ver respuestas • {totalReplies}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#ffffff"
                          d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              ) : null}
            </div>
            <div className="comment-footer-likeAndReply">
              {isAuthenticated && (
                <div onClick={toggleReply} title="Responder">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M185.2 128.6V19.7L0 204.9l185.2 185.2v-109c152.5 0 250.5 0 326.8 217.9c0-108.9 10.9-370.4-326.8-370.4"
                    />
                  </svg>
                </div>
              )}
              <div className="comment-footer-likeAndReply-iconLike">
                {!userLikeComment ? (
                  <div
                    onClick={() => handleLikeCommentClick()}
                    title="Me gusta"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <defs>
                        <mask id="IconifyId197875687cfcdf2ad1">
                          <path
                            fill="#555"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                            d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"
                          />
                        </mask>
                      </defs>
                      <path
                        fill="#ffffff"
                        d="M0 0h48v48H0z"
                        mask="url(#IconifyId197875687cfcdf2ad1)"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    onClick={() => handleLikeCommentClick()}
                    title="Ya no me gusta"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#F44336"
                        d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12"
                      />
                    </svg>
                  </div>
                )}
                <div>{likesComment > 0 ? likesComment : null}</div>
              </div>
              {userAuthor && (
                <div onClick={() => onRequestDelete(id)} title="Eliminar">
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
                </div>
              )}
            </div>
          </div>
          {showReplies && replies.length > 0 && (
            <div className="comment-replies">
              {replies.map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  userData={replyUsers[reply.id]}
                  onRequestDeleteReply={(replyId) =>
                    onRequestDeleteReply && onRequestDeleteReply(id, replyId)
                  }
                />
              ))}

              <div className="comment-replies-button">
                {hasMoreReplies && !loadingReplies && (
                  <button
                    className="comment-replies-button-more"
                    onClick={() => loadReplies(repliesPage)}
                  >
                    Cargar más respuestas
                  </button>
                )}
                {loadingReplies && <p>Cargando respuestas...</p>}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
};

export default Comment;
