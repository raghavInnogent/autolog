import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import AddVehicleModal from '../components/AddVehicleModal'
import DocumentCard from '../components/DocumentCard'
import DocumentsCarousel from '../components/DocumentsCarousel'
import ServiceTable from '../components/ServiceTable'
import { vehiclesAPI, documentsAPI } from '../services/api'
import { servicesAPI } from '../services/api'
import '../styles/pages/HomePage.css'

function UpcomingPanel() {
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await servicesAPI.getAll()
        const rows = res.data || []
        const now = new Date()
        const next30 = new Date(); next30.setDate(now.getDate() + 30)
        const u = rows.filter(r => {
          const d = new Date(r.date)
          return d >= now && d <= next30
        }).sort((a, b) => new Date(a.date) - new Date(b.date))
        setUpcoming(u)
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading...</div>
  if (upcoming.length === 0) return <div style={{ color: 'var(--muted)' }}>No upcoming services</div>
  return (
    <div className="service-table">
      <table className="service-list" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Workshop</th>
            <th>Mileage</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {upcoming.map((s, i) => (
            <tr key={i}>
              <td>{s.date}</td>
              <td>{s.type}</td>
              <td>{s.workshop}</td>
              <td>{s.mileage ?? '-'}</td>
              <td>{s.cost ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HomePage() {
  const [vehicles, setVehicles] = useState([])
  const [docs, setDocs] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const nav = useNavigate()

  const fetch = async () => {
    try {
      const v = await vehiclesAPI.getAll()
      setVehicles(v.data || [])
      const d = await documentsAPI.getAll()
      setDocs(d.data || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetch() }, [])

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <div style={{ height: 220, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(90deg, rgba(30,144,255,0.12), rgba(255,255,255,0.02))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 28 }}>Smart Vehicle Maintenance Tracking</h1>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Vehicles</h2>
        <div className="vehicle-grid">
          {vehicles.slice(0, 9).map(v => <VehicleCard key={v.id} vehicle={v} />)}
          <VehicleCard vehicle={null} onAdd={() => setShowAdd(true)} />
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <div className="documents-header-row">
          <h2 style={{ margin: 0 }}>Documents</h2>
          <button type="button" onClick={()=>nav('/documents')} className="navy-btn">View all documents</button>
        </div>
        {docs.length > 0 ? (
          <DocumentsCarousel docs={docs} />
        ) : (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
            No documents added yet.
          </div>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', alignItems: 'center', marginBottom: 12, gap: 12 }}>
          <h2 style={{ margin: 0 }}>Servicings</h2>
          <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--nav-title)', justifySelf: 'start' }}>Upcoming</h2>
        </div>
        <div className="service-wrap">
          <ServiceTable />
          <div style={{ width: 360, background: 'var(--card)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
            <UpcomingPanel />
          </div>
        </div>
      </section>

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onCreated={fetch} />}
    </div>
  )
}
