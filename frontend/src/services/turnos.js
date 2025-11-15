import api from './api'

export const getTurnos = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.paciente_id) params.append('paciente_id', filters.paciente_id)
  if (filters.medico_id) params.append('medico_id', filters.medico_id)
  const qs = params.toString()
  const path = qs ? `/turnos?${qs}` : '/turnos'
  return api.get(path)
}

export const createTurno = (data) => api.post('/turnos', data)
export const updateTurno = (id, data) => api.put(`/turnos/${id}`, data)
export const deleteTurno = (id) => api.delete(`/turnos/${id}`)
