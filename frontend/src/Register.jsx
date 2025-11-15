import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from './services/auth'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nombre || !email || !password || !confirm) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await register({ nombre, email, password })
      setSuccess('Usuario registrado correctamente, ahora podés iniciar sesión')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message || 'Error al registrar usuario')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h2 className="mb-4 text-center">Registro</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit} className="vstack gap-3">
            <div>
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Registrarme
            </button>
          </form>
          <p className="mt-3 text-center">
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
