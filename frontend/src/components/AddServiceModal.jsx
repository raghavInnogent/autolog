import React, { useState, useEffect } from 'react'
import { servicesAPI, vehiclesAPI, categoriesAPI } from '../services/api'
import '../styles/components/AddServiceModal.css'

export default function AddServiceModal({ onClose, onCreated }) {
  // Basic fields
  const [vehicleId, setVehicleId] = useState('')
  const [dateOfService, setDateOfService] = useState('')
  const [workshop, setWorkshop] = useState('')
  const [mileage, setMileage] = useState('')
  const [cost, setCost] = useState('')
  const [type, setType] = useState('')
  
  // Invoice handling
  const [invoiceFile, setInvoiceFile] = useState(null)
  const [invoiceUrl, setInvoiceUrl] = useState('')
  const [inputMode, setInputMode] = useState('manual') // 'manual' or 'upload'
  
  // Service items
  const [servicedItems, setServicedItems] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState('1')
  
  // Data fetching
  const [vehicles, setVehicles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vehiclesRes, categoriesRes] = await Promise.all([
        vehiclesAPI.getAll(),
        categoriesAPI.getAll()
      ])
      setVehicles(vehiclesRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load vehicles or service categories')
    }
  }

  const addServiceItem = () => {
    if (!selectedCategoryId) {
      alert('Please select a service category')
      return
    }
    
    const category = categories.find(c => c.id === Number(selectedCategoryId))
    if (!category) return

    const newItem = {
      serviceCategoryId: Number(selectedCategoryId),
      quantity: Number(selectedQuantity) || 1,
      expirationDate: null // Backend calculates this
    }

    setServicedItems([...servicedItems, newItem])
    setSelectedCategoryId('')
    setSelectedQuantity('1')
  }

  const removeServiceItem = (index) => {
    setServicedItems(servicedItems.filter((_, i) => i !== index))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (!vehicleId) throw new Error('Please select a vehicle')
      if (!dateOfService) throw new Error('Please select a service date')
      if (servicedItems.length === 0) throw new Error('Please add at least one service item')
      if (inputMode === 'manual' && !invoiceUrl) throw new Error('Please provide invoice URL')
      if (inputMode === 'upload' && !invoiceFile) throw new Error('Please upload an invoice file')

      let finalInvoice = invoiceUrl

      // If file upload mode, upload the file first
      if (inputMode === 'upload' && invoiceFile) {
        const formData = new FormData()
        formData.append('file', invoiceFile)
        // TODO: You might want to upload this to a storage service and get the URL
        // For now, we'll use the file name as placeholder
        finalInvoice = invoiceFile.name
      }

      const payload = {
        vehicleId: Number(vehicleId),
        dateOfService,
        workshop: workshop || null,
        mileage: mileage ? Number(mileage) : null,
        cost: cost ? Number(cost) : null,
        invoice: finalInvoice || null,
        type: type || null,
        servicedItems
      }

      await servicesAPI.create(payload)
      onCreated && onCreated()
      onClose && onClose()
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Failed to create service record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-service-modal">
      <form onSubmit={submit}>
        <h3>Add Service Record</h3>
        
        {error && <div style={{ color: 'crimson', fontSize: 13, marginBottom: 12, padding: 8, background: 'rgba(220,20,60,0.1)', borderRadius: 4 }}>{error}</div>}

        {/* Vehicle Selection */}
        <label>Vehicle *</label>
        <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }}>
          <option value="">Select a vehicle</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>
              {v.company} {v.model} ({v.registrationNumber})
            </option>
          ))}
        </select>

        {/* Service Date */}
        <label>Service Date *</label>
        <input type="date" value={dateOfService} onChange={e => setDateOfService(e.target.value)} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }} />

        {/* Service Type */}
        <label>Service Type</label>
        <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }}>
          <option value="">Select type</option>
          <option value="Regular">Regular</option>
          <option value="Breakdown">Breakdown</option>
          <option value="Periodic">Periodic</option>
          <option value="Preventive">Preventive</option>
        </select>

        {/* Service Items */}
        <label style={{ marginTop: 12 }}>Service Items *</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px auto', gap: 8, alignItems: 'end', marginTop: 6 }}>
          <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}>
            <option value="">Select service category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} (₹{c.price})
              </option>
            ))}
          </select>
          <input 
            type="number" 
            value={selectedQuantity} 
            onChange={e => setSelectedQuantity(e.target.value)}
            min="1"
            style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border)' }}
          />
          <button type="button" className="navy-btn" onClick={addServiceItem} style={{ padding: '10px 12px', minWidth: 'auto' }}>
            Add
          </button>
        </div>

        {/* Added Service Items List */}
        {servicedItems.length > 0 && (
          <div style={{ marginTop: 12, padding: 12, background: 'var(--hover)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <strong style={{ fontSize: 13 }}>Added Items:</strong>
            {servicedItems.map((item, idx) => {
              const category = categories.find(c => c.id === item.serviceCategoryId)
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 13, borderBottom: idx < servicedItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span>{category?.name} × {item.quantity}</span>
                  <button type="button" onClick={() => removeServiceItem(idx)} style={{ background: 'none', border: 'none', color: 'crimson', cursor: 'pointer', padding: '4px 8px' }}>
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Workshop & Mileage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <label>Workshop
            <input value={workshop} onChange={e => setWorkshop(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }} />
          </label>
          <label>Mileage (km)
            <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }} />
          </label>
        </div>

        {/* Cost */}
        <label>Cost (₹)</label>
        <input type="number" value={cost} onChange={e => setCost(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }} />

        {/* Invoice Input - Toggle between Manual and Upload */}
        <label style={{ marginTop: 12 }}>Invoice</label>
        <div style={{ display: 'flex', gap: 8, marginTop: 6, marginBottom: 12 }}>
          <button 
            type="button" 
            onClick={() => setInputMode('manual')}
            style={{ 
              flex: 1, 
              padding: 8, 
              borderRadius: 6, 
              border: `2px solid ${inputMode === 'manual' ? 'var(--primary)' : 'var(--border)'}`,
              background: inputMode === 'manual' ? 'var(--primary)' : 'var(--card)',
              color: inputMode === 'manual' ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            Manual URL
          </button>
          <button 
            type="button" 
            onClick={() => setInputMode('upload')}
            style={{ 
              flex: 1, 
              padding: 8, 
              borderRadius: 6, 
              border: `2px solid ${inputMode === 'upload' ? 'var(--primary)' : 'var(--border)'}`,
              background: inputMode === 'upload' ? 'var(--primary)' : 'var(--card)',
              color: inputMode === 'upload' ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            Upload File
          </button>
        </div>

        {inputMode === 'manual' && (
          <input 
            type="url" 
            value={invoiceUrl} 
            onChange={e => setInvoiceUrl(e.target.value)}
            placeholder="https://example.com/invoice.pdf"
            style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }}
          />
        )}

        {inputMode === 'upload' && (
          <input 
            type="file" 
            onChange={e => setInvoiceFile(e.target.files?.[0] || null)}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 8, border: '1px solid var(--border)' }}
          />
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button type="button" className="navy-btn" onClick={onClose} style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            Cancel
          </button>
          <button type="submit" className="navy-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Create Service Record'}
          </button>
        </div>
      </form>
    </div>
  )
}