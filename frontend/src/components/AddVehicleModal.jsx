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
      // Create FormData for the vehicle creation request
      const fd = new FormData()
      // Add the file if present
      if (imageFile) {
        fd.append('file', imageFile)
      }
      const vehicleDTO = {
        registrationNumber: form.registrationNumber,
        model: form.model,
        company: form.company,
        type: form.type,
        purchaseDate: form.purchaseDate,
        description: form.description,
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
        odometerReading: form.odometerReading ? Number(form.odometerReading) : null
      }
      fd.append('dto', new Blob([JSON.stringify(vehicleDTO)], { type: 'application/json' }))
      await vehiclesAPI.create(fd)
      onCreated && onCreated()
      onClose && onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Failed to add vehicle')
    } finally { setLoading(false) }
  }
  return (
    <div className="add-vehicle-modal">
      <form onSubmit={submit}>
        <h3>Add Vehicle</h3>
        <div className="form-row">
          <label>Registration Number
            <input value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} required />
          </label>
          <label>Model
            <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
          </label>
        </div>
        <div className="form-row">
          <label>Company
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
          </label>
          <label>Type
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
            </select>
          </label>
        </div>
        <div className="form-row">
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
          <label>Vehicle Image</label>
          <div className="image-upload-wrapper">
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
        <label>Description
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
        </label>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button type="button" onClick={onClose} className="navy-btn cancel-btn">Cancel</button>
          <button type="submit" className="navy-btn">{loading ? 'Saving...' : 'Add Vehicle'}</button>
        </div>
      </form>
    </div>
  )
}










