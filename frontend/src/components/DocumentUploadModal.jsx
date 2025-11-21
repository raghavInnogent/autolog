import React, { useState, useEffect } from 'react'
import { documentsAPI, vehiclesAPI } from '../services/api'
import '../styles/components/DocumentUploadModal.css'

export default function DocumentUploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [type, setType] = useState('')
  const [issuedDate, setIssuedDate] = useState('')
  const [expiry, setExpiry] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    vehiclesAPI.getAll().then(res => setVehicles(res.data || [])).catch(console.error)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (name) fd.append('name', name)
      if (registrationNumber) fd.append('registrationNumber', registrationNumber)
      if (type) fd.append('type', type)
      if (issuedDate) fd.append('issuedDate', issuedDate)
      if (expiry) fd.append('expiry', expiry)
      await documentsAPI.upload(fd)
      onUploaded && onUploaded()
      onClose && onClose()
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Upload failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="document-upload-modal">
      <form onSubmit={submit}>
        <h3>Upload Document</h3>
        <label>File</label>
        <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} required />

        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Insurance Policy" required />

        <label>Vehicle</label>
        <select value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required style={{ width: '100%' }}>
          <option value="">Select Vehicle</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.registrationNumber}>
              {v.company} {v.model} ({v.registrationNumber})
            </option>
          ))}
        </select>

        <label>Type</label>
        <select value={type} onChange={e => setType(e.target.value)} required style={{ width: '100%' }}>
          <option value="">Select Type</option>
          <option value="Insurance">Insurance</option>
          <option value="Emission Certificate">Emission Certificate</option>
          <option value="Warranty">Warranty</option>
          <option value="RC">RC</option>
          <option value="Other">Other</option>
        </select>

        <label>Issued Date</label>
        <input type="date" value={issuedDate} onChange={e => setIssuedDate(e.target.value)} />

        <label>Expiry</label>
        <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button type="button" className="navy-btn" onClick={onClose} style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</button>
          <button type="submit" className="navy-btn">{loading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </form>
    </div>
  )
}