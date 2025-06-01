import "./modalSavedBooks.css";
import MiniCardBook from "../../global/miniCardBook/miniCardBook";
import { useSelector } from "react-redux";

function ModalSavedBooks(props) {
  const savedEbooks = useSelector((state) => state.auth.user?.LibrosGuardados || []);

  return (
    <div className="modal-overlay">
      <div className="modal-contentSavedEbooks">
        <h2>Tus Libros guardados</h2>
        <button className="modal-close" onClick={props.onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 21 21"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.5 15.5l-10-10zm0-10l-10 10"
            />
          </svg>
        </button>
          
          {savedEbooks.length > 0 ? (
            <div className="ebooks-modalSavedEbooks">
              {savedEbooks.map((ebook) => (
                <MiniCardBook key={ebook.id} ebook={ebook} />
              ))}
            </div>
          ) : (
            <p>No tienes libros guardados.</p>
          )}
      </div>
    </div>
  );
}

export default ModalSavedBooks;
