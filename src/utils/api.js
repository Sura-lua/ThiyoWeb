const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const api = {
  // Tables
  getTables: () => apiCall('/tables'),
  updateTable: (id, data) => apiCall(`/tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Orders
  getOrders: () => apiCall('/orders'),
  createOrder: (data) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  addItemsToOrder: (id, data) => apiCall(`/orders/${id}/add-items`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  completeOrder: (id) => apiCall(`/orders/${id}/complete`, {
    method: 'PUT',
  }),

  // Products
  getProducts: () => apiCall('/products'),
  createProduct: (data) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProduct: (id, data) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
  reduceStock: (id, quantity) => apiCall(`/products/${id}/reduce-stock`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  // Combos
  getCombos: () => apiCall('/combos'),
  createCombo: (data) => apiCall('/combos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCombo: (id, data) => apiCall(`/combos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCombo: (id) => apiCall(`/combos/${id}`, {
    method: 'DELETE',
  }),

  // Auth
  login: (username, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
};

