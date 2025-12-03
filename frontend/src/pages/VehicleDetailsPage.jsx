import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehiclesAPI } from '../services/api'
import { FaArrowLeft, FaCar, FaCalendarAlt, FaGasPump, FaRoad } from 'react-icons/fa'

export default function VehicleDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await vehiclesAPI.get(id)
                setVehicle(res.data)
            } catch (err) {
                console.error(err)
                setError('Failed to load vehicle details')
            } finally {
                setLoading(false)
            }
        }
        fetchVehicle()
    }, [id])

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'crimson' }}>{error}</div>
    if (!vehicle) return <div style={{ padding: 40, textAlign: 'center' }}>Vehicle not found</div>

    return (
        <div className="page-content" style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    marginBottom: 24,
                    fontSize: 16,
                    fontWeight: 600
                }}
            >
                <FaArrowLeft /> Back
            </button>

            <div style={{
                background: 'white',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid var(--border)'
            }}>
                <div style={{ height: 300, background: '#000', position: 'relative' }}>
                    <img
                        src={vehicle.image || '/vehicle-placeholder.jpg'}
                        alt={vehicle.model}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        padding: '40px 32px 24px'
                    }}>
                        <h1 style={{ color: 'white', margin: 0, fontSize: 32 }}>{vehicle.company} {vehicle.model}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0', fontSize: 18 }}>{vehicle.registrationNumber}</p>
                    </div>
                </div>

                <div style={{ padding: 32 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                        <div className="detail-item">
                            <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 4 }}>Type</div>
                            <div style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaCar color="var(--accent)" /> {vehicle.type}
                            </div>
                        </div>
                        <div className="detail-item">
                            <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 4 }}>Purchase Date</div>
                            <div style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaCalendarAlt color="var(--accent)" /> {vehicle.purchaseDate}
                            </div>
                        </div>
                        <div className="detail-item">
                            <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 4 }}>Mileage</div>
                            <div style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaRoad color="var(--accent)" /> {vehicle.mileage || 'N/A'} km
                            </div>
                        </div>
                    </div>

                    {vehicle.description && (
                        <div style={{ marginTop: 32 }}>
                            <h3 style={{ color: 'var(--primary)', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: 8 }}>Description</h3>
                            <p style={{ lineHeight: 1.6, color: '#444' }}>{vehicle.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
