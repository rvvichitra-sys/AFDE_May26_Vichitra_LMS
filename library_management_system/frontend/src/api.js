import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export const booksApi = {
  getAll: () => api.get('/books/'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books/', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const borrowersApi = {
  getAll: () => api.get('/borrowers/'),
  create: (data) => api.post('/borrowers/', data),
  update: (id, data) => api.put(`/borrowers/${id}`, data),
  delete: (id) => api.delete(`/borrowers/${id}`),
};

export const transactionsApi = {
  borrow: (data) => api.post('/borrow', data),
  return: (data) => api.post('/return', data),
  getAll: () => api.get('/transactions'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
};

export const searchApi = {
  search: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
};
