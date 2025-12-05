import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UserHomePage from './pages/UserHomePage'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetailsPage from './pages/VehicleDetailsPage'
import DocumentsPage from './pages/DocumentsPage'
import ServicingsPage from './pages/ServicingsPage'
import AnalysisPage from './pages/AnalysisPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

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

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<UserHomePage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/:type" element={<DocumentsPage />} />
                <Route path="/servicings" element={<ServicingsPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/profile" element={<ProfilePage />} />
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
