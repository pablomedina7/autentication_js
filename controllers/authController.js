const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');

exports.renderHome = (req, res) => {
  res.render('home', { loginError: null, registerError: null });
};

exports.loginUser = async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).render('home', {
      loginError: 'Credenciales inválidas',
      registerError: null,
    });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (!passwordMatches) {
    return res.status(401).render('home', {
      loginError: 'Credenciales inválidas',
      registerError: null,
    });
  }

  const token = generateToken(user);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: remember ? 3600000 : 1800000, // 1 hora o 30 minutos
  });

  if (user.role === 'admin') {
    return res.redirect('/auth/dashboard');
  }
  return res.redirect('/auth/dashboard');
};

exports.registerUser = async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

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
  const user = new User(email, hashedPassword, role);
  await User.addUser(user);

  res.redirect('/');
};

exports.renderDashboard = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.redirect('/');
  }

  if (user.role === 'admin') {
    const users = await User.getAllUsers();
    return res.render('admin_dashboard', { user, users });
  }

  res.render('user_dashboard', { user });
};
