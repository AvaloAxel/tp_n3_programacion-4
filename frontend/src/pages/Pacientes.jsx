import { useEffect, useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../services/pacientes.js'
import { exportToPDF, exportToExcel } from '../utils/exporters.js'

// Valores iniciales del formulario del paciente
const emptyForm = { nombre:'', apellido:'', dni:'', telefono:'', email:'', fecha_nacimiento:'' }

// Componente de gestion de pacientes (listado, creacion, edicion y exportacion)
export default function Pacientes(){
  // Estados locales de la vista
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  // Carga inicial de pacientes
  const load = () => getPacientes().then(setItems)
  // Efecto: cargar datos al montar el componente
  useEffect(()=>{ load() }, [])

  // Crea o actualiza segun si se esta editando un paciente
  const onSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      if(editingId) await updatePaciente(editingId, form)
      else await createPaciente(form)
      setForm(emptyForm); setEditing(null); load()
    }finally{ setLoading(false) }
  }

  // Acciones de edicion y eliminacion 
  const onEdit = (p)=>{ setForm({...p}); setEditing(p.id_paciente) }
  const onDelete = async (id)=>{ if(confirm('¿Eliminar paciente?')){ await deletePaciente(id); load() } }

  const columns = ['Nombre','Apellido','DNI','Correo']
  const rows = items.map(p=>[p.nombre, p.apellido, p.dni||'', p.email||''])

  // Interfaz de gestion de pacientes
  return (
    <div>
      <StatusBar/>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3>Gestión de Pacientes</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToExcel(columns, rows, 'pacientes')}>Excel</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToPDF(columns, rows, 'pacientes')}>PDF</button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card card-table p-3">
            <h6 className="mb-3">{editingId ? 'Editar Paciente' : 'Nuevo Paciente'}</h6>
            <form onSubmit={onSubmit} className="vstack gap-2">
              <label className="form-label">Nombre del paciente:</label>
              <input className="form-control" placeholder="--" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required />
              <label className="form-label">Apellido del paciente:</label>
              <input className="form-control" placeholder="--" value={form.apellido} onChange={e=>setForm({...form, apellido:e.target.value})} required />
              <label className="form-label">DNI del paciente:</label>
              <input className="form-control" placeholder="--"  value={form.dni||''} onChange={e=>setForm({...form, dni:e.target.value})} />
              <label className="form-label">Fecha de nacimiento:</label>
              <input type="date" className="form-control" value={form.fecha_nacimiento||''} onChange={e=>setForm({...form, fecha_nacimiento:e.target.value})} />
              <label className="form-label">Teléfono del paciente:</label>
              <input className="form-control" placeholder="--" value={form.telefono||''} onChange={e=>setForm({...form, telefono:e.target.value})} />
              <label className="form-label">Correo del paciente:</label>
              <input type="email" className="form-control" placeholder="--" value={form.email||''} onChange={e=>setForm({...form, email:e.target.value})} />
              <div className="d-flex gap-2">
                <button className="btn btn-primary" disabled={loading}>{editingId?'Guardar':'Crear'}</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={()=>{ setForm(emptyForm); setEditing(null) }}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card card-table p-3">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Nombre</th><th>Apellido</th><th>DNI</th><th>Correo</th><th>Acciones</th></tr></thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id_paciente}>
                    <td>{p.nombre}</td>
                    <td>{p.apellido}</td>
                    <td>{p.dni}</td>
                    <td>{p.email}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>onDelete(p.id_paciente)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
