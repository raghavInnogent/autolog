import React, { useEffect, useState } from 'react'
import { vehiclesAPI } from '../services/api'
import VehicleCard from '../components/VehicleCard'
import AddVehicleModal from '../components/AddVehicleModal'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await vehiclesAPI.getAll()
      setVehicles(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>All Vehicles</h2>
        <button className="navy-btn" onClick={() => setShowAdd(true)}>+ Add Vehicle</button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          <p>No vehicles found.</p>
          <button className="navy-btn" onClick={() => setShowAdd(true)}>Add your first vehicle</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onCreated={fetchVehicles} />}
    </div>
  )
}
