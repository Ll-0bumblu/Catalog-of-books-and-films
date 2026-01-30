import { useState } from 'react';
import './AddForm.css';

export default function AddForm({ changeItem }) {
    const [formData, setFormData] = useState({
      id: "",
      type: 'movie',
      name: '',
      date: '',
      note: '',
      rating: ''
    })

  function handleInputChange(e) {
    const { name, value } = e.target;
    
    if ((name === 'name' && value.length > 100) || 
        (name === 'note' && value.length > 300)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      id: new Date().getMilliseconds()
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.rating) {
      alert('Заполните все обязательные поля: Название и Оценка');
      return;
    }
    
    console.log('Данные формы:', formData);

    changeItem({...formData, id: Date.now(), date: new Date()})

    setFormData({
      id: "",
      type: 'movie',
      name: '',
      date: '',
      note: '',
      rating: ''
    })
  };

  return (
    <div className="content-form-container">
      <h2>Добавить контент</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Тип контента *</label>
          <div className="type-selector">
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="movie"
                checked={formData.type === 'movie'}
                onChange={handleInputChange}
              />
              🎬 Фильм
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="book"
                checked={formData.type === 'book'}
                onChange={handleInputChange}
              />
              📚 Книга
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Название * ({formData.name.length}/100)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Введите название"
            className="form-input"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Описание ({formData.note.length}/300)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Необязательное поле"
            className="form-textarea"
            maxLength={300}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Оценка *</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Выберите оценку</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} {"★".repeat(num)}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Сохранить
        </button>
      </form>
    </div>
  );
};