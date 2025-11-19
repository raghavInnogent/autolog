import { useState } from 'react'
import { vehiclesAPI } from '../services/api'
import '../styles/components/AddVehicleModal.css'

export default function AddVehicleModal({onClose, onCreated}){
  const [form, setForm] = useState({model:'',purchaseDate:'',odometer:''})
  const [loading,setLoading] = useState(false)

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const payload = {...form, odometer: Number(form.odometer||0)}
      await vehiclesAPI.create(payload)
      onCreated && onCreated()
      onClose && onClose()
    }catch(err){
      console.error(err)
    }finally{setLoading(false)}
  }

  return (
    <div className="add-vehicle-modal">
      <form onSubmit={submit}>
        <h3>Add Vehicle</h3>
        <label>Model</label>
        <input value={form.model} onChange={e=>setForm({...form,model:e.target.value})} />
        <label>Purchase Date</label>
        <input type="date" value={form.purchaseDate} onChange={e=>setForm({...form,purchaseDate:e.target.value})} />
        <label>Odometer</label>
        <input value={form.odometer} onChange={e=>setForm({...form,odometer:e.target.value})} />
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button type="button" onClick={onClose} className="navy-btn">Cancel</button>
          <button type="submit" className="navy-btn">{loading? 'Saving...' : 'Add Vehicle'}</button>
        </div>
      </form>
    </div>
  )
}
