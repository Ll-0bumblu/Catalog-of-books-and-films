import React, { useState } from 'react';
import { itemsAPI } from '../../services/api';
import '../../styles/Catalog.css';

const AddItemForm = ({ onItemAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'book',
    rating: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Название обязательно');
      return;
    }

    setLoading(true);
    
    try {
      const itemData = {
        title: formData.title,
        type: formData.type,
        rating: formData.rating ? parseInt(formData.rating) : null,
        note: formData.note || '',
      };
      
      await itemsAPI.createItem(itemData);

      setFormData({
        title: '',
        type: 'book',
        rating: '',
        note: '',
      });
      

      if (onItemAdded) {
        onItemAdded();
      }
      
    } catch (err) {
      setError(err.message || 'Ошибка при добавлении записи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <h3 className="add-item-title">Добавить новую запись</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
              placeholder="Введите название"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Тип</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              <option value="book">Книга</option>
              <option value="movie">Фильм</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Оценка</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              <option value="">Без оценки</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Заметка</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="form-textarea"
            disabled={loading}
            placeholder="Добавьте заметку..."
            rows="3"
          />
        </div>
        
        <button
          type="submit"
          className="add-button"
          disabled={loading}
        >
          {loading ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;