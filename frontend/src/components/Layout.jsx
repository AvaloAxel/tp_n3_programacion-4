import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-layout d-flex">
      <aside className="sidebar bg-dark text-white p-3" style={{ minHeight: '100vh', width: '220px' }}>
        <h4 className="mb-4">Clínica</h4>
        <nav className="nav flex-column gap-2">
          <NavLink to="/pacientes" className="nav-link text-white">👥 Pacientes</NavLink>
          <NavLink to="/medicos" className="nav-link text-white">🩺 Médicos</NavLink>
          <NavLink to="/turnos" className="nav-link text-white">📅 Turnos</NavLink>
        </nav>
        <button className="btn btn-outline-light mt-4 w-100" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
