import React from 'react'
import '../styles/components/VehicleCard.css'

export default function VehicleCard({ vehicle, onAdd }) {
  if (!vehicle) {
    return (
      <div className="vehicle-card add-vehicle" onClick={onAdd}>+
      </div>
    )
  }

  return (
    <div className="card vehicle-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 140, overflow: 'hidden', background: '#000' }}>
        <img src={vehicle.image || '/public/vehicle-placeholder.jpg'} alt="vehicle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{vehicle.company}</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{vehicle.model}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{vehicle.registrationNumber}</div>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
          <span>{vehicle.type}</span>
          <span>{vehicle.purchaseDate}</span>
        </div>
      </div>
    </div>
  )
}
