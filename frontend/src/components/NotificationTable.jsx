import { useEffect, useState } from 'react'
import { FiRefreshCw, FiFilter } from 'react-icons/fi'
import { notificationsAPI } from '../services/api'
import '../styles/components/NotificationTable.css'

export default function NotificationTable() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    priority: '',
    status: 'ACTIVE',
    readStatus: ''
  })

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.priority) params.priority = filters.priority
      if (filters.status) params.status = filters.status
      if (filters.readStatus) params.readStatus = filters.readStatus

      const response = await notificationsAPI.getAll(params)
      setNotifications(response.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [filters])

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleRefresh = () => {
    fetchNotifications()
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      fetchNotifications()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  return (
    <section className="notification-table-section" id="notifications">
      <div className="notification-table-header">
        <h2 style={{ margin: 0 }}>Upcoming Notifications</h2>
        <button 
          className="notification-table-refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      <div className="notification-table-card">
        {/* Filters */}
        <div className="notification-table-filters">
          <div className="notification-table-filter-group">
            <FiFilter size={16} />
            <span className="notification-table-filter-label">Filters:</span>
            
            <select 
              className="notification-table-select"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="HIGH">🔴 High</option>
              <option value="MODERATE">🟡 Moderate</option>
              <option value="LOW">🟢 Low</option>
            </select>

            <select 
              className="notification-table-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Expired</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
            </select>

            <select 
              className="notification-table-select"
              value={filters.readStatus}
              onChange={(e) => handleFilterChange('readStatus', e.target.value)}
            >
              <option value="">Read & Unread</option>
              <option value="UNREAD">Unread Only</option>
              <option value="READ">Read Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="notification-table-scroll">
          {loading ? (
            <div className="notification-table-loading">
              <div className="notification-table-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-table-empty">
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔔</div>
              <p>No notifications found</p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <table className="notification-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Vehicle</th>
                  <th>Reg. Number</th>
                  <th>Item/Document</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr 
                    key={notif.id}
                    className={`notification-table-row ${notif.readStatus === 'UNREAD' ? 'unread' : ''}`}
                    onClick={() => notif.readStatus === 'UNREAD' && handleMarkAsRead(notif.id)}
                  >
                    <td>
                      <span 
                        className="notification-table-priority"
                        style={{ color: getPriorityColor(notif.priority) }}
                        title={notif.priority}
                      >
                        {getPriorityIcon(notif.priority)} {notif.priority}
                      </span>
                    </td>
                    <td className="notification-table-vehicle">
                      {notif.message.split('for ')[1]?.split('(')[0]?.trim() || 'N/A'}
                    </td>
                    <td className="notification-table-reg">
                      {notif.message.match(/\(([^)]+)\)/)?.[1] || 'N/A'}
                    </td>
                    <td className="notification-table-item">
                      {notif.message.split(' expires')[0] || notif.message.split(' has expired')[0]}
                    </td>
                    <td>
                      {new Date(notif.expiryDate).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      <span className={`notification-table-days ${notif.daysLeft <= 1 ? 'critical' : notif.daysLeft <= 7 ? 'warning' : ''}`}>
                        {notif.daysLeft < 0 ? 'Expired' : `${notif.daysLeft} day${notif.daysLeft !== 1 ? 's' : ''}`}
                      </span>
                    </td>
                    <td>
                      <span className={`notification-table-status ${notif.status.toLowerCase()}`}>
                        {notif.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  )
}