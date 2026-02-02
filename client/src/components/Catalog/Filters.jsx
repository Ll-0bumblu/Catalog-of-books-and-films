import React from 'react';
import '../../styles/Catalog.css';

const Filters = ({ filters, onFilterChange }) => {
  const handleTypeChange = (e) => {
    onFilterChange({ ...filters, type: e.target.value || null });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ ...filters, min_rating: e.target.value || null });
  };

  return (
    <div className="filters-container">
      <h3 className="filters-title">Фильтры</h3>
      
      <div className="filter-group">
        <label className="filter-label">Тип:</label>
        <select
          value={filters.type || ''}
          onChange={handleTypeChange}
          className="filter-select"
        >
          <option value="">Все</option>
          <option value="book">Книги</option>
          <option value="movie">Фильмы</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Рейтинг:</label>
        <select
          value={filters.min_rating || ''}
          onChange={handleRatingChange}
          className="filter-select"
        >
          <option value="">Любой</option>
          <option value="5">5</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;