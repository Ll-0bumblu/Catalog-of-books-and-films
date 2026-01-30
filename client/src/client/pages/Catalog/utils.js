export function sortDataFromFilters(items, filter) {
    const filteredItems = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      const typeMatch = filter.type === 'all' || item.type === filter.type;
      
      let ratingMatch = true;
      if (filter.rating !== 'all') {
        const minRating = parseInt(filter.rating);
        ratingMatch = item.rating >= minRating;
      }
      
      if (typeMatch && ratingMatch) {
        filteredItems.push(item);
      }
    }
    return filteredItems;
  }

  