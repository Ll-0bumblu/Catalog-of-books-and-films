import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import { itemsAPI } from '../../services/api';
import '../../styles/Catalog.css';

const ItemList = ({ filters }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await itemsAPI.getItems(filters);
      setItems(data);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки записей');
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleEditItem = async (id, updatedData) => {
    try {
      await itemsAPI.updateItem(id, updatedData);
      await fetchItems(); // Обновляем список
    } catch (err) {
      throw new Error(err.message || 'Ошибка обновления записи');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await itemsAPI.deleteItem(id);
      await fetchItems(); // Обновляем список
    } catch (err) {
      throw new Error(err.message || 'Ошибка удаления записи');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка записей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchItems} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-container">
        <p className="empty-text">
          {filters.type || filters.min_rating 
            ? 'Нет записей, соответствующих фильтрам' 
            : 'У вас пока нет записей. Добавьте первую!'}
        </p>
      </div>
    );
  }

  return (
    <div className="items-container">
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      ))}
    </div>
  );
};

export default ItemList;