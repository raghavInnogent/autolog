import React, {useEffect, useState} from 'react'
import { servicesAPI } from '../services/api'
import '../styles/components/ServiceTable.css'

export default function ServiceTable(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const fetch = async ()=>{
    setLoading(true)
    try{
      const params = {}
      if(from) params.from = from
      if(to) params.to = to
      const res = await servicesAPI.getAll(params)
      setRows(res.data || [])
    }catch(err){console.error(err)}finally{setLoading(false)}
  }

  useEffect(()=>{ fetch() }, [])

  return (
    <div className="service-table">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div>
          <label>From</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{marginLeft:8}} />
          <label style={{marginLeft:8}}>To</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{marginLeft:8}} />
          <button className="navy-btn" onClick={fetch} style={{marginLeft:8}}>Filter</button>
        </div>
        <div>
          <button className="navy-btn">Add Service Record</button>
        </div>
      </div>

      {loading ? <div style={{color:'var(--muted)'}}>Loading...</div> : (
        <table className="service-list" style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Items</th>
              <th>Cost</th>
              <th>Workshop</th>
              <th>Mileage</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.type}</td>
                <td>{r.items}</td>
                <td>{r.cost}</td>
                <td>{r.workshop}</td>
                <td>{r.mileage}</td>
                <td>{r.invoice ? <a href={r.invoice} target="_blank">View</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
