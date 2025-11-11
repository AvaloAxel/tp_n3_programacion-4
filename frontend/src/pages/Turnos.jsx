import { useEffect, useState } from 'react'
import StatusBar from '../components/StatusBar.jsx'
import { getTurnos, createTurno, updateTurno, deleteTurno, reservarTurno } from '../services/turnos.js'
import { getPacientes } from '../services/pacientes.js'
import { getMedicos, getEspecialidades } from '../services/medicos.js'
import { exportToPDF, exportToExcel } from '../utils/exporters.js'

const emptyForm = { id_paciente:'', id_medico:'', fecha:'', hora:'', motivo:'', estado:'reservado' }

// Componente de gestion de turnos (listado, creacion, edicion y exportacion)
export default function Turnos(){
  
  const [items,setItems] = useState([])
  const [pacientes,setPacientes] = useState([])
  const [medicos,setMedicos] = useState([])
  const [esp, setEsp] = useState([])
  const [form,setForm] = useState(emptyForm)
  const [editingId,setEditing] = useState(null)

  // Carga inicial de turnos, pacientes, medicos y especialidades
  const load = ()=> Promise.all([getTurnos(), getPacientes(), getMedicos(), getEspecialidades()])
    .then(([t,p,m,e])=>{ setItems(t); setPacientes(p); setMedicos(m); setEsp(e) })
  // Efecto: cargar datos al montar el componente
  useEffect(()=>{ load() }, [])

  // Crea o actualiza segun si se esta editando un turno
  const submit = async (e)=>{
    e.preventDefault()
    const payload = { ...form, id_paciente:Number(form.id_paciente), id_medico:Number(form.id_medico) }
    if(editingId) await updateTurno(editingId, payload)
    else await createTurno(payload)
    setForm(emptyForm); setEditing(null); load()
  }

  // Reservar turno mediante procedimiento almacenado (SP)
  const reservar = async () => {
  const payload = {
    id_paciente: Number(form.id_paciente),
    id_medico: Number(form.id_medico),
    fecha: form.fecha,
    hora: form.hora.length === 5 ? form.hora + ':00' : form.hora, 
    motivo: form.motivo || ''
  }
  console.log('Reservar payload:', payload)
  try {
    const res = await reservarTurno(payload)
    alert(res.mensaje)
    setForm(emptyForm); setEditing(null); load()
  } catch (err) {
    console.error(err)
    alert('Error al reservar turno, verifica los campos.')
  }
}


  // Acciones de edicion y eliminacion 
  const onEdit = (t)=>{ setForm({...t}); setEditing(t.id_turno) }
  const onDelete = async (id)=>{ if(confirm('¿Eliminar turno?')){ await deleteTurno(id); load() } }

  const columns = ['Paciente','Médico','Especialidad','Fecha','Hora','Motivo','Estado']
  const rows = items.map(t=>{
    const p = pacientes.find(x=>x.id_paciente===t.id_paciente)
    const m = medicos.find(x=>x.id_medico===t.id_medico)
    const e = m ? esp.find(y=>y.id_especialidad===m.id_especialidad) : null
    return [p?`${p.nombre} ${p.apellido}`:'', m?`${m.nombre} ${m.apellido}`:'', e?e.nombre:'', t.fecha, t.hora, t.motivo||'', t.estado]
  })

  // Interfaz de gestion de turnos
  return (
    <div>
      <StatusBar/>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3>Gestión de Turnos</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToExcel(columns, rows, 'turnos')}>Excel</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToPDF(columns, rows, 'turnos')}>PDF</button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-5">
          <div className="card card-table p-3">
            <h6 className="mb-3">{editingId ? 'Editar Turno' : 'Nuevo Turno'}</h6>
            <form onSubmit={submit} className="vstack gap-2">
              <label className="form-label">Paciente:</label>
              <select className="form-select" value={form.id_paciente} onChange={e=>setForm({...form, id_paciente:e.target.value})} required>
                <option value="">-- Paciente --</option>
                {pacientes.map(p=><option key={p.id_paciente} value={p.id_paciente}>{p.nombre} {p.apellido}</option>)}
              </select>
              <label className="form-label">Médico:</label>
              <select className="form-select" value={form.id_medico} onChange={e=>setForm({...form, id_medico:e.target.value})} required>
                <option value="">-- Médico --</option>
                {medicos.map(m=><option key={m.id_medico} value={m.id_medico}>{m.nombre} {m.apellido}</option>)}
              </select>
              <label className="form-label">Fecha y Hora:</label>
              <input type="date" className="form-control" value={form.fecha} onChange={e=>setForm({...form, fecha:e.target.value})} required />
              <input type="time" className="form-control" value={form.hora} onChange={e=>setForm({...form, hora:e.target.value})} required />
              <label className="form-label">Motivo del turno:</label>
              <input className="form-control" placeholder="--" value={form.motivo||''} onChange={e=>setForm({...form, motivo:e.target.value})} />
              <label className="form-label">Estado del turno:</label>
              <select className="form-select" value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
                <option value="reservado">reservado</option>
                <option value="confirmado">confirmado</option>
                <option value="cancelado">cancelado</option>
                <option value="cumplido">cumplido</option>
              </select>

              {/* Dependiendo si se esta editando o no, llama a la funcion correspondiente */}
              <div className="d-flex gap-2">

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editingId ? submit : reservar}
                  disabled={!(form.id_paciente && form.id_medico && form.fecha && form.hora)}
                  title={!(form.id_paciente && form.id_medico && form.fecha && form.hora)
                    ? 'Complete paciente, médico, fecha y hora'
                    : editingId
                      ? 'Guardar'
                      : 'Crear turno'}
                >
                  {editingId ? 'Guardar' : 'Reservar'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { setForm(emptyForm); setEditing(null) }}
                  >
                    Cancelar
                  </button>
            )}
          </div>
         </form>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card card-table p-3">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Paciente</th><th>Médico</th><th>Especialidad</th><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {items.map(t=>{
                  const p = pacientes.find(x=>x.id_paciente===t.id_paciente)
                  const m = medicos.find(x=>x.id_medico===t.id_medico)
                  const e = m ? esp.find(y=>y.id_especialidad===m.id_especialidad) : null
                  return (
                    <tr key={t.id_turno}>
                      <td>{p?`${p.nombre} ${p.apellido}`:''}</td>
                      <td>{m?`${m.nombre} ${m.apellido}`:''}</td>
                      <td>{e?e.nombre:''}</td>
                      <td>{t.fecha}</td>
                      <td>{t.hora}</td>
                      <td>{t.motivo}</td>
                      <td>{t.estado}</td>
                      <td className="text-nowrap">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onEdit(t)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={()=>onDelete(t.id_turno)}>Eliminar</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
