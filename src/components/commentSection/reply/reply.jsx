// Reply.jsx
import "./reply.css";
import { useState, useEffect } from "react";
import { getUserById, addLike, removeLike } from "../../../api";
import fotoPerfilDefault from "../../../assets/foto_perfil_default.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Reply = ({ reply, userData, onLoadUser }) => {
  const user = useSelector((state) => state?.auth?.user?.Id);
  const [replyUser, setReplyUser] = useState(userData || null);
  const [likes, setLikes] = useState(reply.likeCount || 0);
  const [liked, setLiked] = useState(reply.likedByUser || false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!replyUser) {
        try {
          const u = await getUserById(reply.user_id);
          setReplyUser(u);
          if (onLoadUser) onLoadUser(reply.id, u);
        } catch (err) {
          console.error("Error cargando usuario del reply", err);
        }
      }
    };
    fetchUser();
  }, [reply.user_id, replyUser, onLoadUser, reply.id]);

  const handleLikeReply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (!liked) {
        const result = await addLike({ userId: user, commentId: reply.id });
        setLikes(result.numberLikes);
        setLiked(true);
      } else {
        const result = await removeLike({ userId: user, commentId: reply.id });
        setLikes(result.numberLikes);
        setLiked(false);
      }
    } catch (err) {
      console.error("Error al alternar like de reply:", err);
    }
  };

  return (
    <div className="reply">
      {replyUser ? (
        <>
          <div className="reply-user">
            <img
              src={replyUser.avatar_url || fotoPerfilDefault}
              alt="avatar"
              className="reply-avatar"
            />
            <strong>{replyUser.usuario}</strong>
          </div>
          <p>{reply.content}</p>
          <div className="reply-footer">
            <div
              className="reply-like"
              onClick={handleLikeReply}
              title={liked ? "Ya no me gusta" : "Me gusta"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                {liked ? (
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
              {likes > 0 && <span>{likes}</span>}
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
