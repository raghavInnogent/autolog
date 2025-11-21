import React, { useState } from 'react'
import { servicesAPI } from '../services/api'
import '../styles/components/AddServiceModal.css'

export default function AddServiceModal({ onClose, onCreated }){
  const [vehicleId, setVehicleId] = useState('')
  const [date, setDate] = useState('')
  const [workshop, setWorkshop] = useState('')
  const [mileage, setMileage] = useState('')
  const [cost, setCost] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [invoiceUrl, setInvoiceUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const payload = {
        vehicleId,
        date,
        workshop,
        mileage: mileage ? Number(mileage) : undefined,
        cost: cost ? Number(cost) : undefined,
        items: itemsText ? itemsText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        invoice: invoiceUrl
      }
      await servicesAPI.create(payload)
      onCreated && onCreated()
      onClose && onClose()
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  return (
    <div className="add-service-modal">
      <form onSubmit={submit}>
        <h3>Add Service Record</h3>
        <label>Vehicle ID</label>
        <input value={vehicleId} onChange={e=>setVehicleId(e.target.value)} />
        <label>Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <label>Workshop</label>
        <input value={workshop} onChange={e=>setWorkshop(e.target.value)} />
        <label>Mileage</label>
        <input value={mileage} onChange={e=>setMileage(e.target.value)} />
        <label>Cost</label>
        <input value={cost} onChange={e=>setCost(e.target.value)} />
        <label>Items (comma separated)</label>
        <input value={itemsText} onChange={e=>setItemsText(e.target.value)} placeholder="oil change, filter, tyre check" />
        <label>Invoice URL</label>
        <input value={invoiceUrl} onChange={e=>setInvoiceUrl(e.target.value)} />
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button type="button" className="navy-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="navy-btn">{loading ? 'Saving...' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}