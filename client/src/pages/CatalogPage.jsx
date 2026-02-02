import React, { useState, useCallback } from 'react';
import Header from '../components/Layout/Header';
import Filters from '../components/Catalog/Filters';
import ItemList from '../components/Catalog/ItemList';
import AddItemForm from '../components/Catalog/AddItemForm';
import '../styles/Catalog.css';

const CatalogPage = () => {
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleItemAdded = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="catalog-page">
      <Header />
      
      <main className="catalog-main">
        <div className="catalog-container">
          <div className="catalog-sidebar">
            <Filters filters={filters} onFilterChange={handleFilterChange} />
            <AddItemForm onItemAdded={handleItemAdded} />
          </div>
          
          <div className="catalog-content">
            <h1 className="catalog-title">Мой каталог</h1>
            <ItemList key={refreshKey} filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CatalogPage;