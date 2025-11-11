import api from './api'

// Obtener todos los turnos
export const getTurnos = () => api.get('/turnos/').then(r=>r.data)
// Obtener un turno por id
export const getTurno = (id) => api.get(`/turnos/${id}`).then(r=>r.data)
// Crear un turno
export const createTurno = (data) => api.post('/turnos/', data).then(r=>r.data)
// Actualizar un turno
export const updateTurno = (id, data) => api.put(`/turnos/${id}`, data).then(r=>r.data)
// Eliminar un turno
export const deleteTurno = (id) => api.delete(`/turnos/${id}`)

// Reservar turno mediante procedimiento almacenado
export const reservarTurno = (data) => api.post('/turnos/reservar', data).then(r=>r.data)
