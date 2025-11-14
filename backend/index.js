require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('./passport')(passport);

const app = express();

// Middlewares base
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Rutas públicas
app.use('/api/auth', require('./routes/auth'));

// Rutas protegidas con Passport JWT
app.use('/api/pacientes', passport.authenticate('jwt', { session: false }), require('./routes/pacientes'));
app.use('/api/medicos', passport.authenticate('jwt', { session: false }), require('./routes/medicos'));
app.use('/api/turnos', passport.authenticate('jwt', { session: false }), require('./routes/turnos'));
app.use('/api/especialidades', passport.authenticate('jwt', { session: false }), require('./routes/especialidades'));

// 404 - Ruta no encontrada
app.use((req, res, next) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

// Manejo de errores generales (500 o personalizados)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));
