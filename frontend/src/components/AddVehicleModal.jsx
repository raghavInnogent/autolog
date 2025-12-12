import { useState } from 'react'
import { vehiclesAPI, documentsAPI } from '../services/api'
import '../styles/components/AddVehicleModal.css'
export default function AddVehicleModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    registrationNumber: '',
    model: '',
    company: '',
    type: '',
    purchaseDate: '',
    description: '',
    purchasePrice: '',
    odometerReading: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      // 1. Append File (Mandatory for backend even if empty)
      if (imageFile) {
        formData.append('file', imageFile)
      } else {
        // Send empty blob to satisfy @RequestPart("file")
        formData.append('file', new Blob([], { type: 'application/octet-stream' }))
      }
      // 2. Append DTO
      // Note: Backend won't use the 'image' field from DTO since it uploads the file itself,
      // but we keep the structure.
      const payload = {
        ...form,
        image: null, // Backend handles image upload/linkage
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : undefined,
        odometerReading: form.odometerReading ? Number(form.odometerReading) : undefined
      }
      formData.append('dto', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
      await vehiclesAPI.create(formData)
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Purchase Price (₹)
            <input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} placeholder="e.g. 500000" />
          </label>
          <label>Odometer (km)
            <input type="number" value={form.odometerReading} onChange={e => setForm({ ...form, odometerReading: e.target.value })} placeholder="e.g. 1500" />
          </label>
        </div>
        <label>Purchase Date
          <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} required />
        </label>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 8 }}>Vehicle Image</label>
          <div className="image-upload-wrapper">
            <div className="image-preview-box">
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" />
              ) : (
                <span className="placeholder-icon">:camera:</span>
              )}
            </div>
            <div className="upload-controls">
              <input
                id="v-image-upload"
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
              <label htmlFor="v-image-upload" className="upload-btn">
                {imageFile ? 'Change Image' : 'Choose Image'}
              </label>
              <span className="file-name-text">
                {imageFile ? imageFile.name : 'No file selected'}
              </span>
            </div>
          </div>
        </div>
        <label>Description
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
        </label>
        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button type="button" onClick={onClose} className="navy-btn cancel-btn">Cancel</button>
          <button type="submit" className="navy-btn">{loading ? 'Saving...' : 'Add Vehicle'}</button>
        </div>
      </form>
    </div>
  )
}
