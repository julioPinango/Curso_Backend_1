// routers/viewsRouter.js
const express = require('express');
const { readProducts } = require('../controllers/productsController');

const router = express.Router();

// Ruta para renderizar la vista "home"
router.get('/', (req, res) => {
  const products = readProducts();
  res.render('home', { products });
});

// Ruta para renderizar la vista "realTimeProducts"
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

module.exports = router;

