import api from './api'

// Registro
export async function register(data) {
  return api.post('/auth/register', data)
}

// Login
export async function loginRequest(data) {
  // backend solo devuelve { token }, si luego querés puedes pedir /me
  return api.post('/auth/login', data)
}
