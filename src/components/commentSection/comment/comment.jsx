import "./comment.css";
import {
  getUserById,
  getReplies,
  getReplyCount,
  addLike,
  getLikes,
  removeLike,
} from "../../../api";
import { useEffect, useState } from "react";
import { timeAgo } from "../../../utils/functions/timeAgo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Comment = ({
  id,
  content,
  userId,
  createdAt,
  isAuthenticated,
  setReply,
  replyingTo,
  setReplyingTo,
  forceReloadReplies,
}) => {
  const user = useSelector((state) => state?.auth?.user?.Id);
  const [userComment, setUserComment] = useState(null);
  const [replies, setReplies] = useState([]);
  const [totalReplies, setTotalReplies] = useState(0);
  const [replyUsers, setReplyUsers] = useState({});
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(0);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [likesComment, setLikesComment] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const REPLIES_PER_PAGE = 5;

  const navigate = useNavigate();

  useEffect(() => {
    if (forceReloadReplies) {
      loadReplies(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceReloadReplies]);

  useEffect(() => {
  const fetchLikes = async () => {
    try {
      const infoLikes = user
        ? await getLikes(id, user)
        : await getLikes(id);

      setLikesComment(infoLikes.likeCount);
      setUserLike(!!infoLikes.likedByUser);  // convierte a booleano
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
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUserComment(userData);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

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

      const userMap = {};
      await Promise.all(
        newReplies.map(async (reply) => {
          try {
            const userData = await getUserById(reply.user_id);
            userMap[reply.id] = userData;
          } catch (err) {
            console.error(`Error cargando usuario de reply ${reply.id}`, err);
          }
        })
      );
      setReplyUsers((prev) => ({ ...prev, ...userMap }));
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
    if (!userLike) {
      // El usuario aún no ha dado like → agregar like
      const resultLikes = await addLike({ userId: user, commentId: id });
      setLikesComment(resultLikes.numberLikes);
      setUserLike(true);
    } else {
      // El usuario ya dio like → eliminar like
      const resultLikes = await removeLike({ userId: user, commentId: id });
      setLikesComment(resultLikes.numberLikes);
      setUserLike(false);
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
              src={userComment.avatar_url}
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
                <div  onClick={toggleReply}>
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffffff"
                    d="M12 19h-2v-2H8v-2H6v-2H4v-2h2V9h2V7h2V5h2v4h8v6h-8z"
                  />
                </svg>
                </ div>
              )}
              <div className="comment-footer-likeAndReply-iconLike">
                {!userLike ? (
                  <div onClick={() => handleLikeCommentClick()}>
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
                  <div onClick={() => handleLikeCommentClick()}>
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
            </div>
          </div>
          {showReplies && replies.length > 0 && (
            <div className="comment-replies">
              {replies.map((reply) => {
                const user = replyUsers[reply.id];
                return (
                  <div key={reply.id} className="reply">
                    {user ? (
                      <>
                        <div className="reply-user">
                          <img
                            src={user.avatar_url}
                            alt="avatar"
                            className="reply-avatar"
                          />
                          <strong>{user.usuario}</strong>
                        </div>
                        <p>{reply.content}</p>
                      </>
                    ) : (
                      <p>{reply.content}</p> // fallback si el usuario no se cargó
                    )}
                  </div>
                );
              })}
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
