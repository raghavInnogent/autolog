import { useState, useEffect } from 'react'
import { documentsAPI, vehiclesAPI } from '../services/api'
import '../styles/components/DocumentUploadModal.css'

export default function DocumentUploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({
    name: '',
    registrationNumber: '',
    type: '',
    issuedDate: '',
    expiry: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    vehiclesAPI.getAll().then(res => setVehicles(res.data || [])).catch(console.error)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload')
      return
    }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)

      const documentPayload = {}
      if (form.name) documentPayload.name = form.name
      if (form.registrationNumber) documentPayload.registrationNumber = form.registrationNumber
      if (form.type) documentPayload.type = form.type
      if (form.issuedDate) documentPayload.issuedDate = form.issuedDate
      if (form.expiry) documentPayload.expiry = form.expiry

      fd.append("document", new Blob([JSON.stringify(documentPayload)], { type: "application/json" }))

      await documentsAPI.upload(fd)
      onUploaded && onUploaded()
      onClose && onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="document-upload-modal">
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Upload Document</h3>

        <label>Document Name
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Insurance Policy"
            required
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Vehicle
            <select
              value={form.registrationNumber}
              onChange={e => setForm({ ...form, registrationNumber: e.target.value })}
              required
              style={{ width: '100%' }}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.registrationNumber}>
                  {v.company} {v.model} - {v.registrationNumber}
                </option>
              ))}
            </select>
          </label>
          <label>Document Type
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              required
              style={{ width: '100%' }}
            >
              <option value="">Select Type</option>
              <option value="Insurance">Insurance</option>
              <option value="Emission Certificate">Emission Certificate</option>
              <option value="Warranty">Warranty</option>
              <option value="RC">RC</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Issued Date
            <input
              type="date"
              value={form.issuedDate}
              onChange={e => setForm({ ...form, issuedDate: e.target.value })}
            />
          </label>
          <label>Expiry Date
            <input
              type="date"
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: e.target.value })}
            />
          </label>
        </div>

        <label>Select File
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={e => setFile(e.target.files?.[0] || null)}
            required
          />
        </label>

        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button
            type="button"
            onClick={onClose}
            className="navy-btn"
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
          <button type="submit" className="navy-btn">
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  )
}