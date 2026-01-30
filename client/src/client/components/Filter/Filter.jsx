import './Filter.css'

export default function Filter({filter, handleTypeChange, handleRatingChange}) {

    function getTypeButtonClass(type) {
        return `btn-filter ${filter.type === type ? 'active' : ''}`
    }

    function getRatingButtonClass(ratingValue) {
        return `btn-filter ${filter.rating === ratingValue ? 'active' : ''}`
    }
    
    return(
        <div className="container-filter">
            <div className="type">
                <span className="text">Тип:</span>
                <button 
                    className={getTypeButtonClass("all")} 
                    onClick={() => handleTypeChange("all")}
                >
                    Все
                </button>
                <button 
                    className={getTypeButtonClass("book")} 
                    onClick={() => handleTypeChange("book")}
                >
                    Книги
                </button>
                <button 
                    className={getTypeButtonClass("movie")} 
                    onClick={() => handleTypeChange("movie")}
                >
                    Фильмы
                </button>
            </div>
            <div className="rating">
                <span className="text">Рейтинг: </span>
                <button 
                    className={getRatingButtonClass("all")}
                    onClick={() => handleRatingChange("all")}
                >
                    Любой
                </button>
                <button 
                    className={getRatingButtonClass("5")}
                    onClick={() => handleRatingChange("5")}
                >
                    5
                </button>
                <button 
                    className={getRatingButtonClass("4")}
                    onClick={() => handleRatingChange("4")}
                >
                    4+
                </button>
                <button 
                    className={getRatingButtonClass("3")}
                    onClick={() => handleRatingChange("3")}
                >
                    3+
                </button>
            </div>
        </div>
    )
}