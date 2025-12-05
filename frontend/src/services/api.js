import axios from 'axios'

const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080')

const api = axios.create({
  baseURL,
  withCredentials: true, 
})


api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('autolog_token')
    if (token) {
      config.headers = config.headers || {}
      if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {console.error('Error setting auth token in request:', e) }
  return config
})

export const vehiclesAPI = {
  getAll: () => api.get('/vehicles/getAll'),
  get: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles/create', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
}

export const documentsAPI = {
  getAll: (params) => api.get('/documents/getAllDocuments', { params }),
  upload: (formData) => api.post('/documents/uploadDocument', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const servicesAPI = {
  getAll: (params) => api.get('/servicing/getAll', { params }),
  create: (data) => api.post('/servicing/create', data),
}

export const serviceCategoriesAPI = {
  getAll: () => api.get('/categories/getAll'),
}

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/getCurrentUser'),
}

export const usersAPI = {
  create: (data) => api.post('/users/create', data),
}

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  getCounts: () => api.get('/notifications/count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/mark-read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  getByVehicle: (vehicleId) => api.get(`/notifications/vehicle/${vehicleId}`)
}
export default api