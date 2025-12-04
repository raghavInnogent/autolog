import React, { useEffect, useState } from 'react'
import { schedulesAPI } from '../services/api'

export default function UpcomingSchedules() {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const res = await schedulesAPI.getUpcoming()
                setSchedules(res.data || [])
            } catch (err) {
                console.error("Failed to fetch schedules", err)
            } finally {
                setLoading(false)
            }
        }
        fetchSchedules()
    }, [])

    if (loading) return <div style={{ color: 'var(--muted)' }}>Loading schedules...</div>

    if (schedules.length === 0) {
        return (
            <div style={{
                padding: 20,
                textAlign: 'center',
                color: 'var(--muted)',
                background: 'var(--card)',
                borderRadius: 12,
                border: '1px solid var(--border)'
            }}>
                No upcoming schedules for the next 30 days.
            </div>
        )
    }

    return (
        <div className="service-table">
            <table className="service-list" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Vehicle</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Due Date</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px', fontWeight: 500 }}>{item.title}</td>
                            <td style={{ padding: '12px', color: 'var(--muted)' }}>{item.vehicleName}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background: item.type === 'SERVICE' ? '#e0f2fe' : '#fce7f3',
                                    color: item.type === 'SERVICE' ? '#0369a1' : '#be185d'
                                }}>
                                    {item.type}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>{item.dueDate}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background: '#fff7ed',
                                    color: '#c2410c'
                                }}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
