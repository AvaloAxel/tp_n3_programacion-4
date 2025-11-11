import { useState } from 'react'
import { register } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ nombre, email, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    }
  }

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tenés cuenta? <a href="/login">Iniciá sesión</a></p>
    </div>
  )
}
