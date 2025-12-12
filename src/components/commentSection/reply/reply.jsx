import "./reply.css";
import { useState, useEffect } from "react";
import {
  getUserById,
  addLikeReply,
  removeLikeReply,
  getReplyLikes,
} from "../../../api";
import fotoPerfilDefault from "../../../assets/foto_perfil_default.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../../utils/functions/timeAgo";

const Reply = ({ reply, onRequestDeleteReply }) => {
  const user = useSelector((state) => state?.auth?.user?.Id);
  const [userReply, setUserReply] = useState(null);
  const [likesReply, setLikesReply] = useState(0);
  const [userLikeReply, setUserLikeReply] = useState(false);
  const [userAuthor, setUserAuthor] = useState(false);
  const navigate = useNavigate();

  // Al renderizar intenta cargar datos del usuario de la respuesta
  useEffect(() => {
    if (reply.user_id === user) {
      setUserAuthor(true);
    }
    const fetchUser = async () => {
      if (!userReply) {
        try {
          const u = await getUserById(reply.user_id);
          setUserReply(u);
        } catch (err) {
          console.error("Error cargando usuario de la respuesta", err);
        }
      }
    };
    fetchUser();
  }, [reply.user_id, user, userReply]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const infoLikesReply = user
          ? await getReplyLikes(reply.id, user)
          : await getReplyLikes(reply.id);

        setLikesReply(infoLikesReply.likeCount);
        setUserLikeReply(!!infoLikesReply.likedByUser); // convierte a booleano
      } catch (error) {
        console.error("Error al obtener likes del comentario:", error);
      }
    };

    fetchLikes();
  }, [reply.id, user]);

  const handleLikeReply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (!userLikeReply) {
        const result = await addLikeReply({ userId: user, replyId: reply.id });
        setLikesReply(result.numberLikes);
        setUserLikeReply(true);
      } else {
        const result = await removeLikeReply({
          userId: user,
          replyId: reply.id,
        });
        setLikesReply(result.numberLikes);
        setUserLikeReply(false);
      }
    } catch (err) {
      console.error("Error al alternar like de la respuesta:", err);
    }
  };

  const handleDeleteReply = () => {
    if (onRequestDeleteReply) {
      onRequestDeleteReply(reply.id);
    }
  };

  return (
    <div className="reply">
      {userReply ? (
        <>
          <div className="reply-user">
            <img
              src={userReply.avatar_url || fotoPerfilDefault}
              alt="avatar"
              className="reply-avatar"
            />
            <strong>{userReply.usuario}</strong>
          </div>
          <p>{reply.content}</p>
          <div className="reply-footer">
            <small>{timeAgo(reply.created_at)}</small>
            <div className="reply-footer-options">
              <div
              className="reply-like"
              onClick={handleLikeReply}
              title={userLikeReply ? "Ya no me gusta" : "Me gusta"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                {userLikeReply ? (
                  <path
                    fill="#F44336"
                    d="M34 9c-4.2 0-7.9 2.1-10 5.4C21.9 11.1 18.2 9 14 9C7.4 9 2 14.4 2 21c0 11.9 22 24 22 24s22-12 22-24c0-6.6-5.4-12-12-12"
                  />
                ) : (
                  <>
                    <defs>
                      <mask id={`mask-${reply.id}`}>
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
                      mask={`url(#mask-${reply.id})`}
                    />
                  </>
                )}
              </svg>
              {likesReply > 0 && <span>{likesReply}</span>}
            </div>
            {userAuthor && (
              <div onClick={() => handleDeleteReply(reply.id)} title="Eliminar">
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
        </>
      ) : (
        <p>{reply.content}</p>
      )}
    </div>
  );
};

export default Reply;
