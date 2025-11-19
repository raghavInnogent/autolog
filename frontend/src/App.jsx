import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NotificationBar from './components/NotificationBar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import VehiclesPage from './pages/VehiclesPage'
import DocumentsPage from './pages/DocumentsPage'
import ServicingsPage from './pages/ServicingsPage'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Navbar />
          <NotificationBar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/documents/:type" element={<DocumentsPage />} />
              <Route path="/servicings" element={<ServicingsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
