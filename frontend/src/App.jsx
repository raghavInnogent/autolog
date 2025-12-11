import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UserHomePage from './pages/UserHomePage'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetailsPage from './pages/VehicleDetailsPage'
import DocumentsPage from './pages/DocumentsPage'
import ServicingsPage from './pages/ServicingsPage'
import ServiceDetailsPage from './pages/ServiceDetailsPage'
import AnalysisPage from './pages/AnalysisPage'
import CompareVehiclesPage from './pages/CompareVehiclesPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Navbar />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/register" element={<SignupPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<UserHomePage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/:type" element={<DocumentsPage />} />
                <Route path="/servicings" element={<ServicingsPage />} />
                <Route path="/services/:id" element={<ServiceDetailsPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/compare-vehicles" element={<CompareVehiclesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
