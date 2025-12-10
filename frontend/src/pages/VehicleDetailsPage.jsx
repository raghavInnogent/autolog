import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehiclesAPI } from '../services/api'
import { FaArrowLeft, FaCar, FaCalendarAlt, FaRoad, FaIdCard, FaIndustry, FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa'
import '../styles/pages/VehicleDetailsPage.css'

export default function VehicleDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                console.log('Fetching vehicle with ID:', id)
                const res = await vehiclesAPI.get(id)
                console.log('Vehicle API response:', res)

                const vehicleData = res.data?.data || res.data
                console.log('Vehicle documents:', vehicleData.documents)
                setVehicle(vehicleData)
            } catch (err) {
                console.error('Error fetching vehicle:', err)
                setError('Failed to load vehicle details')
            } finally {
                setLoading(false)
            }
        }
        fetchVehicle()
    }, [id])

    const getDocumentIcon = (type) => {
        if (!type) return <FaFileAlt />
        const lowerType = type.toLowerCase()
        if (lowerType.includes('pdf')) return <FaFilePdf />
        if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('png')) return <FaFileImage />
        return <FaFileAlt />
    }

    if (loading) {
        return (
            <div className="vehicle-details-page">
                <div className="loading-state">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="vehicle-details-page">
                <div className="error-state">{error}</div>
            </div>
        )
    }

    if (!vehicle) {
        return (
            <div className="vehicle-details-page">
                <div className="error-state">Vehicle not found</div>
            </div>
        )
    }

    return (
        <div className="vehicle-details-page">
            <div className="vehicle-details-container">

                <div className="back-header">
                    <div className="back-btn-text" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Back to Vehicles
                    </div>
                </div>

                <div className="vehicle-layout-grid">

                    <div className="vehicle-sidebar">
                        <div className="sidebar-image-wrapper">
                            {vehicle.image ? (
                                <img
                                    src={vehicle.image}
                                    alt={`${vehicle.company} ${vehicle.model}`}
                                    className="sidebar-image"
                                />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                                    <FaCar size={40} />
                                    <span style={{ fontSize: 13 }}>No Image</span>
                                </div>
                            )}
                        </div>

                        <div className="sidebar-header">
                            <h1 className="sidebar-title">{vehicle.company} {vehicle.model}</h1>
                            <span className="sidebar-badge">{vehicle.registrationNumber}</span>
                        </div>

                        <button className="view-servicings-btn">
                            View Servicings
                        </button>

                    </div>

                    {/* Main Content Area */}
                    <div className="vehicle-main-content">

                        {/* Specifications Card */}
                        <div className="content-card">
                            <h2 className="card-title"><FaIndustry color="#3b82f6" /> Vehicle Details</h2>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Odometer</span>
                                    <span className="spec-value">{vehicle.odometerReading}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Value</span>
                                    <span className="spec-value">{vehicle.purchasePrice}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Type</span>
                                    <span className="spec-value">{vehicle.type}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Registration</span>
                                    <span className="spec-value">{vehicle.registrationNumber}</span>
                                </div>

                            </div>
                        </div>

                        {/* Description Card */}
                        {vehicle.description && (
                            <div className="content-card">
                                <h2 className="card-title"><FaFileAlt color="#8b5cf6" /> Description</h2>
                                <p className="description-text">{vehicle.description}</p>
                            </div>
                        )}

                        {/* Documents Card */}
                        <div className="content-card">
                            <h2 className="card-title">
                                <FaFileAlt color="#f59e0b" />
                                Documents
                                <span style={{ fontSize: 14, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 99, marginLeft: 10 }}>
                                    {vehicle.documents?.length || 0}
                                </span>
                            </h2>

                            {vehicle.documents && vehicle.documents.length > 0 ? (
                                <div className="docs-slider">
                                    {vehicle.documents.map((doc, index) => (
                                        <a
                                            key={doc.id || index}
                                            href={doc.documentUrl || doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="doc-tile"
                                        >
                                            <div className="doc-icon-circle">
                                                {getDocumentIcon(doc.documentType || doc.type)}
                                            </div>
                                            <div className="doc-info">
                                                <h4>{doc.documentName || doc.name || 'Untitled'}</h4>
                                                <span>{doc.documentType || doc.type || 'DOCUMENT'}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8', fontStyle: 'italic' }}>
                                    No documents attached.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
