import React from 'react'
import { FaTimes } from 'react-icons/fa'
import '../styles/components/DocumentViewModal.css'

export default function DocumentViewModal({ document, onClose }) {
    if (!document) return null

    const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getVehicleName = () => {
        // Use vehicleCompany and vehicleModel from document response
        if (document.vehicleCompany || document.vehicleModel) {
            return `${document.vehicleCompany || ''} ${document.vehicleModel || ''}`.trim()
        }

        // Fallback to vehicle object if present
        if (document.vehicle) {
            return `${document.vehicle.company || ''} ${document.vehicle.model || ''}`.trim()
        }

        return document.vehicleName || 'Unknown Vehicle'
    }

    return (
        <div className="document-view-modal-overlay" onClick={onClose}>
            <div className="document-view-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="document-view-content">
                    {/* Document Image */}
                    <div className="document-image-container">
                        {document.docImage || document.url ? (
                            <img
                                src={document.docImage || document.url}
                                alt={document.name || document.docName || 'Document'}
                                className="document-image"
                            />
                        ) : (
                            <div className="no-image-placeholder">
                                <p>No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar with Document Details */}
                    <div className="document-details-sidebar">
                        <h2>{document.name || document.docName || 'Document'}</h2>

                        <div className="detail-group">
                            <label>Vehicle</label>
                            <div className="detail-value">{getVehicleName()}</div>
                        </div>

                        <div className="detail-group">
                            <label>Type</label>
                            <div className="detail-value">{document.type || 'N/A'}</div>
                        </div>

                        <div className="detail-group">
                            <label>Issued Date</label>
                            <div className="detail-value">{formatDate(document.issuedDate)}</div>
                        </div>

                        <div className="detail-group">
                            <label>Expiry Date</label>
                            <div className="detail-value" style={{
                                color: document.expiry && new Date(document.expiry) < new Date() ? '#dc3545' : 'inherit'
                            }}>
                                {formatDate(document.expiry || document.expirationDate)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
