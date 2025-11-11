import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Pacientes from './pages/Pacientes.jsx'
import Medicos from './pages/Medicos.jsx'
import Turnos from './pages/Turnos.jsx'

// Componente raíz de la aplicación y enrutamiento principal
export default function App(){
  // Render del layout principal (sidebar + contenido + rutas)
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">Gestion</div>
        <nav> 
          <NavLink to="/" end>🏣Inicio</NavLink>
          <NavLink to="/turnos">📅Turnos</NavLink>
          <NavLink to="/pacientes">🤕Pacientes</NavLink>
          <NavLink to="/medicos">👨‍⚕️Médicos</NavLink>
        </nav>
      </aside>
      <main className="content">
        <div className="topbar">
          <div className="fs-5">Sistema de Gestión de Turnos: Clinica Santa Rosa</div>
          <div className="text-muted">Usuario: <strong>Doctor Axel Pishin</strong></div>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/turnos" element={<Turnos />} />
        </Routes>
      </main>
    </div>
  )
}
