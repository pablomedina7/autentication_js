const express = require('express');
const {
  renderHome,
  loginUser,
  registerUser,
  renderDashboard,
} = require('../controllers/authController');
const { verifyjwt } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', renderHome);
router.post('/login', loginUser);
router.post('/register', registerUser);

// Ruta protegida para el dashboard
router.get('/dashboard', verifyjwt, renderDashboard);

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('jwt'); // Limpiar token JWT
    res.redirect('/');
  });
});

module.exports = router;
