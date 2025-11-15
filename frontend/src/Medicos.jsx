import { useEffect, useState } from 'react'
import { getMedicos, createMedico, updateMedico, deleteMedico } from './services/medicos'

export default function Medicos() {
  const [medicos, setMedicos] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    matricula: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const data = await getMedicos()
      setMedicos(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.apellido || !form.especialidad || !form.matricula) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      if (editingId) {
        await updateMedico(editingId, form)
      } else {
        await createMedico(form)
      }
      setForm({ nombre: '', apellido: '', especialidad: '', matricula: '' })
      setEditingId(null)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const onEdit = (m) => {
    setForm({
      nombre: m.nombre,
      apellido: m.apellido,
      especialidad: m.especialidad,
      matricula: m.matricula
    })
    setEditingId(m.id_medico)
  }

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar médico?')) return
    try {
      await deleteMedico(id)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Médicos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mt-3">
        <div className="col-md-4">
          <h5>{editingId ? 'Editar médico' : 'Nuevo médico'}</h5>
          <form onSubmit={handleSubmit} className="vstack gap-2">
            <input
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder="Apellido"
              value={form.apellido}
              onChange={e => setForm({ ...form, apellido: e.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder="Especialidad"
              value={form.especialidad}
              onChange={e => setForm({ ...form, especialidad: e.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder="Matrícula profesional"
              value={form.matricula}
              onChange={e => setForm({ ...form, matricula: e.target.value })}
              required
            />
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Agregar'}
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <h5>Listado</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Especialidad</th>
                <th>Matrícula</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medicos.map(m => (
                <tr key={m.id_medico}>
                  <td>{m.nombre}</td>
                  <td>{m.apellido}</td>
                  <td>{m.especialidad}</td>
                  <td>{m.matricula}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(m)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(m.id_medico)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {!medicos.length && (
                <tr>
                  <td colSpan="5" className="text-center">Sin médicos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
