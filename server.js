require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const authRoutes = require('./routes/auth_routes');
const path = require('path');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar protección CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Pasar token CSRF a las vistas
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware global para manejar JWT
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || 'clave_secreta');
      req.user = decoded;
    } catch (error) {
      console.error('Error al verificar JWT:', error.message);
      res.clearCookie('jwt');
    }
  }
  next();
});

// Configurar límite de solicitudes para evitar ataques de fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Máximo 5 intentos por minuto
  message: 'Demasiados intentos de inicio de sesión. Intenta nuevamente en unos minutos.',
});
app.use('/auth/login', loginLimiter);

// Rutas principales
app.get('/', (req, res) => {
  res.render('home', {
    loginError: null,
    registerError: null,
    user: req.user || null,
  });
});

app.use('/auth', authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
