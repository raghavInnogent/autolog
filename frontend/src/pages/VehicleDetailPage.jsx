import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { vehiclesAPI, documentsAPI } from '../services/api'
import DocumentCard from '../components/DocumentCard'
import '../styles/pages/HomePage.css' 

export default function VehicleDetailPage() {
    const { id } = useParams()
    const [vehicle, setVehicle] = useState(null)
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const vRes = await vehiclesAPI.getAll()
                const foundVehicle = vRes.data.find(v => v.id.toString() === id)
                setVehicle(foundVehicle)

                if (foundVehicle) {
                    
                    const dRes = await documentsAPI.getAll()
                    const vehicleDocs = dRes.data.filter(d => d.vehicleId === foundVehicle.id || (d.vehicle && d.vehicle.id === foundVehicle.id))
                    setDocs(vehicleDocs)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>
    if (!vehicle) return <div style={{ padding: 24 }}>Vehicle not found</div>

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Link to="/home" className="navy-btn" style={{ display: 'inline-block', marginBottom: 16 }}>&larr; Back to Dashboard</Link>

                
                <div className="card" style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', padding: 0 }}>
        
                    <div style={{ width: '40%', minWidth: 300, background: '#000', position: 'relative' }}>
                        <img
                            src={vehicle.image || '/public/vehicle-placeholder.jpg'}
                            alt={vehicle.model}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                        />
                    </div>

                
                    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--nav-title)' }}>{vehicle.model}</h1>
                            <div style={{ fontSize: '1.2rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>{vehicle.company}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Registration Number</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{vehicle.registrationNumber}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Type</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{vehicle.type}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Purchase Date</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{vehicle.purchaseDate}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Odometer</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{vehicle.mileage || '—'} km</div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Description</div>
                            <p style={{ margin: '4px 0 0 0', lineHeight: 1.5 }}>
                                {vehicle.description || 'No description available for this vehicle.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

    
            <section style={{ marginBottom: 32 }}>
                <h2 style={{ marginBottom: 16 }}>Documents</h2>
                {docs.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {docs.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} variant="detailed" />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: 24, textAlign: 'center', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', color: 'var(--muted)' }}>
                        No documents found for this vehicle.
                    </div>
                )}
            </section>

            {/* Servicings Section (Mock Data) */}
            <section>
                <h2 style={{ marginBottom: 16 }}>Servicing History</h2>
                <div className="service-table">
                    <table className="service-list" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Workshop</th>
                                <th>Mileage</th>
                                <th>Cost</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mock Data */}
                            <tr>
                                <td>2024-10-15</td>
                                <td>Regular Maintenance</td>
                                <td>City Garage</td>
                                <td>15,000 km</td>
                                <td>250</td>
                                <td><span style={{ padding: '4px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 600 }}>Completed</span></td>
                            </tr>
                            <tr>
                                <td>2024-06-20</td>
                                <td>Oil Change</td>
                                <td>Quick Lube</td>
                                <td>10,000 km</td>
                                <td>80</td>
                                <td><span style={{ padding: '4px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 600 }}>Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
