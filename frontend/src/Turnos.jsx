import { useEffect, useState } from 'react'
import { getTurnos, createTurno, updateTurno, deleteTurno } from './services/turnos'
import { getPacientes } from './services/pacientes'
import { getMedicos } from './services/medicos'

export default function Turnos() {
  const [turnos, setTurnos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [filters, setFilters] = useState({ paciente_id: '', medico_id: '' })
  const [form, setForm] = useState({
    paciente_id: '',
    medico_id: '',
    fecha: '',
    hora: '',
    estado: 'pendiente',
    observaciones: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const cargarTurnos = async () => {
    try {
      const data = await getTurnos({
        paciente_id: filters.paciente_id || undefined,
        medico_id: filters.medico_id || undefined
      })
      setTurnos(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const cargarAuxiliares = async () => {
    try {
      const [p, m] = await Promise.all([getPacientes(), getMedicos()])
      setPacientes(p)
      setMedicos(m)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    cargarAuxiliares()
    cargarTurnos()
  }, [])

  useEffect(() => {
    cargarTurnos()
  }, [filters.paciente_id, filters.medico_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.paciente_id || !form.medico_id || !form.fecha || !form.hora) {
      setError('Paciente, médico, fecha y hora son obligatorios')
      return
    }

    const payload = {
      paciente_id: Number(form.paciente_id),
      medico_id: Number(form.medico_id),
      fecha: form.fecha,
      hora: form.hora.length === 5 ? form.hora + ':00' : form.hora,
      estado: form.estado,
      observaciones: form.observaciones
    }

    try {
      if (editingId) {
        await updateTurno(editingId, payload)
      } else {
        await createTurno(payload)
      }
      setForm({
        paciente_id: '',
        medico_id: '',
        fecha: '',
        hora: '',
        estado: 'pendiente',
        observaciones: ''
      })
      setEditingId(null)
      cargarTurnos()
    } catch (err) {
      setError(err.message)
    }
  }

  const onEdit = (t) => {
    setForm({
      paciente_id: t.paciente_id.toString(),
      medico_id: t.medico_id.toString(),
      fecha: t.fecha?.substring(0,10),
      hora: t.hora?.substring(0,5),
      estado: t.estado,
      observaciones: t.observaciones || ''
    })
    setEditingId(t.id_turno)
  }

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar turno?')) return
    try {
      await deleteTurno(id)
      cargarTurnos()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Turnos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mt-3">
        <div className="col-lg-4">
          <h5>{editingId ? 'Editar turno' : 'Nuevo turno'}</h5>
          <form onSubmit={handleSubmit} className="vstack gap-2">
            <div>
              <label className="form-label">Paciente</label>
              <select
                className="form-select"
                value={form.paciente_id}
                onChange={e => setForm({ ...form, paciente_id: e.target.value })}
                required
              >
                <option value="">-- Seleccionar --</option>
                {pacientes.map(p => (
                  <option key={p.id_paciente} value={p.id_paciente}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Médico</label>
              <select
                className="form-select"
                value={form.medico_id}
                onChange={e => setForm({ ...form, medico_id: e.target.value })}
                required
              >
                <option value="">-- Seleccionar --</option>
                {medicos.map(m => (
                  <option key={m.id_medico} value={m.id_medico}>
                    {m.nombre} {m.apellido} ({m.especialidad})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Hora</label>
              <input
                type="time"
                className="form-control"
                value={form.hora}
                onChange={e => setForm({ ...form, hora: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="atendido">Atendido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="form-label">Observaciones</label>
              <textarea
                className="form-control"
                value={form.observaciones}
                onChange={e => setForm({ ...form, observaciones: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Crear turno'}
            </button>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3 gap-2">
            <h5 className="mb-0">Listado</h5>
            <select
              className="form-select form-select-sm w-auto"
              value={filters.paciente_id}
              onChange={e => setFilters({ ...filters, paciente_id: e.target.value })}
            >
              <option value="">Filtrar por paciente</option>
              {pacientes.map(p => (
                <option key={p.id_paciente} value={p.id_paciente}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
            <select
              className="form-select form-select-sm w-auto"
              value={filters.medico_id}
              onChange={e => setFilters({ ...filters, medico_id: e.target.value })}
            >
              <option value="">Filtrar por médico</option>
              {medicos.map(m => (
                <option key={m.id_medico} value={m.id_medico}>
                  {m.nombre} {m.apellido}
                </option>
              ))}
            </select>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {turnos.map(t => (
                <tr key={t.id_turno}>
                  <td>{t.paciente_nombre}</td>
                  <td>{t.medico_nombre}</td>
                  <td>{t.fecha?.substring(0,10)}</td>
                  <td>{t.hora?.substring(0,5)}</td>
                  <td>{t.estado}</td>
                  <td>{t.observaciones}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(t)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(t.id_turno)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {!turnos.length && (
                <tr>
                  <td colSpan="7" className="text-center">Sin turnos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
