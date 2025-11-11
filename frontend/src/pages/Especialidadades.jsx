import { useState, useEffect } from 'react'
import { getEspecialidades, createEspecialidad, deleteEspecialidad } from '../services/especialidades'

export default function Especialidades() {
  const [nombre, setNombre] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [error, setError] = useState(null)

  // Cargar especialidades al montar el componente
  useEffect(() => {
    fetchEspecialidades()
  }, [])

  const fetchEspecialidades = async () => {
    try {
      const data = await getEspecialidades()
      setEspecialidades(data)
    } catch (err) {
      console.error(err)
      setError('Error al obtener especialidades')
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    try {
      await createEspecialidad({ nombre })
      setNombre('')
      fetchEspecialidades()
    } catch (err) {
      setError('Error al agregar la especialidad')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta especialidad?')) return
    try {
      await deleteEspecialidad(id)
      fetchEspecialidades()
    } catch (err) {
      setError('Error al eliminar la especialidad')
    }
  }

  return (
    <div className="form-container">
      <h2>Gestión de Especialidades</h2>

      {error && <p className="error">{error}</p>}

      {/* Formulario */}
      <form onSubmit={handleAdd}>
        <label>Nombre de la Especialidad:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Cardiología"
          required
        />
        <button type="submit">Agregar</button>
      </form>

      {/* Tabla de especialidades */}
      <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Nombre</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {especialidades.length > 0 ? (
            especialidades.map((esp) => (
              <tr key={esp.id}>
                <td>{esp.id}</td>
                <td>{esp.nombre}</td>
                <td>
                  <button
                    style={{ backgroundColor: 'crimson', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px' }}
                    onClick={() => handleDelete(esp.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay especialidades registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
