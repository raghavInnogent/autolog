import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { FaCar, FaTrophy } from 'react-icons/fa'
import { FiFileText, FiTool, FiAlertTriangle } from 'react-icons/fi'
import VehicleCard from '../components/VehicleCard'
import AddVehicleModal from '../components/AddVehicleModal'
import AddServiceModal from '../components/AddServiceModal'
import DocumentUploadModal from '../components/DocumentUploadModal'
import DocumentsCarousel from '../components/DocumentsCarousel'
import PrematureItemsModal from '../components/PrematureItemsModal'
import NotificationTable from '../components/NotificationTable'
import { vehiclesAPI, documentsAPI, notificationsAPI, analyticsAPI, prematureAPI } from '../services/api'
import '../styles/pages/HomePage.css'
import heroImage1 from '../assets/heroImage1.jpg'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

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
  const [showPrematureModal, setShowPrematureModal] = useState(false)
  const [top3Vehicles, setTop3Vehicles] = useState([])
  const [mostEfficientVehicle, setMostEfficientVehicle] = useState(null)
  const [prematureCount, setPrematureCount] = useState(0)

  const fetch = async () => {
    try {
      const [v, d, top3Res, efficientRes] = await Promise.all([
        vehiclesAPI.getAll(),
        documentsAPI.getAll(),
        analyticsAPI.getTop3MostUsedVehicles(),
        analyticsAPI.getMostEfficientVehicle()
      ])

      setVehicles(v.data || [])

      setDocs(d.data || [])

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

      try {
        const prematureRes = await prematureAPI.getTotalCount()
        setPrematureCount(prematureRes.data || 0)
      } catch (prematureError) {
        console.error('Error fetching premature count:', prematureError)
        setPrematureCount(0)
      }

      console.log('Top 3 Vehicles:', top3Res.data)
      console.log('Most Efficient Vehicle:', efficientRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => { fetch() }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    layout: {
      padding: {
        right: 20
      }
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 14,
          weight: 'bold'
        },
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex]; // Show name only
        },
        textAlign: 'center'
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex;
            const vehicle = top3Vehicles[index];
            return vehicle?.vehicleName || 'Unknown';
          },
          label: function (context) {
            const index = context.dataIndex;
            const vehicle = top3Vehicles[index];
            return [
              `Reg. No: ${vehicle?.registrationNumber || 'N/A'}`,
              `Total Mileage: ${vehicle?.totalMileageCovered?.toLocaleString() || 'N/A'} km`
            ];
          },
        },
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: 'bold' },
        padding: 12,
        displayColors: false,
      },
    },
    cutout: '58%',
  }

  const vehicleUsageData = {
    labels: top3Vehicles.map(v => v.vehicleName || v.model || 'Unknown'),
    datasets: [
      {
        data: top3Vehicles.map(v => v.usagePercentage || v.totalMileageCovered || 0),
        backgroundColor: ['#FFC300', '#22577A', '#FF5733', '#FFFFFF'],
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

            <div className="hero-section-item">
              <h2 className="hero-section-title">Most Used Vehicles</h2>
              <div className="hero-chart">
                {top3Vehicles.length > 0 ? (
                  <Doughnut data={vehicleUsageData} options={chartOptions} />
                ) : (
                  <p style={{ color: '#fff', textAlign: 'center' }}>No vehicle data available</p>
                )}
              </div>
            </div>

            <div className="hero-section-item">
              <h2 className="hero-section-title">Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">
                    <FaCar size={24} color="#FFC300" />
                    <span className="stat-description">Total Vehicles</span>
                  </div>
                  <span className="stat-number">{vehicles.length}</span>
                </div>

                <div className="stat-item">
                  <div className="stat-label">
                    <FiFileText size={24} color="#FFC300" />
                    <span className="stat-description">Total Documents</span>
                  </div>
                  <span className="stat-number">{docs.length}</span>
                </div>

                <div className="stat-item">
                  <div className="stat-label">
                    <FiTool size={24} color="#FFC300" />
                    <span className="stat-description">Services This Month</span>
                  </div>
                  <span className="stat-number">0</span>
                </div>

                <div className="stat-item">
                  <div className="stat-label">
                    <FiAlertTriangle size={24} color="#FFC300" />
                    <span className="stat-description">Premature Services</span>
                  </div>
                  <span className="stat-number">{prematureCount}</span>
                </div>
              </div>

              <div className="quick-links-section">
                <h3 className="quick-links-title">Quick links</h3>
                <div className="quick-links-buttons">
                  <button className="hero-action-btn" onClick={() => setShowAdd(true)}>
                    <span className="btn-text">Add Vehicle</span>
                  </button>
                  <button className="hero-action-btn" onClick={() => setShowDocumentModal(true)}>
                    <span className="btn-text">Upload Document</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="hero-section-item">
              <h2 className="hero-section-title">Most Efficient Vehicle</h2>
              <div className="efficient-vehicle-card">
                {mostEfficientVehicle ? (
                  <>
                    <div className="efficient-vehicle-header">
                      <div className="efficient-vehicle-badge">
                        <FaTrophy size={40} color="#FFC300" />
                      </div>
                      <div className="efficient-vehicle-title">
                        <h3 className="efficient-vehicle-name">{mostEfficientVehicle.vehicleName || 'N/A'}</h3>
                        <p className="efficient-vehicle-desc">Best mileage per cost ratio</p>
                      </div>
                    </div>
                    <div className="efficient-vehicle-stats">
                      <div className="efficient-stat-line">
                        <span className="efficient-stat-label">Mileage - </span>
                        <span className="efficient-stat-value">{mostEfficientVehicle.latestMileage?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="efficient-stat-line">
                        <span className="efficient-stat-label">Total Service Cost - </span>
                        <span className="efficient-stat-value">₹{mostEfficientVehicle.totalServiceCost?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="efficient-stat-line">
                        <span className="efficient-stat-label">Cost Efficiency - </span>
                        <span className="efficient-stat-value">₹{mostEfficientVehicle.runningCostPerKm?.toFixed(2) || '0'}/km</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '40px' }}>
                    <FaCar size={48} style={{ display: 'block', margin: '0 auto 16px auto', opacity: 0.5 }} />
                    <p>Add vehicles to see efficiency metrics</p>
                  </div>
                )}
              </div>

              <div className="quick-links-section">
                <div className="quick-links-buttons">
                  <button className="hero-action-btn" onClick={() => setShowServiceModal(true)}>
                    <span className="btn-text">Add Service </span>
                  </button>
                  <button className="hero-action-btn" onClick={() => setShowPrematureModal(true)}>
                    <span className="btn-text">Check Prematures</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <div className="page-content">
        <NotificationTable />
      </div>

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} onCreated={fetch} />}
      {showServiceModal && <AddServiceModal onClose={() => setShowServiceModal(false)} onCreated={fetch} />}
      {showDocumentModal && <DocumentUploadModal onClose={() => setShowDocumentModal(false)} onUploaded={fetch} />}
      {showPrematureModal && <PrematureItemsModal onClose={() => setShowPrematureModal(false)} />}
    </div >
  )
}
