const express = require('express');
const { createCart, getCartProducts, addProductToCart } = require('../controllers/cartsController');

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCartProducts);
router.post('/:cid/product/:pid', addProductToCart);

module.exports = router;