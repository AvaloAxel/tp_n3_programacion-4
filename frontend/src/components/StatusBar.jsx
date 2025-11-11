import { useEffect, useState } from 'react'
import api from '../services/api'

// Barra de estado que verifica conexion con el backend
export default function StatusBar(){
  const [ok, setOk] = useState(false)
  useEffect(()=>{
    api.get('/').then(()=>setOk(true)).catch(()=>setOk(false))
  },[])
  //En la consola del navegador se muestra el estado del backend
  return (
    <div className="alert alert-light border d-flex align-items-center py-2 mb-3">
      {console.log('Estado del backend:', ok)}
      {ok ? console.log('Backend conectado correctamente') : console.log('No se pudo conectar al backend')}
     
    </div>
  )
}
