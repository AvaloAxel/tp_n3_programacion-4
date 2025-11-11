import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Exporta datos en PDF usando jsPDF
export function exportToPDF(columns, rows, title='reporte'){
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  autoTable(doc, {
    head:[columns],
    body: rows,
    startY: 22,
    styles: { fontSize: 14 }
  })
  doc.save(`${title}.pdf`)
}
  
// Exporta datos en Excel usando SheetJS
export function exportToExcel(columns, rows, title='reporte'){
  const sheetData = [columns, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(sheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, `${title}.xlsx`)
}
