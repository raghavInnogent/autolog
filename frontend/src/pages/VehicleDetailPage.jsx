import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { vehiclesAPI, documentsAPI, servicingAPI } from '../services/api'

// ... (inside component)
const [vehicle, setVehicle] = useState(null)
const [docs, setDocs] = useState([])
const [services, setServices] = useState([])
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

                const sRes = await servicingAPI.getAll(foundVehicle.id)
                setServices(sRes.data || [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    load()
}, [id])

    // ... (inside return, replacing mock table body)
    < tbody >
{
    services.length > 0 ? (
        services.map(service => (
            <tr key={service.id}>
                <td>{service.dateOfService}</td>
                <td>{service.servicedItems?.map(i => i.serviceCategory?.name).join(', ') || 'Service'}</td>
                <td>{service.workshop}</td>
                <td>{service.mileage} km</td>
                <td>{service.cost}</td>
                <td><span style={{ padding: '4px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 600 }}>Completed</span></td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>No service history found.</td>
        </tr>
    )
}
                        </tbody >
                    </table >
                </div >
            </section >
        </div >
    )
}
