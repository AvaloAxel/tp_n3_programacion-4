import { useEffect, useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import { getMedicos, createMedico, updateMedico, deleteMedico, getEspecialidades } from '../services/medicos.js'
import { exportToPDF, exportToExcel } from '../utils/exporters.js'

// Valores iniciales del formulario del medico
const emptyForm = { nombre:'', apellido:'', matricula:'', id_especialidad:'', telefono:'', email:'', activo:1 }

// Componente de gestión de medicos (listado, creacion, edicion y exportacion)
export default function Medicos(){
 
  const [items, setItems] = useState([])
  const [esp, setEsp] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditing] = useState(null)

  // Carga inicial de medicos y especialidades
  const load = async () => {
    try {
      console.log('Cargando especialidades...')
      const [medicos, especialidades] = await Promise.all([getMedicos(), getEspecialidades()])
      console.log('Medicos recibidos:', medicos)
      console.log('Especialidades recibidas:', especialidades)
      setItems(medicos)
      setEsp(especialidades)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }
  // Efecto: cargar datos al montar el componente
  useEffect(()=>{ load() }, [])

  // Crea o actualiza segun si se esta editando un medico
  const submit = async (e)=>{
    e.preventDefault()
    if(editingId) await updateMedico(editingId, {...form, id_especialidad:Number(form.id_especialidad)})
    else await createMedico({...form, id_especialidad:Number(form.id_especialidad)})
    setForm(emptyForm); setEditing(null); load()
  }

  // Acciones de edicion y eliminacion 
  const onEdit = (m)=>{ setForm({...m}); setEditing(m.id_medico) }
  const onDelete = async (id)=>{ if(confirm('¿Eliminar médico?')){ await deleteMedico(id); load() } }

  const columns = ['Nombre','Apellido','Matrícula','Especialidad','Correo','Activo']
  const rows = items.map(m=>[m.nombre, m.apellido, m.matricula, esp.find(e=>e.id_especialidad===m.id_especialidad)?.nombre||'', m.email||'', m.activo? 'Sí':'No'])

  //Interfaz de gestion de médicos
  return (
    <div>
      <StatusBar/>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3>Gestión de Médicos</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToExcel(columns, rows, 'medicos')}>Excel</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToPDF(columns, rows, 'medicos')}>PDF</button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card card-table p-3">
            <h6 className="mb-3">{editingId ? 'Editar Médico' : 'Nuevo Médico'}</h6>
            <form onSubmit={submit} className="vstack gap-2">
              <label className="form-label">Nombre del médico:</label>
              <input className="form-control" placeholder="--" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} required />
              <label className="form-label">Apellido del médico:</label>
              <input className="form-control" placeholder="--" value={form.apellido} onChange={e=>setForm({...form, apellido:e.target.value})} required />
              <label className="form-label">Matrícula del médico:</label>
              <input className="form-control" placeholder="--" value={form.matricula} onChange={e=>setForm({...form, matricula:e.target.value})} required />
              <label className="form-label">Especialidad:</label>
              <select className="form-select" value={form.id_especialidad} onChange={e=>setForm({...form, id_especialidad:Number(e.target.value)})} required>
                <option value="">-- Especialidad --</option>
                {esp.map(e => <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>)}
              </select>
              <label className="form-label">Teléfono del médico:</label>
              <input className="form-control" placeholder="--" value={form.telefono||''} onChange={e=>setForm({...form, telefono:e.target.value})} />
              <label className="form-label">Correo del médico:</label>
              <input type="email" className="form-control" placeholder="--" value={form.email||''} onChange={e=>setForm({...form, email:e.target.value})} />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={!!form.activo} onChange={e=>setForm({...form, activo: e.target.checked ? 1 : 0})} id="activoChk"/>
                <label htmlFor="activoChk" className="form-check-label">Activo</label>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary">{editingId?'Guardar':'Crear'}</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={()=>{ setForm(emptyForm); setEditing(null) }}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card card-table p-3">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Nombre</th><th>Apellido</th><th>Matrícula</th><th>Especialidad</th><th>Correo</th><th>Activo</th><th>Acciones</th></tr></thead>
              <tbody>
                {items.map(m => (
                  <tr key={m.id_medico}>
                    <td>{m.nombre}</td>
                    <td>{m.apellido}</td>
                    <td>{m.matricula}</td>
                    <td>{esp.find(e=>e.id_especialidad===m.id_especialidad)?.nombre}</td>
                    <td>{m.email}</td>
                    <td>{m.activo ? <span className="badge text-bg-success">Sí</span> : <span className="badge text-bg-secondary">No</span>}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onEdit(m)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>onDelete(m.id_medico)}>Eliminar</button>
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
