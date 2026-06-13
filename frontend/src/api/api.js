import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const facilitiesAPI = {
  getAll: (categoryId) =>
    api.get('/facilities', { params: categoryId ? { category_id: categoryId } : {} }),
  getById: (id) => api.get(`/facilities/${id}`),
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  remove: (id) => api.delete(`/facilities/${id}`),
};

export const reservationsAPI = {
  create: (data) => api.post('/reservations', data),
  getMy: () => api.get('/reservations/my'),
  cancel: (id) => api.patch(`/reservations/${id}/cancel`),
  confirm: (id) => api.patch(`/reservations/${id}/confirm`),
  getAll: (params) => api.get('/reservations', { params }),
};

export default api;
