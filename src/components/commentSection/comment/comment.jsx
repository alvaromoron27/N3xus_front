import "./comment.css";
import { getUserById } from "../../../api";
import { useEffect, useState } from "react";
import { timeAgo } from "../../../utils/functions/timeAgo";


const Comment = ({ content, userId, createdAt, isAuthenticated }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  return (
    <div className="comment">
      {user ? (
        <>
          <div className="comment-user">
            <img src={user.avatar_url} alt="" className="comment-image" />
            <strong>{user.usuario}</strong>
          </div>
          <p>{content}</p>
          <div className="comment-footer">
            <small>{timeAgo(createdAt)}</small>
            <div className="comment-footer-replies">Respuestas {}</div>
            {isAuthenticated ? <button>Responder</button> : null}
          </div>
        </>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
};

export default Comment;
