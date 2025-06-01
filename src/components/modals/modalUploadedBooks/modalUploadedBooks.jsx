import "./modalUploadedBooks.css";
import { getBooksByUser } from "../../../api";
import React, { useEffect, useState } from "react";
import MiniCardBook from "../../global/miniCardBook/miniCardBook";

function ModalUploadedBooks(props) {
  const [uploadedBooks, setUploadedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const result = await getBooksByUser(props.userId);
        setUploadedBooks(result.books);
      } catch (err) {

      }
    };
    fetchBooks();
  }, [props.userId]);

  return (
    <div className="modal-overlay">
      <div className="modal-contentUploadedEbooks">
        <h2>Tus Libros subidos</h2>
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
        {uploadedBooks.length > 0 ? (
          <div className="ebooks-modalUploadedEbooks">
            {uploadedBooks.map((ebook) => (
              <MiniCardBook key={ebook.id} ebook={ebook} />
            ))}
          </div>
        ) : (
          <p>No tienes libros subidos.</p>
        )}
      </div>
    </div>
  );
}

export default ModalUploadedBooks;
