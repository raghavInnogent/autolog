import React, { useEffect, useState } from 'react'
import { servicesAPI } from '../services/api'
import AddServiceModal from './AddServiceModal'
import '../styles/components/ServiceTable.css'

export default function ServiceTable() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [openAdd, setOpenAdd] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const params = {}
      if (from) params.from = from
      if (to) params.to = to
      const res = await servicesAPI.getAll(params)
      setRows(res.data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0)
  }

  return (
    <div className="service-table">
      <div className="service-filters">
        <div className="filter-group">
          <label>From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <label>To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          <button className="navy-btn" onClick={fetch}>Filter</button>
        </div>
        <div>
          <button className="navy-btn" onClick={() => setOpenAdd(true)}>+ Add Service Record</button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading...</div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No service records found.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="service-list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Items</th>
                <th>Workshop</th>
                <th>Mileage</th>
                <th>Cost</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.type || '-'}</td>
                  <td>
                    {r.items ? (
                      Array.isArray(r.items)
                        ? r.items.map(item => item.name || item).join(', ')
                        : r.items
                    ) : '-'}
                  </td>
                  <td>{r.workshop}</td>
                  <td>{r.mileage ? `${r.mileage} km` : '-'}</td>
                  <td className="service-cost">{formatCurrency(r.cost)}</td>
                  <td>{r.invoice ? <a href={r.invoice} target="_blank" rel="noopener noreferrer" className="view-link">View</a> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openAdd && <AddServiceModal onClose={() => setOpenAdd(false)} onCreated={fetch} />}
    </div>
  )
}
