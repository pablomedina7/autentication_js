const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');

exports.renderHome = (req, res) => {
  res.render('home', { loginError: null, registerError: null });
};

exports.loginUser = async (req, res) => {
  const { email, password, remember } = req.body;

  console.log('Datos recibidos en Login:', req.body);

  const user = await User.findByEmail(email);
  console.log('Usuario encontrado:', user);

  if (!user) {
    return res.status(401).render('home', {
      loginError: 'Credenciales inválidas',
      registerError: null,
    });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password);
  console.log('Contraseña correcta:', passwordMatches);

  if (!passwordMatches) {
    return res.status(401).render('home', {
      loginError: 'Credenciales inválidas',
      registerError: null,
    });
  }

  const token = generateToken(user);
  console.log('Token generado:', token);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: remember ? 3600000 : 1800000,
  });

  if (user.role === 'admin') {
    return res.redirect('/auth/dashboard');
  }
  return res.redirect('/auth/dashboard');
};







exports.registerUser = async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  console.log('Datos recibidos en el registro:', req.body);

  if (await User.findByEmail(email)) {
    return res.status(400).render('home', {
      registerError: `El correo ${email} ya está registrado`,
      loginError: null,
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render('home', {
      registerError: 'Las contraseñas no coinciden',
      loginError: null,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log('Hash generado:', hashedPassword);

  const user = new User(email, hashedPassword, role);
  await User.addUser(user);

  console.log('Usuario registrado exitosamente:', user);

  res.redirect('/');
};





exports.renderDashboard = async (req, res) => {
  const user = req.user || req.session.user; // Obtener el usuario desde el token o sesión

  if (!user) {
    return res.redirect('/'); // Si no hay usuario, redirigir al inicio
  }

  // Verificar el rol del usuario
  if (user.role === 'admin') {
    const users = await User.getAllUsers(); // Obtener todos los usuarios para el panel de admin
    return res.render('admin_dashboard', { user, users });
  }

  // Redirigir al panel de usuario normal
  res.render('user_dashboard', { user });
};





