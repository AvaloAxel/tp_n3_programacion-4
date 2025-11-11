import api from './api'

// Obtener todos los pacientes
export const getPacientes = () => api.get('/pacientes/').then(r=>r.data)
// Obtener un paciente por id
export const getPaciente = (id) => api.get(`/pacientes/${id}`).then(r=>r.data)
// Crear un paciente
export const createPaciente = (data) => api.post('/pacientes/', data).then(r=>r.data)
// Actualizar un paciente
export const updatePaciente = (id, data) => api.put(`/pacientes/${id}`, data).then(r=>r.data)
// Eliminar un paciente
export const deletePaciente = (id) => api.delete(`/pacientes/${id}`)
