import api from './api'

// Obtener todas las especialidades
export const getEspecialidades = async () => {
  const res = await api.get('/especialidades')
  return res.data
}

// Agregar una especialidad
export const createEspecialidad = async (data) => {
  const res = await api.post('/especialidades', data)
  return res.data
}

// Eliminar una especialidad
export const deleteEspecialidad = async (id) => {
  const res = await api.delete(`/especialidades/${id}`)
  return res.data
}
