import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart } from '../controllers/cartsController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:id', getCartById);
router.post('/:cartId/product/:productId', addProductToCart);
router.delete('/:cartId/product/:productId', removeProductFromCart);
router.delete('/:cartId', clearCart);

export default router;

