import express from 'express';
import { createCart, addProductToCart } from '../../Curso_Backend_1/controllers/cartsController.js';

const router = express.Router();

router.post('/', createCart);
router.post('/:cartId/products/:productId', addProductToCart);

export default router;
