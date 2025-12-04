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
  } catch (e) {/* ignore */ }
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

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
}

export const schedulesAPI = {
  getUpcoming: (vehicleId) => api.get('/schedules/upcoming', { params: { vehicleId } }),
}

// export const analyticsAPI = {
//   spendByCategory: (vehicleId, period) => api.get('/analytics/spend-by-category', { params: { vehicleId, period } }),
//   costPerKm: (vehicleId, period) => api.get('/analytics/cost-per-km', { params: { vehicleId, period } }),
//   serviceFrequency: (vehicleId, period) => api.get('/analytics/service-frequency', { params: { vehicleId, period } }),
//   ownershipCost: (vehicleId) => api.get('/analytics/ownership-cost', { params: { vehicleId } }),
// }

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/getCurrentUser'),
}

export const usersAPI = {
  create: (data) => api.post('/users/create', data),
}
