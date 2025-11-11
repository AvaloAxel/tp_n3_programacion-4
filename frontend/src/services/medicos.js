import api from './api'

// Obtener todos los medicos
export const getMedicos = () => api.get('/medicos/').then(r=>r.data)
// Obtener un medico por id
export const getMedico = (id) => api.get(`/medicos/${id}`).then(r=>r.data)
// Crear un medico
export const createMedico = (data) => api.post('/medicos/', data).then(r=>r.data)
// Actualizar un medico
export const updateMedico = (id, data) => api.put(`/medicos/${id}`, data).then(r=>r.data)
// Eliminar un medico
export const deleteMedico = (id) => api.delete(`/medicos/${id}`)
// Obtener todas las especialidades
export const getEspecialidades = async () => {
  try {
    const response = await api.get('/especialidades/')
    return response.data
  } catch (error) {
    console.error('Error al obtener especialidades:', error)
    throw error
  }
}
