const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/'); // Redirigir a login si no hay sesión
  }
  next();
};

exports.restrictTo = (role) => (req, res, next) => {
  const user = req.user || req.session.user;

  if (!user || user.role !== role) {
    return res.status(403).send('No tienes permiso para acceder a esta sección.');
  }
  next();
};


exports.verifyjwt = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/'); // Redirigir al inicio si no hay token
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'clave_secreta');
    console.log('Token decodificado:', decoded); // Depuración
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar JWT:', error.message);
    res.clearCookie('jwt');
    return res.redirect('/'); // Redirigir al inicio si el token es inválido
  }
};






