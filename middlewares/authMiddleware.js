const jwt = require('jsonwebtoken');

exports.verifyjwt = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'clave_secreta');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar JWT:', error.message);
    res.clearCookie('jwt');
    return res.redirect('/');
  }
};
