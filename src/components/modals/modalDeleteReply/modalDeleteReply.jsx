import "./modalDeleteReply.css";
import { useState } from "react";
import { deleteReply } from "../../../api";

function ModalDeleteReply({ replyId, onDelete, onClose }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteReplyClick = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
  try {
    await deleteReply(replyId);
    onDelete(replyId);
    setSuccess("Respuesta eliminada correctamente");
    setTimeout(() => {
      onClose(); // ✅ cierra el modal tras 0.8s
    }, 800);
  } catch (error) {
    console.error("Error al eliminar la respuesta:", error);
    setError("No se pudo eliminar la respuesta");
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-contentDeleteReply">
        ¿Seguro que deseas eliminar la respuesta?
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
        <div className="modalDeleteReply-buttons">
          <button
            className="modalDeleteReply-delete"
            onClick={handleDeleteReplyClick}
            style={{ color: "white" }}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            className="modalDeleteReply-cancel"
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

export default ModalDeleteReply;
