const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // Incluye el rol en el token
    },
    process.env.SECRET_KEY || 'clave_secreta',
    { expiresIn: '1h' }
  );
};
