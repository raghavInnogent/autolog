import { useState, useEffect } from 'react'
import { servicesAPI, vehiclesAPI, serviceCategoriesAPI } from '../services/api'
import '../styles/components/AddServiceModal.css'

export default function AddServiceModal({ onClose, onCreated }) {
  const [vehicles, setVehicles] = useState([])
  const [serviceCategories, setServiceCategories] = useState([])
  const [form, setForm] = useState({
    vehicleId: '',
    dateOfService: '',
    workshop: '',
    mileage: '',
    cost: '',
    invoice: '',
    type: ''
  })
  const [selectedItems, setSelectedItems] = useState([])
  const [currentItem, setCurrentItem] = useState({ serviceCategoryId: '', quantity: 1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    vehiclesAPI.getAll().then(res => setVehicles(res.data || [])).catch(console.error)
    serviceCategoriesAPI.getAll()
      .then(res => {
        console.log('Categories response:', res)
        const categories = res.data?.data || res.data || []
        console.log('Categories:', categories)
        setServiceCategories(Array.isArray(categories) ? categories : [])
      })
      .catch(console.error)
  }, [])

  const addItem = () => {
    if (!currentItem.serviceCategoryId || Number(currentItem.quantity) <= 0) {
      setError('Please select an item and enter a valid quantity')
      return
    }

    if (selectedItems.some(item => item.serviceCategoryId === currentItem.serviceCategoryId)) {
      setError('This item is already added')
      return
    }

    setSelectedItems([...selectedItems, {
      serviceCategoryId: Number(currentItem.serviceCategoryId),
      quantity: Number(currentItem.quantity)
    }])
    setCurrentItem({ serviceCategoryId: '', quantity: 1 })
    setError('')
  }

  const removeItem = (serviceCategoryId) => {
    setSelectedItems(selectedItems.filter(item => item.serviceCategoryId !== serviceCategoryId))
  }

  const getItemName = (serviceCategoryId) => {
    const item = serviceCategories.find(cat => cat.id === Number(serviceCategoryId))
    return item ? item.name : 'Unknown'
  }

  const submit = async (e) => {
    e.preventDefault()

    if (selectedItems.length === 0) {
      setError('Please add at least one service item')
      return
    }

    setLoading(true)
    setError('')
    try {
      const servicedItems = selectedItems.map(item => ({
        serviceCategoryId: Number(item.serviceCategoryId),
        quantity: Number(item.quantity)
      }))

      const payload = {
        vehicleId: Number(form.vehicleId),
        cost: form.cost ? Number(form.cost) : undefined,
        dateOfService: form.dateOfService,
        workshop: form.workshop,
        mileage: form.mileage ? Number(form.mileage) : undefined,
        invoice: form.invoice,
        type: form.type,
        servicedItems: servicedItems
      }

      console.log('Payload being sent:', JSON.stringify(payload, null, 2))
      console.log('ServicedItems:', servicedItems)

      await servicesAPI.create(payload)
      onCreated && onCreated()
      onClose && onClose()
    } catch (err) {
      console.error('Error creating service:', err)
      console.error('Error response:', err?.response?.data)
      setError(err?.response?.data?.message || 'Failed to add service record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-service-modal">
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Add Service Record</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Vehicle
            <select
              value={form.vehicleId}
              onChange={e => setForm({ ...form, vehicleId: e.target.value })}
              required
              style={{ width: '100%' }}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.company} {v.model} - {v.registrationNumber}
                </option>
              ))}
            </select>
          </label>
          <label>Service Date
            <input
              type="date"
              value={form.dateOfService}
              onChange={e => setForm({ ...form, dateOfService: e.target.value })}
              required
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Workshop
            <input
              value={form.workshop}
              onChange={e => setForm({ ...form, workshop: e.target.value })}
              placeholder="e.g. Service Center Name"
              required
            />
          </label>
          <label>Service Type
            <input
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              placeholder="e.g. Full Service"
              required
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>Mileage (km)
            <input
              type="number"
              value={form.mileage}
              onChange={e => setForm({ ...form, mileage: e.target.value })}
              placeholder="e.g. 15000"
            />
          </label>
          <label>Cost
            <input
              type="number"
              value={form.cost}
              onChange={e => setForm({ ...form, cost: e.target.value })}
              placeholder="e.g. 5000"
            />
          </label>
        </div>

        <label>Invoice Number/URL
          <input
            value={form.invoice}
            onChange={e => setForm({ ...form, invoice: e.target.value })}
            placeholder="e.g. INV-2025-55672"
          />
        </label>

        <div style={{ marginTop: 8 }}>
          <label style={{ marginBottom: 8 }}>Service Items</label>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'end' }}>
            <div>
              <select
                value={currentItem.serviceCategoryId}
                onChange={e => setCurrentItem({ ...currentItem, serviceCategoryId: e.target.value })}
                style={{ width: '100%', marginTop: 8 }}
              >
                <option value="">Select Service Item</option>
                {serviceCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                min="1"
                value={currentItem.quantity}
                onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                placeholder="Qty"
                style={{ width: '100%', marginTop: 8 }}
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
                fontSize: 14,
                marginTop: 8
              }}
            >
              Add
            </button>
          </div>


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
                    {getItemName(item.serviceCategoryId)} <span style={{ color: '#666' }}>× {item.quantity}</span>
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

        {error && <div style={{ color: 'crimson', fontSize: 13, marginTop: 8 }}>{error}</div>}

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
            {loading ? 'Saving...' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  )
}