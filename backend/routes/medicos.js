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

// GET /api/medicos
router.get('/', [
  query('especialidad').optional().isString()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    let sql = 'SELECT id AS id_medico, nombre, apellido, especialidad, matricula FROM medicos';
    const params = [];
    if (req.query.especialidad) {
      sql += ' WHERE especialidad = ?';
      params.push(req.query.especialidad);
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/medicos/:id
router.get('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const [rows] = await pool.query(
      'SELECT id AS id_medico, nombre, apellido, especialidad, matricula FROM medicos WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Médico no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/medicos
router.post('/', [
  body('nombre').notEmpty(),
  body('apellido').notEmpty(),
  body('especialidad').notEmpty(),
  body('matricula').notEmpty()
], async (req, res, next) => {
  handleValidation(req, res);
  const { nombre, apellido, especialidad, matricula } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM medicos WHERE matricula = ?', [matricula]);
    if (existing.length) return res.status(400).json({ message: 'La matrícula ya existe' });

    const [result] = await pool.query(
      'INSERT INTO medicos (nombre, apellido, especialidad, matricula) VALUES (?,?,?,?)',
      [nombre, apellido, especialidad, matricula]
    );
    res.status(201).json({ id_medico: result.insertId });
  } catch (err) {
    next(err);
  }
});

// PUT /api/medicos/:id
router.put('/:id', [
  param('id').isInt(),
  body('nombre').optional().notEmpty(),
  body('apellido').optional().notEmpty(),
  body('especialidad').optional().notEmpty(),
  body('matricula').optional().notEmpty()
], async (req, res, next) => {
  handleValidation(req, res);
  const id = req.params.id;
  const fields = req.body;
  const set = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const values = Object.values(fields);
  if (!set) return res.status(400).json({ message: 'No hay campos para actualizar' });
  try {
    await pool.query(`UPDATE medicos SET ${set} WHERE id = ?`, [...values, id]);
    res.json({ message: 'Actualizado' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/medicos/:id
router.delete('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    await pool.query('DELETE FROM medicos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
