import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart, updateCart, updateProductQuantity } from '../controllers/cartsController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:id', getCartById);
router.post('/:cid/products/:pid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);
router.delete('/:cid', clearCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);

export default router;


