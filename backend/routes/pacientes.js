const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const pool = require('../db');

// Helpers
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// GET /api/pacientes (opcionalmente se podría filtrar por dni o nombre)
router.get('/', [
  query('dni').optional().isString(),
  query('nombre').optional().isString()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    let sql = 'SELECT id AS id_paciente, nombre, apellido, dni, fecha_nacimiento, obra_social FROM pacientes';
    const params = [];
    const where = [];
    if (req.query.dni) {
      where.push('dni = ?');
      params.push(req.query.dni);
    }
    if (req.query.nombre) {
      where.push('nombre LIKE ?');
      params.push('%' + req.query.nombre + '%');
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/pacientes/:id
router.get('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const [rows] = await pool.query(
      'SELECT id AS id_paciente, nombre, apellido, dni, fecha_nacimiento, obra_social FROM pacientes WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Paciente no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/pacientes
router.post('/', [
  body('nombre').notEmpty(),
  body('apellido').notEmpty(),
  body('dni').isLength({ min: 7, max: 10 }).isNumeric(),
  body('fecha_nacimiento').isISO8601(),
  body('obra_social').notEmpty()
], async (req, res, next) => {
  handleValidation(req, res);
  const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM pacientes WHERE dni = ?', [dni]);
    if (existing.length) return res.status(400).json({ message: 'El DNI ya existe' });

    const [result] = await pool.query(
      'INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?,?,?,?,?)',
      [nombre, apellido, dni, fecha_nacimiento, obra_social]
    );
    res.status(201).json({ id_paciente: result.insertId });
  } catch (err) {
    next(err);
  }
});

// PUT /api/pacientes/:id
router.put('/:id', [
  param('id').isInt(),
  body('nombre').optional().notEmpty(),
  body('apellido').optional().notEmpty(),
  body('dni').optional().isLength({ min: 7, max: 10 }).isNumeric(),
  body('fecha_nacimiento').optional().isISO8601(),
  body('obra_social').optional().notEmpty()
], async (req, res, next) => {
  handleValidation(req, res);
  const id = req.params.id;
  const fields = req.body;
  const set = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const values = Object.values(fields);
  if (!set) return res.status(400).json({ message: 'No hay campos para actualizar' });
  try {
    await pool.query(`UPDATE pacientes SET ${set} WHERE id = ?`, [...values, id]);
    res.json({ message: 'Actualizado' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/pacientes/:id
router.delete('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    await pool.query('DELETE FROM pacientes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
