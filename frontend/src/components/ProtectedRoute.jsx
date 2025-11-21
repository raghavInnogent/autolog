import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute() {
    const { isAuth, loading } = useAuth()

    if (loading) return <div>Loading...</div>
    return isAuth ? <Outlet /> : <Navigate to="/login" />
}
