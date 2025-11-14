const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../db');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// Obtener todas las especialidades
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT e.id, e.nombre, m.id AS medico_id, CONCAT(m.nombre, ' ', m.apellido) AS medico
      FROM especialidades e
      LEFT JOIN medicos m ON e.medico_id = m.id
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Crear especialidad
router.post('/', [
  body('nombre').notEmpty(),
  body('medico_id').optional().isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const { nombre, medico_id } = req.body;
    const [result] = await db.query(
      'INSERT INTO especialidades (nombre, medico_id) VALUES (?, ?)',
      [nombre, medico_id || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

// Actualizar especialidad
router.put('/:id', [
  param('id').isInt(),
  body('nombre').optional().notEmpty(),
  body('medico_id').optional().isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const { id } = req.params;
    const fields = req.body;
    const set = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const values = Object.values(fields);
    if (!set) return res.status(400).json({ message: 'No hay campos para actualizar' });

    await db.query(`UPDATE especialidades SET ${set} WHERE id = ?`, [...values, id]);
    res.json({ message: 'Especialidad actualizada correctamente' });
  } catch (error) {
    next(error);
  }
});

// Eliminar especialidad
router.delete('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  handleValidation(req, res);
  try {
    const { id } = req.params;
    await db.query('DELETE FROM especialidades WHERE id = ?', [id]);
    res.json({ message: 'Especialidad eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
