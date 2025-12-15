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
  getAllLegacy: () => api.get('/vehicles'),
  get: (id) => api.get(`/vehicles/getById/${id}`),
  create: (data) => api.post('/vehicles/create', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
}

export const documentsAPI = {
  getAll: (params) => api.get('/documents/getAllDocuments', { params }),
  getById: (id) => api.get(`/documents/getDocumentById/${id}`),
  upload: (formData) => api.post('/documents/uploadDocument', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const servicesAPI = {
  getAll: (params) => api.get('/servicing/getAll', { params }),
  create: (data) => api.post('/servicing/create', data),
  fetchDataFromImage: (formData) => api.post('/servicing/fetchDataFromImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  createServiceViaInvoice: (data) => api.post('/servicing/createServiceViaInvoice', data),
}

export const categoriesAPI = {
  getAll: () => api.get('/categories/getAll'),
  add: (data) => api.post('/categories/addCategory', data),
  addServiceCategory: (data) => api.post('/categories/addNewServiceCategory', data),
  update: (id, data) => api.put(`/categories/updateCategory/${id}`, data),
  delete: (id) => api.delete(`/categories/deleteCategory/${id}`),
}

export const adminAPI = {
  getAllUsers: () => api.get('/users/getAll'),
  updateUserStatus: (id, status) => api.put(`/admin/updateStatus/${id}?status=${status}`),
}

export const schedulesAPI = {
  getUpcoming: (vehicleId) => api.get('/schedules/upcoming', { params: { vehicleId } }),
}

export const analyticsAPI = {
  getMonthlyExpenditure: () => api.get('/analysis/getMonthlyExpenditure'),
  getVehicleWiseExpenditure: () => api.get('/analysis/getVehicleWiseExpenditure'),
  getCostPerKm: () => api.get('/analysis/getRunningCostPerKm'),
  getTop3MostUsedVehicles: () => api.get('/analysis/getTop3MostUsedVehicles'),
  getMostEfficientVehicle: () => api.get('/analysis/getMostEfficientVehicle'),
  spendByCategory: (vehicleId, period) => api.get('/analytics/spend-by-category', { params: { vehicleId, period } }),
  costPerKm: (vehicleId, period) => api.get('/analytics/cost-per-km', { params: { vehicleId, period } }),
  serviceFrequency: (vehicleId, period) => api.get('/analytics/service-frequency', { params: { vehicleId, period } }),
  ownershipCost: (vehicleId) => api.get('/analytics/ownership-cost', { params: { vehicleId } }),
}

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/getCurrentUser'),
  sendOtp: (email) => api.post(`/auth/sendOtp?email=${encodeURIComponent(email)}`),
  verifyOtp: (email, otp) => api.get(`/auth/verifyOtp?email=${encodeURIComponent(email)}&otp=${otp}`),
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

export const prematureAPI = {
  getTotalCount: () => api.get('/premature/getTotalCount'),
  getAllForUser: () => api.get('/premature/getAllForUser'),
  getCountByCategory: (categoryId) => api.get(`/premature/getCountByCategory/${categoryId}`),
  getByVehicleId: (vehicleId) => api.get(`/premature/getByVehicleId/${vehicleId}`)
}


export default api