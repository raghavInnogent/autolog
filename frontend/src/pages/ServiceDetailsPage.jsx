import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import { FaArrowLeft, FaCar, FaCalendarAlt, FaTools, FaMapMarkerAlt, FaTachometerAlt, FaMoneyBillWave, FaFileInvoice, FaWrench } from 'react-icons/fa'
import '../styles/pages/ServiceDetailsPage.css'

export default function ServiceDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await servicesAPI.getAll()
                const serviceRecord = res.data?.find(s => s.id === Number(id))
                setService(serviceRecord)
            } catch (err) {
                console.error('Error fetching service:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchService()
    }, [id])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0)
    }

    const getVehicleName = () => {
        if (service?.vehicle) {
            return `${service.vehicle.company || ''} ${service.vehicle.model || ''}`.trim()
        }
        return 'Unknown Vehicle'
    }

    if (loading) {
        return <div className="page-content"><div style={{ textAlign: 'center', padding: 40 }}>Loading...</div></div>
    }

    if (!service) {
        return <div className="page-content"><div style={{ textAlign: 'center', padding: 40 }}>Service record not found</div></div>
    }

    return (
        <div className="page-content">
            <button className="back-btn" onClick={() => navigate('/servicings')}>
                <FaArrowLeft /> Back to Services
            </button>

            <div className="service-details-container">
                <div className="service-details-header">
                    <h1>Service Record Details</h1>
                </div>

                <div className="service-details-grid">
                    {/* Vehicle Information */}
                    <div className="detail-card">
                        <div className="detail-card-header">
                            <FaCar /> Vehicle Information
                        </div>
                        <div className="detail-card-body">
                            <div className="detail-row">
                                <span className="detail-label">Vehicle</span>
                                <span className="detail-value">{getVehicleName()}</span>
                            </div>
                            {service.vehicle?.registrationNumber && (
                                <div className="detail-row">
                                    <span className="detail-label">Registration</span>
                                    <span className="detail-value">{service.vehicle.registrationNumber}</span>
                                </div>
                            )}
                            {service.vehicle?.type && (
                                <div className="detail-row">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-value">{service.vehicle.type}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="detail-card">
                        <div className="detail-card-header">
                            <FaTools /> Service Information
                        </div>
                        <div className="detail-card-body">
                            <div className="detail-row">
                                <span className="detail-label"><FaCalendarAlt /> Date</span>
                                <span className="detail-value">{service.dateOfService || service.date || '-'}</span>
                            </div>
                            {service.type && (
                                <div className="detail-row">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-value">{service.type}</span>
                                </div>
                            )}
                            {service.workshop && (
                                <div className="detail-row">
                                    <span className="detail-label"><FaMapMarkerAlt /> Workshop</span>
                                    <span className="detail-value">{service.workshop}</span>
                                </div>
                            )}
                            {service.mileage && (
                                <div className="detail-row">
                                    <span className="detail-label"><FaTachometerAlt /> Mileage</span>
                                    <span className="detail-value">{service.mileage} km</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cost Information */}
                    <div className="detail-card">
                        <div className="detail-card-header">
                            <FaMoneyBillWave /> Cost Information
                        </div>
                        <div className="detail-card-body">
                            <div className="detail-row">
                                <span className="detail-label">Total Cost</span>
                                <span className="detail-value cost-highlight">{formatCurrency(service.cost)}</span>
                            </div>
                            {service.invoice && (
                                <div className="detail-row">
                                    <span className="detail-label"><FaFileInvoice /> Invoice</span>
                                    <a href={service.invoice} target="_blank" rel="noopener noreferrer" className="invoice-link">
                                        View Invoice
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Serviced Items */}
                    {service.servicedItems && service.servicedItems.length > 0 && (
                        <div className="detail-card full-width">
                            <div className="detail-card-header">
                                <FaWrench /> Serviced Items
                            </div>
                            <div className="detail-card-body">
                                <table className="serviced-items-table">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                            <th>Cost Per Item</th>
                                            <th>Total</th>
                                            <th>Expiration Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {service.servicedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="item-name-cell">{item.categoryName || 'N/A'}</td>
                                                <td>{item.quantity || '-'}</td>
                                                <td>{item.costPerItem ? formatCurrency(item.costPerItem) : '-'}</td>
                                                <td className="total-cell">
                                                    {item.quantity && item.costPerItem
                                                        ? formatCurrency(item.quantity * item.costPerItem)
                                                        : '-'}
                                                </td>
                                                <td>{item.expirationDate || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
