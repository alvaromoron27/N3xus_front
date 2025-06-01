import './miniCardBook.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { selectBook } from '../../../redux/reducers/bookReducer';

function MiniCardBook (props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleEbookClick(ebook) {
        dispatch(selectBook(ebook));
        navigate(`/ebookCard/:${ebook.id}`);
      }

    return (
        <div
            className="ebook-card"
            onClick={() => handleEbookClick(props.ebook)}
          >
            <img
              src={props.ebook.portada}
              alt={props.ebook.titulo}
              className="ebook-miniCard-data-front-ebook"
            />
            <div className="ebook-card-data">
              <div className="ebook-card-titleAndDescription">
                <h3 className="ebook-card-title">{props.ebook.titulo}</h3>
                <p className="ebook-card-description">{props.ebook.descripcion}</p>
              </div>
              <div className="ebook-card-tags">
                <div className={`ebook-category ${props.ebook.categoria}`}>
                  <p className="ebook-category-text">{props.ebook.categoria}</p>
                </div>
                <div className="ebook-card-autor">
                  <p>{props.ebook.autor}</p>
                </div>
              </div>
            </div>
          </div>
    )
}

export default MiniCardBook;