const express = require('express');
const { deleteProductFromCart, updateCart, updateProductQuantity } = require('../controllers/cartsController');

const router = express.Router();

router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);

module.exports = router;