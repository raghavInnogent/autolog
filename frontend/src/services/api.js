import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true, // Include http-only cookies in all requests
})

// Interceptor for http-only cookies - no Authorization header needed
api.interceptors.request.use((config)=>{
  // Cookies are automatically sent by browser with withCredentials: true
  return config
})

export default api

export const vehiclesAPI = {
  getAll: () => api.get('/vehicles'),
  get: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  remove: (id) => api.delete(`/vehicles/${id}`),
}

export const documentsAPI = {
  getAll: () => api.get('/documents'),
  upload: (formData) => api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  create: (data) => api.post('/services', data),
}

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
}
