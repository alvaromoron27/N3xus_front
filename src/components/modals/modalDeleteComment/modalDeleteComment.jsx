import "./modalDeleteComment.css";
import { useState } from "react";
import { deleteComment } from "../../../api";

function ModalDeleteComment({ commentId, onDelete, onClose }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteCommentClick = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
  try {
    await deleteComment(commentId);
    onDelete(commentId); // ✅ notifica al padre (BookCard)
    setSuccess("Comentario eliminado correctamente");
    setTimeout(() => {
      onClose(); // ✅ cierra el modal tras 0.8s
    }, 800);
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    setError("No se pudo eliminar el comentario");
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-contentDeleteComment">
        ¿Seguro que deseas eliminar el comentario?
        {error && (
          <p className="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {success && (
          <p className="success" style={{ color: "green" }}>
            {success}
          </p>
        )}
        <div className="modalDeleteComment-buttons">
          <button
            className="modalDeleteComment-delete"
            onClick={handleDeleteCommentClick}
            style={{ color: "white" }}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            className="modalDeleteComment-cancel"
            onClick={() => {
              // si está en proceso, no permitimos cerrar para evitar estados inconsistentes
              if (loading) return;
              if (typeof onClose === "function") onClose();
            }}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeleteComment;
