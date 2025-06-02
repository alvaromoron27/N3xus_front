/* eslint-disable jsx-a11y/anchor-is-valid */
import "./styleHome.css";
import "../../global/styles/globalStyles.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/global/header/header";
import { useSelector } from "react-redux";
import { getAllBooks, getNewsBooks, getBooksByCategory } from "../../api";
import ModalAddBook from "../../components/modals/modalAddBook/modalAddBook";
import MiniCardBook from "../../components/global/miniCardBook/miniCardBook";

function Home() {
  const [ebooks, setEbooks] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [tagSelected, setTagSelected] = useState("news");
  const [selectedCategory, setSelectedCategory] = useState("Categorías");
  const dataUser = useSelector((state) => state.auth);
  const [showModalAddEbook, setShowModalAddEbook] = useState(false);

  // Obtener todos los ebooks al montar el componente
  useEffect(() => {
    const fetchAllEbooks = async () => {
      try {
        const allEbooks = await getAllBooks();
        setEbooks(allEbooks);
      } catch (err) {
        console.error("Error obteniendo todos los ebooks:", err);
      }
    };

    fetchAllEbooks();
    
    //DATOS DEL USUARIO
    console.log(dataUser);
  }, [dataUser]);

  // Actualiza los ebooks filtrados cuando cambia el tagSelected o selectedCategory
  useEffect(() => {
    const fetchFilteredEbooks = async () => {
      try {
        let data = [];
        if (tagSelected === "news") {
          data = await getNewsBooks();
        } else if (tagSelected === "all") {
          data = ebooks;
        } else {
          data = await getBooksByCategory(selectedCategory);
        }
        setFilteredEbooks(data);
      } catch (err) {
        console.error("Error obteniendo ebooks:", err);
      }
    };

    fetchFilteredEbooks();
  }, [selectedCategory, tagSelected, ebooks]);

  // Filtra ebooks cuando cambia la consulta de búsqueda
  useEffect(() => {
    if (query.length > 0) {
      const filtered = ebooks.filter(
        (ebook) =>
          ebook.titulo.toLowerCase().includes(query.toLowerCase()) ||
          ebook.autor.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEbooks(filtered);
    } else {
      // Si no hay query, restablece el filtro según el tag seleccionado
      const updateFilteredEbooks = async () => {
        let data = [];
        if (tagSelected === "news") {
          data = await getNewsBooks();
        } else if (tagSelected === "all") {
          data = ebooks;
        } else {
          data = await getBooksByCategory(selectedCategory);
        }
        setFilteredEbooks(data);
      };

      updateFilteredEbooks();
    }
  }, [query, ebooks, tagSelected, selectedCategory]);

  function handleSelectedTag(tag) {
    if (tag !== tagSelected) {
      setTagSelected(tag);
      setQuery(""); // Limpia la búsqueda al seleccionar un nuevo tag
      setSelectedCategory(
        tag === "news" || tag === "all" ? "Categorías" : selectedCategory
      );
    }
  }

  function handleSelectedCategory(category) {
    setSelectedCategory(category);
    setTagSelected(category); // Cambia el tag a la categoría seleccionada
  }

  return (
    <div className="home">
      <Header />
      <div className="home-head">
        <h1>Libros</h1>
        <div className="input-wrapper">
          <input
            type="text"
            className="right-input"
            placeholder="Busca por Título o Autor"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            className="input-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M10 6.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="home-options">
        <div className="filter-ebooks">
          <div
            className={`filter-ebooks-tag ${
              query === "" && tagSelected === "news"
                ? "filter-ebooks-tag-news"
                : ""
            }`}
            onClick={() => handleSelectedTag("news")}
          >
            Novedades
          </div>
          <div className="dropdown">
            <button
              className={`dropdown-button ${
                query === "" && tagSelected !== "news" && tagSelected !== "all"
                  ? "filter-ebooks-tag-categories"
                  : ""
              }`}
            >
              {selectedCategory}
            </button>
            <div className="dropdown-content">
              <a href="#" onClick={() => handleSelectedCategory("Tecnología")}>
                Tecnología
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Educación")}>
                Educación
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Ciencia")}>
                Ciencia
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Arte")}>
                Arte
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Fantasía")}>
                Fantasía
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Deporte")}>
                Deporte
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Mitología")}>
                Mitología
              </a>
              <a href="#" onClick={() => handleSelectedCategory("Autoayuda")}>
                Autoayuda
              </a>
            </div>
          </div>
          <div
            className={`filter-ebooks-tag ${
              query === "" && tagSelected === "all"
                ? "filter-ebooks-tag-all"
                : ""
            }`}
            onClick={() => handleSelectedTag("all")}
          >
            Todos
          </div>
        </div>
        {dataUser.isAuthenticated ? (
          <button
            className="home-option-addEbook"
            onClick={() => setShowModalAddEbook(true)}
          >
            <svg
              style={{ paddingRight: "5px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6.125 12.15q.65-1.65 1.563-3.175T9.75 6.1l-1.3-.275q-.5-.1-.975.05t-.825.5L3.5 9.525q-.375.375-.288.9t.588.725zm14.7-9.75q-2.65-.125-5.037 1.025T11.525 6.45q-1.2 1.2-2.113 2.6T7.826 12q-.125.325-.125.663t.25.587l3.125 3.125q.25.25.588.25t.662-.125q1.55-.675 2.95-1.588t2.6-2.112q1.875-1.875 3.025-4.262T21.925 3.5q0-.2-.1-.4t-.25-.35t-.35-.25t-.4-.1m-6.35 7.45q-.575-.575-.575-1.412t.575-1.413t1.413-.575t1.412.575t.575 1.413T17.3 9.85t-1.412.575t-1.413-.575m-2.3 8.35l1 2.325q.2.5.725.6t.9-.275l3.15-3.15q.35-.35.5-.837t.05-.988l-.25-1.3q-1.375 1.15-2.887 2.063T12.175 18.2M4.05 16.05q.875-.875 2.125-.888t2.125.863t.875 2.125t-.875 2.125q-1.2 1.2-2.838 1.425t-3.287.45q.225-1.65.463-3.287T4.05 16.05"
              />
            </svg>
            Añadir Libro!
          </button>
        ) : (
          ""
        )}
      </div>
      {query !== "" && <p>Resultados de la búsqueda:</p>}
      <p>{`${filteredEbooks.length} coincidencias`}</p>
      <div className="all-ebooks">
        {filteredEbooks.map((ebook) => (
          <MiniCardBook key={ebook.id} ebook={ebook} />
        ))}
      </div>
      {showModalAddEbook && (
        <ModalAddBook onClose={() => setShowModalAddEbook(false)} />
      )}
    </div>
  );
}

export default Home;
