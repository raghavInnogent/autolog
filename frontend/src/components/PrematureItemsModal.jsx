import React, { useEffect, useState } from 'react'
import { prematureAPI } from '../services/api'
import '../styles/components/PrematureItemsModal.css'

const PrematureItemsModal = ({ onClose }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await prematureAPI.getAllForUser()
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching premature items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group items by vehicleName
  const groupedItems = items.reduce((acc, item) => {
    const vehicle = item.vehicleName || 'Unknown Vehicle'
    if (!acc[vehicle]) {
      acc[vehicle] = []
    }
    acc[vehicle].push(item)
    return acc
  }, {})

  return (
    <div className="premature-modal-overlay" onClick={onClose}>
      <div className="premature-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="premature-modal-header">
          <h2 className="premature-modal-title">Premature Service Items</h2>
          <button onClick={onClose} className="premature-modal-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="premature-modal-content">
          {loading ? (
            <div className="premature-modal-loading">
              <div className="spinner"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="premature-modal-empty">
              No premature service items found.
            </div>
          ) : (
            <div className="premature-items-list">
              {Object.entries(groupedItems).map(([vehicleName, vehicleItems]) => (
                <div key={vehicleName} className="premature-vehicle-group">
                  <h3 className="premature-vehicle-name">
                    {vehicleName}
                  </h3>
                  <div className="premature-items-grid">
                    {vehicleItems.map((item, index) => (
                      <div key={index} className="premature-item-card">
                        <span className="premature-item-category">{item.categoryName}</span>
                        <span className="premature-item-badge">
                          Count: {item.prematureCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="premature-modal-footer">
          <button onClick={onClose} className="premature-modal-close-footer-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrematureItemsModal