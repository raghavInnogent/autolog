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
import NotificationTable from '../components/NotificationTable'
import { vehiclesAPI, documentsAPI, notificationsAPI, analyticsAPI } from '../services/api'
import '../styles/pages/HomePage.css'
import heroImage1 from '../assets/heroImage1.jpg'

ChartJS.register(ArcElement, Tooltip, Legend)

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
  const [notificationCounts, setNotificationCounts] = useState({
    highPriorityCount: 0,
    unreadCount: 0,
    activeCount: 0
  })
  const [showAdd, setShowAdd] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [top3Vehicles, setTop3Vehicles] = useState([])
  const [mostEfficientVehicle, setMostEfficientVehicle] = useState(null)

  const fetch = async () => {
    try {
      const [v, d, top3Res, efficientRes] = await Promise.all([
        vehiclesAPI.getAll(),
        documentsAPI.getAll(),
        analyticsAPI.getTop3MostUsedVehicles(),
        analyticsAPI.getMostEfficientVehicle()
      ])

      setVehicles(v.data || [])

      // Fetch documents
      setDocs(d.data || [])

      // Fetch notification counts
      try {
        const n = await notificationsAPI.getCounts()
        setNotificationCounts(n.data || {
          highPriorityCount: 0,
          unreadCount: 0,
          activeCount: 0
        })
      } catch (notifError) {
        console.error('Error fetching notification counts:', notifError)

      }
      setTop3Vehicles(top3Res.data || [])
      setMostEfficientVehicle(efficientRes.data || null)

      console.log('Top 3 Vehicles:', top3Res.data)
      console.log('Most Efficient Vehicle:', efficientRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => { fetch() }, [])

  // Generate dynamic vehicle usage data for chart
  const vehicleUsageData = {
    labels: top3Vehicles.map(v => v.vehicleName || v.model || 'Unknown'),
    datasets: [
      {
        data: top3Vehicles.map(v => v.usagePercentage || v.serviceCount || 0),
        backgroundColor: ['#FFC300', '#22577A', '#FF5733', '#ffffff'],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
      },
    ],
  }

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
                {top3Vehicles.length > 0 ? (
                  <Doughnut data={vehicleUsageData} options={chartOptions} />
                ) : (
                  <p style={{ color: '#fff', textAlign: 'center' }}>No vehicle data available</p>
                )}
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
            {mostEfficientVehicle ? (
              <>
                <div className="efficient-vehicle-badge">
                  <FaTrophy size={40} color="#FFC300" />
                </div>
                <div className="efficient-vehicle-info">
                  <h3 className="efficient-vehicle-name">{mostEfficientVehicle.vehicleName || 'N/A'}</h3>
                  <p className="efficient-vehicle-desc">Best mileage per cost ratio</p>
                  <div className="efficient-vehicle-stats">
                    <div className="efficient-stat">
                      <span className="efficient-stat-label">Mileage</span>
                      <span className="efficient-stat-value">{mostEfficientVehicle.latestMileage?.toLocaleString() || 'N/A'} km</span>
                    </div>
                    <div className="efficient-stat">
                      <span className="efficient-stat-label">Total Service Cost</span>
                      <span className="efficient-stat-value">₹{mostEfficientVehicle.totalServiceCost?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="efficient-stat">
                      <span className="efficient-stat-label">Cost Efficiency</span>
                      <span className="efficient-stat-value">₹{mostEfficientVehicle.runningCostPerKm?.toFixed(2) || '0'}/km</span>
                    </div>
                  </div>
                </div>
                <div className="efficient-vehicle-image">
                  <img src={mostEfficientVehicle.image || '/vehicle-placeholder.jpg'} alt={mostEfficientVehicle.vehicleName || 'Vehicle'} />
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

        {/* Notification Table */}
        <NotificationTable />
      </div>

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onCreated={fetch} />}
      {showServiceModal && <AddServiceModal onClose={() => setShowServiceModal(false)} onCreated={fetch} />}
      {showDocumentModal && <DocumentUploadModal onClose={() => setShowDocumentModal(false)} onUploaded={fetch} />}
    </div >
  )
}
