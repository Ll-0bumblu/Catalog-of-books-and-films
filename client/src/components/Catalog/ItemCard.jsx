import React, { useState } from 'react';
import '../../styles/Catalog.css';

const ItemCard = ({ item, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });
  const [loading, setLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedItem({ ...item });
  };

  const handleSave = async () => {
    if (!editedItem.title.trim() || !editedItem.type) {
      alert('Название и тип обязательны');
      return;
    }

    if (editedItem.rating && (editedItem.rating < 1 || editedItem.rating > 5)) {
      alert('Рейтинг должен быть от 1 до 5');
      return;
    }

    setLoading(true);
    try {
      await onEdit(item.id, {
        title: editedItem.title,
        type: editedItem.type,
        rating: editedItem.rating || null,
        note: editedItem.note || '',
      });
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setLoading(true);
      try {
        await onDelete(item.id);
      } catch (error) {
        alert(error.message);
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (isEditing) {
    return (
      <div className="item-card editing">
        <div className="edit-form">
          <input
            type="text"
            value={editedItem.title}
            onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
            className="edit-input"
            placeholder="Название"
            disabled={loading}
          />
          
          <select
            value={editedItem.type}
            onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value })}
            className="edit-select"
            disabled={loading}
          >
            <option value="book">Книга</option>
            <option value="movie">Фильм</option>
          </select>
          
          <select
            value={editedItem.rating || ''}
            onChange={(e) => setEditedItem({ ...editedItem, rating: e.target.value ? parseInt(e.target.value) : null })}
            className="edit-select"
            disabled={loading}
          >
            <option value="">Без оценки</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} ★</option>
            ))}
          </select>
          
          <textarea
            value={editedItem.note}
            onChange={(e) => setEditedItem({ ...editedItem, note: e.target.value })}
            className="edit-textarea"
            placeholder="Заметка"
            disabled={loading}
          />
          
          <div className="edit-buttons">
            <button
              onClick={handleSave}
              className="edit-button save-button"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="edit-button cancel-button"
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="item-card">
      <div className="item-header">
        <h3 className="item-title">{item.title}</h3>
        <span className={`item-type ${item.type}`}>
          {item.type === 'book' ? '📚' : '🎬'}
        </span>
      </div>
      
      <div className="item-rating">
        {item.rating ? (
          <div className="stars">
            {/* <span className="stars-value">{renderStars(item.rating)}</span> */}
            <span className="rating-number">({item.rating}/5)</span>
          </div>
        ) : (
          <span className="no-rating">Без оценки</span>
        )}
      </div>
      
      {item.note && (
        <div className="item-note">
          <p>{item.note}</p>
        </div>
      )}
      
      <div className="item-footer">
        <span className="item-date">{formatDate(item.date)}</span>
        <div className="item-actions">
          <button
            onClick={handleEditClick}
            className="action-button edit-button"
            disabled={loading}
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="action-button delete-button"
            disabled={loading}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;