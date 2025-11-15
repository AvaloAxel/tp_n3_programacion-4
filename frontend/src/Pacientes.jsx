import { useEffect, useState } from 'react'
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from './services/pacientes'

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fecha_nacimiento: '',
    obra_social: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      const data = await getPacientes()
      setPacientes(data)
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

    if (!form.nombre || !form.apellido || !form.dni || !form.fecha_nacimiento || !form.obra_social) {
      setError('Todos los campos son obligatorios')
      return
    }
    if (!/^[0-9]{7,10}$/.test(form.dni)) {
      setError('El DNI debe tener solo números (7 a 10 dígitos)')
      return
    }

    try {
      if (editingId) {
        await updatePaciente(editingId, form)
      } else {
        await createPaciente(form)
      }
      setForm({ nombre: '', apellido: '', dni: '', fecha_nacimiento: '', obra_social: '' })
      setEditingId(null)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const onEdit = (p) => {
    setForm({
      nombre: p.nombre,
      apellido: p.apellido,
      dni: p.dni,
      fecha_nacimiento: p.fecha_nacimiento?.substring(0, 10),
      obra_social: p.obra_social
    })
    setEditingId(p.id_paciente)
  }

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar paciente?')) return
    try {
      await deletePaciente(id)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Pacientes</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mt-3">
        <div className="col-md-4">
          <h5>{editingId ? 'Editar paciente' : 'Nuevo paciente'}</h5>
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
              placeholder="DNI"
              value={form.dni}
              onChange={e => setForm({ ...form, dni: e.target.value })}
              required
            />
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              className="form-control"
              value={form.fecha_nacimiento}
              onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder="Obra social"
              value={form.obra_social}
              onChange={e => setForm({ ...form, obra_social: e.target.value })}
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
                <th>DNI</th>
                <th>Fecha nac.</th>
                <th>Obra social</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id_paciente}>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.dni}</td>
                  <td>{p.fecha_nacimiento?.substring(0,10)}</td>
                  <td>{p.obra_social}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(p.id_paciente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {!pacientes.length && (
                <tr>
                  <td colSpan="6" className="text-center">Sin pacientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
