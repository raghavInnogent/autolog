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
  } catch (e) { console.error('Error setting auth token in request:', e) }
  return config
})

export const vehiclesAPI = {
  getAll: () => api.get('/vehicles/getAll'),
  get: (id) => api.get(`/vehicles/getById/${id}`),
  create: (data) => api.post('/vehicles/create', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/deleteById/${id}`),
}

export const documentsAPI = {
  getAll: (params) => api.get('/documents/getAllDocuments', { params }),
  upload: (formData) => api.post('/documents/uploadDocument', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const servicesAPI = {
  getAll: (params) => api.get('/servicing/getAll', { params }),
  create: (data) => api.post('/servicing/create', data),
}

export const categoriesAPI = {
  getAll: () => api.get('/categories/getAll'),
}

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/getCurrentUser'),
  sendOtp: (email) => api.post(`/auth/sendOtp?email=${email}`),
  verifyOtp: (email, otp) => api.get(`/auth/verifyOtp?email=${email}&otp=${otp}`),
}

export const usersAPI = {
  create: (data) => api.post('/users/create', data),
}

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications/getAllNotifications', { params }),
  getById: (id) => api.get(`/notifications/getNotificationById/${id}`),
  getCounts: () => api.get('/notifications/getNotificationCounts'),
  markAsRead: (id) => api.patch(`/notifications/markNotificationAsRead/${id}`),
  markAllAsRead: () => api.patch('/notifications/markAllRead'),
  getByVehicle: (vehicleId) => api.get(`/notifications/getNotificationsByVehicle/${vehicleId}`)
}

export const adminAPI = {
  getAllUsers: () => api.get('/users/getAll'),
  updateUserStatus: (userId, status) => api.put(`/admin/updateStatus/${userId}`, null, { params: { status } }),
}

export const analyticsAPI = {
  getTop3MostUsedVehicles: () => api.get('/analysis/getTop3MostUsedVehicles'),
  getMostEfficientVehicle: () => api.get('/analysis/getMostEfficientVehicle'),
}

export const prematureAPI = {
  getAllForUser: () => api.get('/premature/getAllForUser'),
  getCountByCategory: (categoryId) => api.get(`/premature/getCountByCategory/${categoryId}`),
  getByVehicleId: (vehicleId) => api.get(`/premature/getByVehicleId/${vehicleId}`),
}
export default api