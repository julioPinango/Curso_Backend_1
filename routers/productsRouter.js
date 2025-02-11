import express from 'express';
import { getProducts, createProduct } from '../../Curso_Backend_1/controllers/productsController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);

export default router;
