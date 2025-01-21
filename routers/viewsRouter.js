const express = require('express');
const { readProducts } = require('../controllers/productsController');

const router = express.Router();

router.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;

