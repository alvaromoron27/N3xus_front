import "./comment.css";
import { getUserById, getReplies, getReplyCount } from "../../../api";
import { useEffect, useState } from "react";
import { timeAgo } from "../../../utils/functions/timeAgo";

const Comment = ({
  id,
  content,
  userId,
  createdAt,
  isAuthenticated,
  setReply,
  replyingTo,
  setReplyingTo,
  forceReloadReplies
}) => {
  const [userComment, setUserComment] = useState(null);
  const [replies, setReplies] = useState([]);
  const [totalReplies, setTotalReplies] = useState(0);
  const [replyUsers, setReplyUsers] = useState({});
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(0);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const REPLIES_PER_PAGE = 5;

  useEffect(() => {
  if (forceReloadReplies) {
    loadReplies(0);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [forceReloadReplies]);


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
      const { replies: newReplies, total, hasMore, } = await getReplies(
        id,
        REPLIES_PER_PAGE,
        pageToLoad * REPLIES_PER_PAGE
      );
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
              {totalReplies > 0 ? 
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
              : null}
            </div>
            <div className="comment-footer-likeAndReply" onClick={toggleReply}>
              {isAuthenticated && (
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
              )}
              <div className="comment-footer-likeAndReply-iconLike">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="none"
                    stroke="#e11d48"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.63 7.15a10.12 10.12 0 0 0-7.86 16.51h0L24 42.71l16.07-18.86l.08-.09l.08-.1h0A10.13 10.13 0 1 0 24 11.58a10.1 10.1 0 0 0-8.36-4.43Z"
                  />
                </svg>
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
