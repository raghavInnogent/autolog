import React from 'react'
import ServiceTable from '../components/ServiceTable'

export default function ServicingsPage() {
  return (
    <div className="page-content">
      <h2 style={{ marginBottom: 24, fontSize: 28, color: 'var(--nav-title)' }}>Service History</h2>
      <ServiceTable />
    </div>
  )
}
