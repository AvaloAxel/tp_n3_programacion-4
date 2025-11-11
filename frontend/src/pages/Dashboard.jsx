import StatusBar from '../components/StatusBar.jsx'
import { useEffect, useState } from 'react'
import { getTurnos } from '../services/turnos.js'
import { getPacientes } from '../services/pacientes.js'
import { getMedicos } from '../services/medicos.js'
import { exportToPDF, exportToExcel } from '../utils/exporters.js'

// Inicio 
export default function Dashboard(){
  
  const [counts,setCounts] = useState({turnos:0, pacientes:0, medicos:0})
  // Efecto para cargar cantidades al montar el componente
  useEffect(()=>{
    Promise.all([getTurnos(), getPacientes(), getMedicos()])
      .then(([t,p,m])=> setCounts({turnos:t.length, pacientes:p.length, medicos:m.length}))
      .catch(()=>{})
  },[])

  const columns = ['Entidad','Cantidad']
  const rows = [['Turnos', counts.turnos], ['Pacientes', counts.pacientes], ['Médicos', counts.medicos]]

  // Como se ve el panel de control
  return (
    <div>
      <StatusBar/>
      <h3 className="mb-3">Clinica Santa Rosa</h3>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card card-table p-3">
            <div className="d-flex justify-content-between">
              <div>Pacientes</div><div className="fs-4 fw-bold">{counts.pacientes}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-table p-3">
            <div className="d-flex justify-content-between">
              <div>Médicos</div><div className="fs-4 fw-bold">{counts.medicos}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-table p-3">
            <div className="d-flex justify-content-between">
              <div>Turnos</div><div className="fs-4 fw-bold">{counts.turnos}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="card card-table p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-semibold">Reporte rápido</div>
            <div className="d-flex gap-2">
              {/* Botones para exportar documentos */}
              <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToExcel(columns, rows, 'dashboard-resumen')}>Exportar Excel</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={()=>exportToPDF(columns, rows, 'dashboard-resumen')}>Exportar PDF</button>
            </div>
          </div>
          <table className="table table-sm mb-0">
            <thead><tr><th>Entidad</th><th>Cantidad</th></tr></thead>
            <tbody>
              {rows.map((r,i)=>(<tr key={i}><td>{r[0]}</td><td>{r[1]}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
