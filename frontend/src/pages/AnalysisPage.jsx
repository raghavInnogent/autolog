import React, { useEffect, useState, useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { analyticsAPI } from '../services/api'
import { FiTrendingUp, FiActivity, FiBarChart2 } from 'react-icons/fi'
import '../styles/pages/AnalysisPage.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default function AnalysisPage() {
    const [monthlyExpenditure, setMonthlyExpenditure] = useState([])
    const [vehicleExpenditure, setVehicleExpenditure] = useState([])
    const [costPerKmData, setCostPerKmData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [monthlyRes, vehicleRes, costPerKmRes] = await Promise.all([
                    analyticsAPI.getMonthlyExpenditure(),
                    analyticsAPI.getVehicleWiseExpenditure(),
                    analyticsAPI.getCostPerKm()
                ])

                console.log('=== ANALYTICS API RESPONSES ===')
                console.log('Monthly Expenditure:', monthlyRes.data)
                console.log('Vehicle Expenditure:', vehicleRes.data)
                console.log('Cost Per Km:', costPerKmRes.data)

                // backend might return either a single DTO object or an array of DTOs.
                // Normalize to an array of DTOs.
                const normalizedMonthly = (() => {
                    const d = monthlyRes.data
                    if (!d) return []
                    // if it's already an array
                    if (Array.isArray(d)) return d
                    // if it's an object with year/monthlyExpenditure -> wrap it
                    if (typeof d === 'object' && d.year !== undefined && d.monthlyExpenditure !== undefined) {
                        return [d]
                    }
                    // fallback: empty
                    return []
                })()

                setMonthlyExpenditure(normalizedMonthly)
                setVehicleExpenditure(Array.isArray(vehicleRes.data) ? vehicleRes.data : [])
                setCostPerKmData(Array.isArray(costPerKmRes.data) ? costPerKmRes.data : [])
            } catch (err) {
                console.error('Error fetching analytics data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const {
        totalExpenditure,
        monthWiseChartData,
        vehicleWiseChartData,
        costPerKmChartData,
        efficiencyStats
    } = useMemo(() => {
        const monthlyDataRaw = Array.isArray(monthlyExpenditure) ? monthlyExpenditure : []
        const vehicleData = Array.isArray(vehicleExpenditure) ? vehicleExpenditure : []
        const costData = Array.isArray(costPerKmData) ? costPerKmData : []

        const extractModelName = (fullName) => {
            if (!fullName) return 'Unknown'
            const parts = fullName.trim().split(' ')
            return parts.length > 1 ? parts.slice(1).join(' ') : fullName
        }

        const total = monthlyDataRaw.reduce(
            (sum, item) => sum + (Number(item.totalExpenditure) || 0),
            0
        )

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        // ---------- Robust month label/value processing ----------
        // Cases handled:
        // 1) monthlyDataRaw = [] -> no data (chart empty)
        // 2) monthlyDataRaw = [{year:2024, monthlyExpenditure:[..12]}] -> single-year chart (labels: Jan..Dec or Jan 2024..Dec 2024)
        // 3) monthlyDataRaw = [ {year:2023,...}, {year:2024,...} ] -> multi-year flattened series (labels: Jan 2023..Dec 2024)
        // 4) backend might provide fewer than 12 months -> we pad with 0s
        // 5) backend might send null/undefined months -> treated as 0
        //
        // Implementation chooses label style:
        // - if single year present, we use labels "Jan, Feb, ..." (without year) to keep chart compact
        // - if multiple years present, labels include year "Jan 2023" to avoid ambiguity

        const monthLabels = []
        const monthValues = []

        // nothing to process -> leave arrays empty
        if (monthlyDataRaw.length === 0) {
            console.warn('No monthly expenditure data available.')
        } else {
            // Ensure every item has year and monthlyExpenditure
            const normalized = monthlyDataRaw
                .filter(item => item && (item.year !== undefined || item.monthlyExpenditure !== undefined))
                .map(item => {
                    // if year missing but monthlyExpenditure exists, mark year as unknown (use index-based)
                    return {
                        year: item.year,
                        monthlyExpenditure: Array.isArray(item.monthlyExpenditure) ? item.monthlyExpenditure : []
                    }
                })

            // if normalized contains >1 distinct years, treat as multi-year
            const distinctYears = Array.from(new Set(normalized.map(it => it.year).filter(y => y !== undefined)))
            const isMultiYear = distinctYears.length > 1

            // If years are numbers, sort ascending; otherwise preserve original order.
            const sorted = Array.isArray(distinctYears) && distinctYears.length > 0
                ? [...normalized].sort((a, b) => {
                    const ay = Number(a.year)
                    const by = Number(b.year)
                    if (!isNaN(ay) && !isNaN(by)) return ay - by
                    return 0
                })
                : [...normalized]

            // If there is exactly one year and it's numeric, we will use month labels without year suffix.
            const singleYearMode = sorted.length === 1 && (sorted[0].year !== undefined)

            sorted.forEach(yearObj => {
                const yearLabel = yearObj.year
                const rawExpenses = Array.isArray(yearObj.monthlyExpenditure) ? yearObj.monthlyExpenditure : []

                // Force exactly 12 entries, convert to number or 0
                const fixedExpenses = Array.from({ length: 12 }, (_, i) => {
                    // rawExpenses might have values like null, undefined, string numbers, etc.
                    const v = rawExpenses[i]
                    const num = Number(v)
                    return isNaN(num) ? 0 : num
                })

                fixedExpenses.forEach((value, monthIndex) => {
                    const label = singleYearMode
                        ? `${monthNames[monthIndex]}`          // "Jan"
                        : (yearLabel !== undefined
                            ? `${monthNames[monthIndex]} ${yearLabel}` // "Jan 2023"
                            : `${monthNames[monthIndex]}`)      // fallback to "Jan"
                    monthLabels.push(label)
                    monthValues.push(value)
                })
            })
        }

        console.log('Processed monthLabels:', monthLabels)
        console.log('Processed monthValues:', monthValues)

        const monthWiseChartData = {
            labels: monthLabels,
            datasets: [{
                label: 'Monthly Expenditure',
                data: monthValues,
                borderColor: '#22577A',
                backgroundColor: 'rgba(34, 87, 122, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }

        const vehicleWiseChartData = {
            labels: vehicleData.map(item => extractModelName(item.vehicleName)),
            datasets: [{
                label: 'Total Service Cost',
                data: vehicleData.map(item => Number(item.totalExpenditure) || 0),
                backgroundColor: '#FFC300',
                borderRadius: 6
            }]
        }

        const costPerKmChartData = {
            labels: costData.map(item => extractModelName(item.vehicleName)),
            datasets: [{
                label: 'Cost per KM (₹)',
                data: costData.map(item => Number(item.runningCostPerKm) || 0),
                backgroundColor: '#22577A',
                borderRadius: 6
            }]
        }

        const sortedByEfficiency = [...costData].sort(
            (a, b) => (Number(a.runningCostPerKm) || 0) - (Number(b.runningCostPerKm) || 0)
        )
        const mostEfficient = sortedByEfficiency[0]
        const mostExpensive = sortedByEfficiency[sortedByEfficiency.length - 1]

        return {
            totalExpenditure: total,
            monthWiseChartData,
            vehicleWiseChartData,
            costPerKmChartData,
            efficiencyStats: {
                mostEfficient: mostEfficient ? {
                    model: extractModelName(mostEfficient.vehicleName),
                    costPerKm: Number(mostEfficient.runningCostPerKm) || 0
                } : null,
                mostExpensive: mostExpensive ? {
                    model: extractModelName(mostExpensive.vehicleName),
                    costPerKm: Number(mostExpensive.runningCostPerKm) || 0
                } : null
            }
        }
    }, [monthlyExpenditure, vehicleExpenditure, costPerKmData])

    const handleCompareVehicles = () => {
        alert('Vehicle comparison feature coming soon!')
    }

    const barChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                }
            }
        }
    }

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading analysis...</div>

    return (
        <div className="analysis-page">
            <div className="analysis-header">
                <h2>Analytics & Insights</h2>
            </div>

            <div className="compare-banner">
                <div className="compare-banner-content">
                    <div className="compare-banner-icon">
                        <FiBarChart2 size={32} />
                    </div>
                    <div className="compare-banner-text">
                        <h3>Compare 2 Vehicles</h3>
                        <p>See detailed cost and efficiency comparisons between your vehicles</p>
                    </div>
                    <button className="compare-btn" onClick={handleCompareVehicles}>
                        Compare Now
                    </button>
                </div>
            </div>

            <div className="analysis-grid">
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Total Expenditure</h3>
                            <div className="chart-stat">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalExpenditure || 0)}
                            </div>
                        </div>
                        <FiTrendingUp size={24} color="#22577A" />
                    </div>
                    <div style={{ height: 300 }}>
                        {monthWiseChartData && (
                            <Line data={monthWiseChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                        )}
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Vehicle-wise Cost</h3>
                        <FiActivity size={24} color="#FFC300" />
                    </div>
                    <div style={{ height: 300 }}>
                        {vehicleWiseChartData && <Bar data={vehicleWiseChartData} options={barChartOptions} />}
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Running Cost per KM</h3>
                        <FiActivity size={24} color="#22577A" />
                    </div>
                    <div style={{ height: 300 }}>
                        {costPerKmChartData && <Bar data={costPerKmChartData} options={barChartOptions} />}
                    </div>

                    {efficiencyStats && (
                        <div className="efficiency-stats">
                            <div className="stat-box">
                                <div className="stat-label">Most Efficient</div>
                                <div className="stat-value" style={{ color: '#38a169' }}>
                                    {efficiencyStats.mostEfficient?.model || '-'}
                                </div>
                                <div className="stat-sub">
                                    ₹{efficiencyStats.mostEfficient?.costPerKm.toFixed(2)} / km
                                </div>
                            </div>

                            <div className="stat-box">
                                <div className="stat-label">Most Expensive</div>
                                <div className="stat-value" style={{ color: '#e53e3e' }}>
                                    {efficiencyStats.mostExpensive?.model || '-'}
                                </div>
                                <div className="stat-sub">
                                    ₹{efficiencyStats.mostExpensive?.costPerKm.toFixed(2)} / km
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
