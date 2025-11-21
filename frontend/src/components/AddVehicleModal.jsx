import { useState } from 'react'
import { vehiclesAPI } from '../services/api'
import '../styles/components/AddVehicleModal.css'

export default function AddVehicleModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ registrationNumber: '', model: '', company: '', type: '', purchaseDate: '', image: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form }
      await vehiclesAPI.create(payload)
      onCreated && onCreated()
      onClose && onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to add vehicle')
    } finally { setLoading(false) }
  }

  return (
    <div className="add-vehicle-modal">
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Add Vehicle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Registration Number
            <input value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} required />
          </label>
          <label>Model
            <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Company
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
          </label>
          <label>Type
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required style={{ width: '100%' }}>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
            </select>
          </label>
        </div>
        <label>Purchase Date
          <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} required />
        </label>
        <label>Image URL
          <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://storage.googleapis.com/..." />
        </label>
        <label>Description
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
        </label>

        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button type="button" onClick={onClose} className="navy-btn" style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</button>
          <button type="submit" className="navy-btn">{loading ? 'Saving...' : 'Add Vehicle'}</button>
        </div>
      </form>
    </div>
  )
}
