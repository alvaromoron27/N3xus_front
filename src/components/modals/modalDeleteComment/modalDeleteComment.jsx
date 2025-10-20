import "./modalDeleteComment.css";
import { useState } from "react";
import { deleteComment } from "../../../api";

function ModalDeleteComment(Id, onDelete, onClose) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDeleteCommentClick = async () => {
    try {
      await deleteComment(Id);
      onDelete(Id);
      setSuccess("Comentario eliminado");
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      setError("Error al eliminar el comentario");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contentDeleteComment">
        ¿Seguro que deseas eliminar el libro?
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
          >
            Eliminar
          </button>
          <button className="modalDeleteComment-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeleteComment;
