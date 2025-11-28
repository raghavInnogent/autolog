import axios from 'axios'

const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080')

const api = axios.create({
  baseURL,
  withCredentials: true, // Include http-only cookies in all requests
})

// Interceptor to attach JWT token to requests
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('autolog_token')
    if (token) {
      config.headers = config.headers || {}
      if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {/* ignore */ }
  return config
})

export default api

export const vehiclesAPI = {
  // backend exposes GET /vehicles/getAll
  getAll: () => api.get('/vehicles/getAll'),
  // alias for older callers
  getAllLegacy: () => api.get('/vehicles'),
  get: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles/create', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  remove: (id) => api.delete(`/vehicles/${id}`),
}

export const documentsAPI = {
  getAll: (params) => api.get('/documents/getAllDocuments', { params }),
  upload: (formData) => api.post('/documents/uploadDocument', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  create: (data) => api.post('/services', data),
}

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
}

export const schedulesAPI = {
  getUpcoming: (vehicleId) => api.get('/schedules/upcoming', { params: { vehicleId } }),
}

export const analyticsAPI = {
  spendByCategory: (vehicleId, period) => api.get('/analytics/spend-by-category', { params: { vehicleId, period } }),
  costPerKm: (vehicleId, period) => api.get('/analytics/cost-per-km', { params: { vehicleId, period } }),
  serviceFrequency: (vehicleId, period) => api.get('/analytics/service-frequency', { params: { vehicleId, period } }),
  ownershipCost: (vehicleId) => api.get('/analytics/ownership-cost', { params: { vehicleId } }),
}

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/getCurrentUser'),
}

export const usersAPI = {
  create: (data) => api.post('/users/create', data),
}
