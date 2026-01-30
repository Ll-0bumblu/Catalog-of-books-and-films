import deleteIcon from '../../../assets/delete-icon.png'
import editIcon from '../../../assets/edit-icon.png'

import bookIcon from '../../../assets/book-icon.png'
import movieIcon from '../../../assets/kino-icon.png'

export default function Card({type, name, note, date, rating}) {
    function classImage() {
        return type === "book" ? bookIcon : movieIcon;
    }

    return(
        <li className="card-wrap">
            <div className="card">
                <div className="wrap wrap-content">
                    <img src={classImage()} alt="" className="img" />
                    <div className="info">
                        <span className="name">{name}</span>
                        <span className="desc">{note}</span>
                    </div>
                </div>
                <div className="wrap">
                    <span className="score">Оценка: {rating}</span>
                    <div className="wrap">
                        <button className="btn"><img src={editIcon} alt="edit" className="img-btn" /></button>
                        <button 
                            className="btn"
                            onClick={() => console.log(id)}
                        >
                            <img src={deleteIcon} alt="delete" className="img-btn" />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    )
}