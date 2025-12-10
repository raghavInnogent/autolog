import { useState, useEffect } from 'react'
import { servicesAPI } from '../services/api'
import '../styles/components/ConfirmServiceModal.css'

export default function ConfirmServiceModal({ data, onClose, onCreated }) {
    const [form, setForm] = useState({
        vehicleCompany: '',
        vehicleModel: '',
        vehicleNo: '',
        cost: '',
        dateOfService: '',
        workshop: '',
        mileage: '',
        invoice: '',
        type: ''
    })
    const [servicedItems, setServicedItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Initialize form with data from API
    useEffect(() => {
        if (data) {
            setForm({
                vehicleCompany: data.vehicleCompany || '',
                vehicleModel: data.vehicleModel || '',
                vehicleNo: data.vehicleNo || '',
                cost: data.cost || '',
                dateOfService: data.dateOfService || '',
                workshop: data.workshop || '',
                mileage: data.mileage || '',
                invoice: data.invoice || '',
                type: data.type || ''
            })
            setServicedItems(data.servicedItems || [])
        }
    }, [data])

    const updateItem = (index, field, value) => {
        const updated = [...servicedItems]
        updated[index] = { ...updated[index], [field]: value }
        setServicedItems(updated)
    }

    const removeItem = (index) => {
        setServicedItems(servicedItems.filter((_, i) => i !== index))
    }

    const addNewItem = () => {
        setServicedItems([...servicedItems, {
            itemName: '',
            quantity: 1,
            expiryInMonth: null,
            perItemCost: 0
        }])
    }

    const submit = async (e) => {
        e.preventDefault()

        if (servicedItems.length === 0) {
            setError('Please add at least one service item')
            return
        }

        setLoading(true)
        setError('')

        try {
            const payload = {
                vehicleCompany: form.vehicleCompany || " ",
                vehicleModel: form.vehicleModel || " ",
                vehicleNo: form.vehicleNo || " ",
                cost: form.cost ? Number(form.cost) : 0,
                dateOfService: form.dateOfService || " ",
                workshop: form.workshop || " ",
                mileage: form.mileage ? Number(form.mileage) : 0,
                invoice: form.invoice || " ",
                type: form.type || " ",
                servicedItems: servicedItems.map(item => ({
                    itemName: item.itemName || " ",
                    quantity: item.quantity ? Number(item.quantity) : 0,
                    expiryInMonth: item.expiryInMonth ? Number(item.expiryInMonth) : 0,
                    perItemCost: item.perItemCost ? Number(item.perItemCost) : 0
                }))
            }

            console.log('Submitting payload:', JSON.stringify(payload, null, 2))

            await servicesAPI.createServiceViaInvoice(payload)
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
        <div className="confirm-service-modal">
            <form onSubmit={submit}>
                <h3>🔍 Confirm Details</h3>
                <p>
                    Review and edit the extracted invoice data before saving
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
                    <label>Company
                        <input
                            value={form.vehicleCompany}
                            onChange={e => setForm({ ...form, vehicleCompany: e.target.value })}
                            placeholder="e.g. Toyota"
                            required
                        />
                    </label>
                    <label>Model
                        <input
                            value={form.vehicleModel}
                            onChange={e => setForm({ ...form, vehicleModel: e.target.value })}
                            placeholder="e.g. Camry"
                            required
                        />
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label>Vehicle Number
                        <input
                            value={form.vehicleNo}
                            onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
                            placeholder="e.g. ABC-123"
                            required
                        />
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
                    <label>Service Type
                        <input
                            value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                            placeholder="e.g. GENERAL_SERVICE"
                            required
                        />
                    </label>
                    <label>Workshop
                        <input
                            value={form.workshop}
                            onChange={e => setForm({ ...form, workshop: e.target.value })}
                            placeholder="e.g. Service Center Name"
                            required
                        />
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label>Invoice Number
                        <input
                            value={form.invoice}
                            onChange={e => setForm({ ...form, invoice: e.target.value })}
                            placeholder="e.g. INV-2025-001"
                        />
                    </label>
                    <label>Mileage (km)
                        <input
                            type="number"
                            value={form.mileage}
                            onChange={e => setForm({ ...form, mileage: e.target.value })}
                            placeholder="e.g. 15000"
                        />
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label>Total Cost
                        <input
                            type="number"
                            value={form.cost}
                            onChange={e => setForm({ ...form, cost: e.target.value })}
                            placeholder="e.g. 5000"
                        />
                    </label>
                </div>

                <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ margin: 0 }}>Service Items</label>
                        <button
                            type="button"
                            onClick={addNewItem}
                            style={{
                                padding: '6px 12px',
                                background: '#22577A',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 600
                            }}
                        >
                            + Add Item
                        </button>
                    </div>

                    {servicedItems.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Cost/Item</th>
                                        <th>Expiry (months)</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servicedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    value={item.itemName}
                                                    onChange={e => updateItem(index, 'itemName', e.target.value)}
                                                    placeholder="Item name"
                                                    required
                                                    style={{ width: '100%', minWidth: 150 }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                    required
                                                    style={{ width: '100%', minWidth: 70 }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.perItemCost}
                                                    onChange={e => updateItem(index, 'perItemCost', e.target.value)}
                                                    placeholder="0"
                                                    style={{ width: '100%', minWidth: 80 }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.expiryInMonth || ''}
                                                    onChange={e => updateItem(index, 'expiryInMonth', e.target.value || null)}
                                                    placeholder="N/A"
                                                    style={{ width: '100%', minWidth: 80 }}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#dc3545',
                                                        cursor: 'pointer',
                                                        fontSize: 20,
                                                        padding: 4,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
