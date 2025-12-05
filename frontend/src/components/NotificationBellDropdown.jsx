import React from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiX } from 'react-icons/fi'
import '../styles/components/NotificationBellDropdown.css'

export default function NotificationBellDropdown({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onClose 
}) {
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH': return '🔴'
      case 'MODERATE': return '🟡'
      case 'LOW': return '🟢'
      default: return '⚪'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#FF5733'
      case 'MODERATE': return '#FFC300'
      case 'LOW': return '#22C55E'
      default: return 'var(--muted)'
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const handleItemClick = (id) => {
    onMarkAsRead(id)
  }

  return (
    <div className="notification-bell-dropdown">
      <div className="notification-bell-dropdown__header">
        <span className="notification-bell-dropdown__title">Notifications</span>
        {notifications.length > 0 && (
          <button 
            className="notification-bell-dropdown__mark-all"
            onClick={onMarkAllAsRead}
          >
            <FiCheck size={14} />
            Mark All Read
          </button>
        )}
      </div>

      <div className="notification-bell-dropdown__content">
        {loading ? (
          <div className="notification-bell-dropdown__loading">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-bell-dropdown__empty">
            <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.3 }}>🔔</div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>No new notifications</div>
          </div>
        ) : (
          <ul className="notification-bell-dropdown__list">
            {notifications.map((notif) => (
              <li 
                key={notif.id} 
                className="notification-bell-dropdown__item"
                onClick={() => handleItemClick(notif.id)}
              >
                <div className="notification-bell-dropdown__item-header">
                  <span 
                    className="notification-bell-dropdown__priority-icon"
                    title={notif.priority}
                  >
                    {getPriorityIcon(notif.priority)}
                  </span>
                  <span 
                    className="notification-bell-dropdown__priority-text"
                    style={{ color: getPriorityColor(notif.priority) }}
                  >
                    {notif.priority}
                  </span>
                </div>
                <div className="notification-bell-dropdown__message">
                  {notif.message}
                </div>
                <div className="notification-bell-dropdown__time">
                  {formatTimeAgo(notif.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-bell-dropdown__footer">
          <Link 
            to="/home#notifications" 
            className="notification-bell-dropdown__view-all"
            onClick={onClose}
          >
            View All Notifications →
          </Link>
        </div>
      )}
    </div>
  )
}