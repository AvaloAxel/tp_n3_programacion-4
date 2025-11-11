import api from './api'

// Registro de usuario
export const register = async (data) => {
  const res = await api.post('/auth/register', data)
  return res.data
}

// Inicio de sesión
export const login = async (data) => {
  const res = await api.post('/auth/login', data)
  if (res.data && res.data.token) {
    localStorage.setItem('token', res.data.token)
  }
  return res.data
}

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token')
}

// Obtener token actual
export const getToken = () => localStorage.getItem('token')
