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
  const [serviceCategories, setServiceCategories] = useState([])
  const [form, setForm] = useState({
    vehicleId: '',
    dateOfService: '',
    workshop: '',
    mileage: '',
    cost: '',
    type: ''
  })
  const [selectedItems, setSelectedItems] = useState([])
  const [currentItem, setCurrentItem] = useState({ serviceCategoryId: '', quantity: 1, perItemPrice: '' })
  const [customItem, setCustomItem] = useState({ itemName: '' })
  const [showCustomFields, setShowCustomFields] = useState(false)
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
      setServiceCategories(categoriesRes.data || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load vehicles or service categories')
    }
  }

  const addItem = () => {
    if (!currentItem.serviceCategoryId) {
      setError('Please select a service item')
      return
    }

    if (selectedItems.some(item => item.serviceCategoryId === currentItem.serviceCategoryId)) {
      setError('This item is already added')
      return
    }

    setSelectedItems([...selectedItems, {
      serviceCategoryId: Number(currentItem.serviceCategoryId),
      quantity: Number(currentItem.quantity) || 1,
      perItemPrice: currentItem.perItemPrice ? Number(currentItem.perItemPrice) : 0
    }])
    setCurrentItem({ serviceCategoryId: '', quantity: 1, perItemPrice: '' })
    setError('')
  }

  const removeItem = (serviceCategoryId) => {
    setSelectedItems(selectedItems.filter(item => item.serviceCategoryId !== serviceCategoryId))
  }

  const getItemName = (serviceCategoryId) => {
    const category = serviceCategories.find(c => c.id === serviceCategoryId)
    return category ? category.name : 'Unknown Item'
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const servicedItems = selectedItems.map(item => ({
        serviceCategoryId: Number(item.serviceCategoryId),
        quantity: Number(item.quantity),
        perItemPrice: Number(item.perItemPrice)
      }))

      // Determine the invoice value based on input mode
      let invoiceValue = null
      if (inputMode === 'manual' && invoiceUrl) {
        invoiceValue = invoiceUrl
      } else if (inputMode === 'upload' && invoiceFile) {
        // For file upload, you might need to handle file upload separately
        // For now, we'll use the file name or handle it as needed
        invoiceValue = invoiceFile.name
      }

      const payload = {
        vehicleId: Number(vehicleId),
        dateOfService,
        workshop: workshop || null,
        mileage: mileage ? Number(mileage) : null,
        cost: cost ? Number(cost) : null,
        invoice: invoiceValue,
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

        <div style={{ marginTop: 8 }}>
          <label style={{ marginBottom: 8 }}>Service Items</label>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'end' }}>
            <div>
              <select
                value={currentItem.serviceCategoryId}
                onChange={e => {
                  const value = e.target.value
                  if (value === 'custom') {
                    setShowCustomFields(true)
                    setCurrentItem({ serviceCategoryId: '', quantity: 1 })
                  } else {
                    setShowCustomFields(false)
                    setCurrentItem({ ...currentItem, serviceCategoryId: value })
                  }
                }}
                style={{ width: '100%' }}
              >
                <option value="">Select Service Item</option>
                {serviceCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="custom" style={{ borderTop: '2px solid #FFD700', marginTop: '4px', fontWeight: 'bold', color: '#FFD700' }}>
                  ✨ Custom Item
                </option>
              </select>
            </div>
            {!showCustomFields && (
              <>
                <div>
                  <input
                    type="number"
                    min="0"
                    value={currentItem.perItemPrice}
                    onChange={e => setCurrentItem({ ...currentItem, perItemPrice: e.target.value })}
                    placeholder="Price"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                    placeholder="Qty"
                    style={{ width: '100%' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="add-item-btn"
                  style={{
                    padding: '12px 20px',
                    background: '#22577A',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  Add
                </button>
              </>
            )}
          </div>

          {showCustomFields && (
            <div style={{ marginTop: 12, padding: 16, background: '#fffef5', borderRadius: 8, border: '2px solid #FFD700' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 12 }}>
                ✨ Custom Item Details
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ fontSize: 13 }}>Item Name
                  <input
                    value={customItem.itemName}
                    onChange={e => setCustomItem({ ...customItem, itemName: e.target.value })}
                    placeholder="e.g. Special Service"
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </label>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomFields(false)
                      setCustomItem({ itemName: '', itemPrice: '', quantity: 1 })
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#e0e0e0',
                      color: '#333',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!customItem.itemName) {
                        setError('Please fill in item name')
                        return
                      }

                      setLoading(true)
                      setError('')

                      try {
                        const payload = {
                          name: customItem.itemName
                        }

                        await categoriesAPI.add(payload)

                        const res = await categoriesAPI.getAll()
                        const categories = res.data?.data || res.data || []
                        setServiceCategories(Array.isArray(categories) ? categories : [])

                        setShowCustomFields(false)
                        setCustomItem({ itemName: '' })

                      } catch (err) {
                        console.error('Error creating custom category:', err)
                        setError(err?.response?.data?.message || 'Failed to create custom category')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      background: '#FFD700',
                      color: '#333',
                      border: 'none',
                      borderRadius: 6,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      boxShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Creating...' : 'Add Custom Item'}
                  </button>
                </div>
              </div>
            </div>
          )}


          {selectedItems.length > 0 && (
            <div style={{
              marginTop: 12,
              padding: 12,
              background: '#f8f9fa',
              borderRadius: 8,
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#22577A', marginBottom: 8 }}>
                Selected Items:
              </div>
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: 6,
                    marginBottom: 6,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <span style={{ fontSize: 14, color: '#333' }}>
                    {getItemName(item.serviceCategoryId)}
                    <span style={{ color: '#666' }}> × {item.quantity}</span>
                    {item.perItemPrice > 0 && <span style={{ color: '#22577A', marginLeft: 8 }}>@ ₹{item.perItemPrice}</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.serviceCategoryId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: 18,
                      padding: '0 4px',
                      fontWeight: 600
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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