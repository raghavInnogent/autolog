import React, { useState, useEffect, useMemo } from 'react'
import { vehiclesAPI, analyticsAPI, servicesAPI } from '../services/api'
import { FiTrendingUp, FiActivity, FiDollarSign, FiCalendar, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/CompareVehiclesPage.css'

export default function CompareVehiclesPage() {
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState([])
    const [vehicleExpenditure, setVehicleExpenditure] = useState([])
    const [costPerKmData, setCostPerKmData] = useState([])
    const [loading, setLoading] = useState(true)
    const [serviceCounts, setServiceCounts] = useState({})

    const [selectedId1, setSelectedId1] = useState('')
    const [selectedId2, setSelectedId2] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, expendRes, costRes] = await Promise.all([
                    vehiclesAPI.getAll(),
                    analyticsAPI.getVehicleWiseExpenditure(),
                    analyticsAPI.getCostPerKm()
                ])
                setVehicles(vehiclesRes.data || [])
                setVehicleExpenditure(expendRes.data || [])
                setCostPerKmData(costRes.data || [])
            } catch (err) {
                console.error('Failed to fetch data for comparison:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchCounts = async () => {
            if (!selectedId1 && !selectedId2) return

            const counts = { ...serviceCounts }

            const fetchForVehicle = async (id) => {
                if (id && !counts[id]) {
                    try {
                        const sRes = await servicesAPI.getAll({ vehicleId: id })
                        const sData = sRes.data?.data || sRes.data || []
                        counts[id] = Array.isArray(sData) ? sData.length : 0
                    } catch (e) {
                        console.error(`Error fetching services for vehicle ${id}:`, e)
                        counts[id] = 0
                    }
                }
            }

            await Promise.all([
                fetchForVehicle(selectedId1),
                fetchForVehicle(selectedId2)
            ])

            setServiceCounts({ ...counts })
        }
        fetchCounts()
    }, [selectedId1, selectedId2])

    const getStats = (id) => {
        if (!id) return null
        const vehicle = vehicles.find(v => v.id === Number(id))
        if (!vehicle) return null

        const fullName = `${vehicle.company} ${vehicle.model}`
        const expend = vehicleExpenditure.find(item => item.vehicleName === fullName || item.vehicleName.includes(vehicle.model))
        const costKm = costPerKmData.find(item => item.vehicleName === fullName || item.vehicleName.includes(vehicle.model))

        const totalCost = expend ? Number(expend.totalExpenditure) : 0
        const count = serviceCounts[id] || 0
        const costPerService = count > 0 ? totalCost / count : 0

        return {
            details: vehicle,
            totalCost,
            costPerKm: costKm ? Number(costKm.runningCostPerKm) : 0,
            serviceCount: count,
            costPerService
        }
    }

    const stats1 = useMemo(() => getStats(selectedId1), [selectedId1, vehicles, vehicleExpenditure, costPerKmData, serviceCounts])
    const stats2 = useMemo(() => getStats(selectedId2), [selectedId2, vehicles, vehicleExpenditure, costPerKmData, serviceCounts])

    // Helper to render comparison row
    const renderRow = (label, val1, val2, formatFn, lowerIsBetter = false) => {
        const createVal = (v) => formatFn ? formatFn(v) : v
        let color1 = ''
        let color2 = ''

        if (val1 !== null && val2 !== null && typeof val1 === 'number' && typeof val2 === 'number' && val1 !== val2) {
            const better1 = lowerIsBetter ? val1 < val2 : val1 > val2
            color1 = better1 ? 'text-green' : 'text-red'
            color2 = better1 ? 'text-red' : 'text-green'
        }

        return (
            <div className="comparison-row">
                <div className="comp-cell left">
                    <span className={color1}>{val1 !== undefined && val1 !== null ? createVal(val1) : '-'}</span>
                </div>
                <div className="comp-label">{label}</div>
                <div className="comp-cell right">
                    <span className={color2}>{val2 !== undefined && val2 !== null ? createVal(val2) : '-'}</span>
                </div>
            </div>
        )
    }

    if (loading) return <div className="loading-state">Loading comparison data...</div>

    return (
        <div className="compare-page">
            <div className="compare-header">
                <button className="back-btn" onClick={() => navigate('/analysis')}>
                    <FiArrowLeft /> Back to Analysis
                </button>
                <h2>Compare Vehicles</h2>
                <p>Select two vehicles to compare their performance metrics</p>
            </div>

            <div className="compare-selectors">
                <div className="selector-box">
                    <label>Vehicle 1</label>
                    <div className="custom-select-wrapper">
                        <select
                            value={selectedId1}
                            onChange={(e) => setSelectedId1(e.target.value)}
                        >
                            <option value="">Select a vehicle</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id} disabled={Number(v.id) === Number(selectedId2)}>
                                    {v.company} {v.model} ({v.registrationNumber})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="vs-badge">VS</div>

                <div className="selector-box">
                    <label>Vehicle 2</label>
                    <select
                        value={selectedId2}
                        onChange={(e) => setSelectedId2(e.target.value)}
                    >
                        <option value="">Select a vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id} disabled={Number(v.id) === Number(selectedId1)}>
                                {v.company} {v.model} ({v.registrationNumber})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="comparison-content">
                {(stats1 && stats2) ? (
                    <div className="comparison-card">
                        <div className="comparison-grid">
                            {/* Header Images/Names */}
                            <div className="comparison-row header-row">
                                <div className="comp-cell left" style={{ flexDirection: 'column', gap: 12 }}>
                                    <div style={{ width: 120, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f0f0f0' }}>
                                        {stats1.details.image ? (
                                            <img src={stats1.details.image} alt="v1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3>{stats1.details.company} {stats1.details.model}</h3>
                                        <span className="reg-no">{stats1.details.registrationNumber}</span>
                                    </div>
                                </div>
                                <div className="comp-label"></div>
                                <div className="comp-cell right" style={{ flexDirection: 'column', gap: 12 }}>
                                    <div style={{ width: 120, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f0f0f0' }}>
                                        {stats2.details.image ? (
                                            <img src={stats2.details.image} alt="v2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3>{stats2.details.company} {stats2.details.model}</h3>
                                        <span className="reg-no">{stats2.details.registrationNumber}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics */}
                            {renderRow('Total Spend', stats1.totalCost, stats2.totalCost, (v) => `₹${v.toLocaleString()}`, true)}
                            {renderRow('Cost / KM', stats1.costPerKm, stats2.costPerKm, (v) => `₹${v.toFixed(2)}`, true)}
                            {renderRow('Cost / Service', stats1.costPerService, stats2.costPerService, (v) => `₹${v.toFixed(0)}`, true)}

                            {/* Vehicle Entity Fields: Odometer and Purchase Price */}
                            {renderRow('Odometer Reading', stats1.details.odometerReading, stats2.details.odometerReading, (v) => `${v.toLocaleString()} km`, false)}
                            {renderRow('Purchase Price', stats1.details.purchasePrice, stats2.details.purchasePrice, (v) => `₹${v.toLocaleString()}`, true)}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state-compare">
                        <FiActivity size={48} color="#cbd5e0" />
                        <p>Please select two vehicles to begin comparison</p>
                    </div>
                )}
            </div>
        </div>
    )
}
