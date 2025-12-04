import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { FaCar, FaTrophy } from 'react-icons/fa'
import { FiFileText, FiTool, FiAlertTriangle } from 'react-icons/fi'
import VehicleCard from '../components/VehicleCard'
import AddVehicleModal from '../components/AddVehicleModal'
import AddServiceModal from '../components/AddServiceModal'
import DocumentUploadModal from '../components/DocumentUploadModal'
import DocumentsCarousel from '../components/DocumentsCarousel'
import UpcomingSchedules from '../components/UpcomingSchedules'
import { vehiclesAPI, documentsAPI } from '../services/api'
import '../styles/pages/HomePage.css'
import heroImage1 from '../assets/heroImage1.jpg'

ChartJS.register(ArcElement, Tooltip, Legend)

const vehicleUsageData = {
  labels: ['Toyota Camry', 'Honda Civic', 'Ford F-150', 'Others'],
  datasets: [
    {
      data: [35, 25, 20, 20],
      backgroundColor: ['#FFC300', '#22577A', '#FF5733', '#ffffff'],
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 2,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1,
  layout: {
    padding: {
      right: 180
    }
  },
  plugins: {
    legend: {
      position: 'right',
      align: 'center',
      labels: {
        color: '#fff',
        font: { size: 20, weight: '600' },
        boxWidth: 32,
        boxHeight: 32,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.parsed}%`
        },
      },
      bodyFont: { size: 16 },
    },
  },
  cutout: '58%',
}

export default function UserHomePage() {
  const [vehicles, setVehicles] = useState([])
  const [docs, setDocs] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)

  const fetch = async () => {
    try {
      const v = await vehiclesAPI.getAll()
      setVehicles(v.data || [])
      const d = await documentsAPI.getAll()
      setDocs(d.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetch() }, [])

  return (
    <div>
      <section className="hero-section">
        <div className="hero-banner">
          <div className="hero-bg-image active" style={{ backgroundImage: `url(${heroImage1})` }} />
          <div className="hero-overlay" />
          <div className="hero-content-wrapper">
            <div className="hero-chart-container">
              <h2 className="hero-chart-title">Your Most Used Vehicles</h2>
              <div className="hero-chart">
                <Doughnut data={vehicleUsageData} options={chartOptions} />
              </div>
            </div>

            <div className="hero-actions">
              <button className="hero-action-btn" onClick={() => setShowAdd(true)}>
                <span className="btn-text">Add Vehicle</span>
              </button>
              <button className="hero-action-btn" onClick={() => setShowDocumentModal(true)}>
                <span className="btn-text">Upload Document</span>
              </button>
              <button className="hero-action-btn" onClick={() => setShowServiceModal(true)}>
                <span className="btn-text">Add Service Record</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="page-content">
        {/* Quick Stats Section */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(34, 87, 122, 0.1)' }}>
                <FaCar size={28} color="#22577A" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{vehicles.length}</div>
                <div className="stat-label">Total Vehicles</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 195, 0, 0.1)' }}>
                <FiFileText size={28} color="#B38B00" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{docs.length}</div>
                <div className="stat-label">Total Documents</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(34, 87, 122, 0.1)' }}>
                <FiTool size={28} color="#22577A" />
              </div>
              <div className="stat-content">
                <div className="stat-value">0</div>
                <div className="stat-label">Services This Month</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 195, 0, 0.1)' }}>
                <FiAlertTriangle size={28} color="#B38B00" />
              </div>
              <div className="stat-content">
                <div className="stat-value">0</div>
                <div className="stat-label">Pending Alerts</div>
              </div>
            </div>
          </div>
        </section>

        {/* Most Efficient Vehicle Section */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Most Efficient Vehicle</h2>
          <div className="efficient-vehicle-card">
            {vehicles.length > 0 ? (
              <>
                <div className="efficient-vehicle-badge">
                  <FaTrophy size={40} color="#FFC300" />
                </div>
                <div className="efficient-vehicle-info">
                  <h3 className="efficient-vehicle-name">{vehicles[0]?.model || 'N/A'}</h3>
                  <p className="efficient-vehicle-desc">Best mileage per cost ratio</p>
                  <div className="efficient-vehicle-stats">
                    <div className="efficient-stat">
                      <span className="efficient-stat-label">Avg. Mileage</span>
                      <span className="efficient-stat-value">25 km/l</span>
                    </div>
                    <div className="efficient-stat">
                      <span className="efficient-stat-label">Total Distance</span>
                      <span className="efficient-stat-value">15,000 km</span>
                    </div>
                    <div className="efficient-stat">
                      <span className="efficient-stat-label">Cost Efficiency</span>
                      <span className="efficient-stat-value">₹2.5/km</span>
                    </div>
                  </div>
                </div>
                <div className="efficient-vehicle-image">
                  <img src={vehicles[0]?.image || '/vehicle-placeholder.jpg'} alt={vehicles[0]?.model || 'Vehicle'} />
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>
                <FaCar size={48} style={{ display: 'block', margin: '0 auto 16px auto', opacity: 0.5 }} />
                <p>Add vehicles to see efficiency metrics</p>
              </div>
            )}
          </div>
        </section>

        {/* Vehicles Section */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Vehicles</h2>
            <a href="/vehicles" className="view-all-btn">
              View All
            </a>
          </div>
          <div className="vehicle-grid">
            {vehicles.slice(0, 3).map(v => <VehicleCard key={v.id} vehicle={v} />)}
            <VehicleCard vehicle={null} onAdd={() => setShowAdd(true)} />
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
          <div className="documents-header-row">
            <h2 style={{ margin: 0 }}>Documents</h2>
            <a href="/documents" className="view-all-btn">View All</a>
          </div>

          {docs.length > 0 ? (
            <DocumentsCarousel docs={docs} />
          ) : (
            <div style={{
              padding: 20,
              textAlign: 'center',
              color: 'var(--muted)',
              background: 'var(--card)',
              borderRadius: 12,
              border: '1px solid var(--border)'
            }}>
              No documents added yet.
            </div>
          )}
        </section>

        {/* Upcoming Schedules Section */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16 }}>Upcoming Schedules</h2>
          <UpcomingSchedules />
        </section>
      </div >

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onCreated={fetch} />}
      {showServiceModal && <AddServiceModal onClose={() => setShowServiceModal(false)} onCreated={fetch} />}
      {showDocumentModal && <DocumentUploadModal onClose={() => setShowDocumentModal(false)} onUploaded={fetch} />}
    </div >
  )
}
