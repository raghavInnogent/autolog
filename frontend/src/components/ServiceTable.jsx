import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { servicesAPI, vehiclesAPI } from '../services/api'
import AddServiceModal from './AddServiceModal'
import InvoiceUploadModal from './InvoiceUploadModal'
import ConfirmServiceModal from './ConfirmServiceModal'
import '../styles/components/ServiceTable.css'

export default function ServiceTable() {
  const [allRows, setAllRows] = useState([]) // Store all services
  const [rows, setRows] = useState([]) // Filtered services to display
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpload, setOpenUpload] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const navigate = useNavigate()

  const fetchVehicles = async () => {
    try {
      const res = await vehiclesAPI.getAll()
      setVehicles(res.data || [])
    } catch (err) {
      console.error('Error fetching vehicles:', err)
    }
  }

  const fetchAllServices = async () => {
    setLoading(true)
    try {
      const res = await servicesAPI.getAll({})
      const services = res.data || []
      setAllRows(services)
      setRows(services) // Initially show all
    } catch (err) {
      console.error('Fetch error:', err)
    } finally { setLoading(false) }
  }

  // Client-side filter function
  const applyFilters = () => {
    let filtered = [...allRows]

    // Filter by vehicle
    if (vehicleId) {
      filtered = filtered.filter(service =>
        service.vehicle?.id === parseInt(vehicleId)
      )
    }

    // Filter by date range
    if (from) {
      filtered = filtered.filter(service => {
        const serviceDate = service.dateOfService || service.date
        return serviceDate >= from
      })
    }

    if (to) {
      filtered = filtered.filter(service => {
        const serviceDate = service.dateOfService || service.date
        return serviceDate <= to
      })
    }

    console.log('Filtered results:', filtered.length, 'out of', allRows.length)
    setRows(filtered)
  }

  useEffect(() => {
    fetchVehicles()
    fetchAllServices()
  }, [])

  const getVehicleName = (service) => {
    if (service.vehicle) {
      return `${service.vehicle.company || ''} ${service.vehicle.model || ''}`.trim() || 'Unknown Vehicle'
    }
    return 'Unknown Vehicle'
  }

  const handleDataExtracted = (data) => {
    console.log('Extracted data received:', data)
    console.log('Setting confirmData state...')
    setConfirmData(data)
    console.log('confirmData state set! Modal should appear now.')
  }

  return (
    <div className="service-table">
      <div className="service-filters">
        <div className="filter-group">
          <label>Vehicle</label>
          <select value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
            <option value="">All Vehicles</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.company} {v.model} - {v.registrationNumber}
              </option>
            ))}
          </select>
          <label>From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <label>To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          <button className="navy-btn" onClick={applyFilters}>Filter</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="navy-btn" onClick={() => setOpenUpload(true)}>📄 Upload Invoice</button>
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
                <th>Vehicle</th>
                <th>Workshop</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.dateOfService || r.date || '-'}</td>
                  <td>{getVehicleName(r)}</td>
                  <td>{r.workshop || '-'}</td>
                  <td>
                    <button
                      className="view-link"
                      onClick={() => navigate(`/services/${r.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openAdd && <AddServiceModal onClose={() => setOpenAdd(false)} onCreated={fetchAllServices} />}
      {openUpload && <InvoiceUploadModal onClose={() => setOpenUpload(false)} onDataExtracted={handleDataExtracted} />}
      {confirmData && <ConfirmServiceModal data={confirmData} onClose={() => setConfirmData(null)} onCreated={fetchAllServices} />}
    </div>
  )
}
