import { useEffect, useState, useRef } from 'react'
import { FiBell } from 'react-icons/fi'
import NotificationBellDropdown from './NotificationBellDropdown'
import { notificationsAPI } from '../services/api'
import '../styles/components/NotificationBell.css'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [counts, setCounts] = useState({ unreadCount: 0 })
  const [loading, setLoading] = useState(false)
  const bellRef = useRef()

  // Fetch notifications and counts
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const [notifRes, countRes] = await Promise.all([
        notificationsAPI.getAll({ status: 'ACTIVE', readStatus: 'UNREAD' }),
        notificationsAPI.getCounts()
      ])
      setNotifications(notifRes.data || [])
      setCounts(countRes.data || { unreadCount: 0 })
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      fetchNotifications() // Refresh after marking as read
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      fetchNotifications() // Refresh after marking all as read
      setOpen(false)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  return (
    <div className="notification-bell" ref={bellRef}>
      <button 
        className="notification-bell__button" 
        onClick={() => setOpen(!open)} 
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {counts.unreadCount > 0 && (
          <span className="notification-bell__badge">
            {counts.unreadCount > 99 ? '99+' : counts.unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationBellDropdown
          notifications={notifications.slice(0, 5)} // Show max 5
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}