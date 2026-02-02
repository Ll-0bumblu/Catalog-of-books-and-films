import { API_URL, TOKEN_KEY } from '../utils/constants';

const getToken = () => localStorage.getItem(TOKEN_KEY);

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('catalog_user');
      window.location.href = '/login';
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    const error = await response.json();
    throw new Error(error.error || 'Произошла ошибка');
  }
  return response.json();
};

export const authAPI = {
  register: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('catalog_user');
      return null;
    }
    
    return handleResponse(response);
  },
};

export const itemsAPI = {
  getItems: async (filters = {}) => {
    const token = getToken();
    if (!token) throw new Error('Токен отсутствует');

    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.min_rating) params.append('min_rating', filters.min_rating);

    const url = `${API_URL}/items${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createItem: async (itemData) => {
    const token = getToken();
    if (!token) throw new Error('Токен отсутствует');

    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    return handleResponse(response);
  },

  updateItem: async (id, itemData) => {
    const token = getToken();
    if (!token) throw new Error('Токен отсутствует');

    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    return handleResponse(response);
  },

  deleteItem: async (id) => {
    const token = getToken();
    if (!token) throw new Error('Токен отсутствует');

    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};