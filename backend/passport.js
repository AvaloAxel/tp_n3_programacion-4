const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const pool = require('./db');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'replace_this'
};

module.exports = function(passport){
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const [rows] = await pool.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [jwt_payload.id]);
      if(rows.length) return done(null, rows[0]);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }));
};
