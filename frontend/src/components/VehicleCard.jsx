import React from 'react'
import '../styles/components/VehicleCard.css'

export default function VehicleCard({vehicle, onAdd}){
  if(!vehicle) {
    return (
      <div className="vehicle-card add-vehicle" onClick={onAdd}>
        +
      </div>
    )
  }

  return (
    <div className="vehicle-card">
      <img src={vehicle.image || '/public/vehicle-placeholder.jpg'} alt="vehicle" className="vehicle-img" />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{vehicle.model || 'Unknown Model'}</div>
          <div style={{color:'var(--muted)',fontSize:13}}>{vehicle.purchaseDate ? `Purchased: ${vehicle.purchaseDate}` : ''}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:700}}>{vehicle.odometer ?? '-' } km</div>
          <div style={{color:'var(--muted)',fontSize:12}}>Next: {vehicle.nextService || '—'}</div>
        </div>
      </div>
    </div>
  )
}
