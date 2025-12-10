import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function AdminRoute() {
    const { isAuth, user, loading } = useAuth()

    if (loading) return <div>Loading...</div>

    // Check if authenticated AND has ADMIN role
    if (!isAuth) return <Navigate to="/login" />
    if (user?.role !== 'ADMIN') return <Navigate to="/home" />

    return <Outlet />
}
