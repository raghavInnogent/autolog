import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NotificationBar from './components/NotificationBar'
import Footer from './components/Footer'
import UserHomePage from './pages/UserHomePage'
import VehiclesPage from './pages/VehiclesPage'
import DocumentsPage from './pages/DocumentsPage'
import ServicingsPage from './pages/ServicingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import OcrUpload from "./pages/OcrUpload";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Navbar />
          <NotificationBar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<UserHomePage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/:type" element={<DocumentsPage />} />
                <Route path="/servicings" element={<ServicingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/ocr" element={<OcrUpload />} />

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
