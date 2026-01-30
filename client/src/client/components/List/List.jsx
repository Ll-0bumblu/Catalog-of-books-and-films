import { useState } from 'react';

import './List.css'
import AddForm from'../AddForm/AddForm'
import Modal from '../Modal/Modal';

import deleteIcon from '../../../assets/delete-icon.png'
import editIcon from '../../../assets/edit-icon.png'

import bookIcon from '../../../assets/book-icon.png'
import movieIcon from '../../../assets/kino-icon.png'


export default function List({ content, setContent}) {
    const [open, setOpen] = useState(false)

    function classImage(type) {
            return type === "book" ? bookIcon : movieIcon;
    }

    function removeItem(id) {
        setContent(content.filter(item => item.id !== id))
    }

    function rewriteItem(newItem) {
        console.log(newItem)
    }

    return (
        <div className="container">
            <Modal 
                isOpen={open} 
                onClose={() => setOpen(!open)}
                children={<AddForm changeItem={rewriteItem} />}
            />
            <ul className="card__list">
                {content.map(item => (

                    <li key={item.id} className="card-wrap">
                        <div className="card">
                            <div className="wrap wrap-content">
                                <img src={classImage(item.type)} alt="" className="img" />
                                <div className="info">
                                    <span className="name">{item.name}</span>
                                    <span className="desc">{item.note}</span>
                                </div>
                            </div>
                            <div className="wrap">
                                <span className="score">Оценка: {item.rating}</span>
                                <div className="wrap">
                                    <button 
                                        className="btn"
                                        onClick={() => setOpen(!open)}
                                    >
                                        <img src={editIcon} alt="edit" className="img-btn" />
                                    </button>


                                    <button 
                                        className="btn"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <img src={deleteIcon} alt="delete" className="img-btn" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                        )
                    )
                }
            </ul>
        </div>    
    )
}

