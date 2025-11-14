const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const pool = require('../db');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// GET /api/turnos
router.get('/', [
  query('paciente_id').optional().isInt(),
  query('medico_id').optional().isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const { paciente_id, medico_id } = req.query;
    let sql = `SELECT
                 t.id AS id_turno,
                 t.paciente_id,
                 t.medico_id,
                 t.fecha,
                 t.hora,
                 t.estado,
                 t.observaciones,
                 p.nombre AS paciente_nombre,
                 m.nombre AS medico_nombre
               FROM turnos t
               JOIN pacientes p ON p.id = t.paciente_id
               JOIN medicos m ON m.id = t.medico_id`;
    const params = [];
    const where = [];
    if (paciente_id) {
      where.push('t.paciente_id = ?');
      params.push(paciente_id);
    }
    if (medico_id) {
      where.push('t.medico_id = ?');
      params.push(medico_id);
    }
    if (where.length) {
      sql += ' WHERE ' + where.join(' AND ');
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/turnos/:id
router.get('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const [rows] = await pool.query(
      `SELECT
         t.id AS id_turno,
         t.paciente_id,
         t.medico_id,
         t.fecha,
         t.hora,
         t.estado,
         t.observaciones,
         p.nombre AS paciente_nombre,
         m.nombre AS medico_nombre
       FROM turnos t
       JOIN pacientes p ON p.id = t.paciente_id
       JOIN medicos m ON m.id = t.medico_id
       WHERE t.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Turno no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/turnos
router.post('/', [
  body('paciente_id').isInt(),
  body('medico_id').isInt(),
  body('fecha').isISO8601(),
  body('hora').matches(/^\d{2}:\d{2}(:\d{2})?$/),
  body('estado').optional().isIn(['pendiente','atendido','cancelado']),
  body('observaciones').optional().isString()
], async (req, res, next) => {
  handleValidation(req, res);
  const { paciente_id, medico_id, fecha, hora, estado, observaciones } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO turnos (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?,?,?,?,?,?)',
      [paciente_id, medico_id, fecha, hora, estado || 'pendiente', observaciones || null]
    );
    res.status(201).json({ id_turno: result.insertId });
  } catch (err) {
    next(err);
  }
});

// PUT /api/turnos/:id
router.put('/:id', [
  param('id').isInt(),
  body('paciente_id').optional().isInt(),
  body('medico_id').optional().isInt(),
  body('fecha').optional().isISO8601(),
  body('hora').optional().matches(/^\d{2}:\d{2}(:\d{2})?$/),
  body('estado').optional().isIn(['pendiente','atendido','cancelado']),
  body('observaciones').optional().isString()
], async (req, res, next) => {
  handleValidation(req, res);
  const id = req.params.id;
  const fields = req.body;
  const set = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const values = Object.values(fields);
  if (!set) return res.status(400).json({ message: 'No hay campos para actualizar' });
  try {
    await pool.query(`UPDATE turnos SET ${set} WHERE id = ?`, [...values, id]);
    res.json({ message: 'Actualizado' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/turnos/:id
router.delete('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    await pool.query('DELETE FROM turnos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
