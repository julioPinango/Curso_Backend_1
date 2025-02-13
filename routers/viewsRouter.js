import express from 'express';
import { renderCartsList, renderCart, renderProductDetail, renderHome, renderProducts} from '../controllers/viewsController.js';
import { getProducts } from '../controllers/productsController.js';


const router = express.Router();

router.get('/products', renderProducts);
router.get('/carts/:id', renderCart);
router.get('/carts', renderCartsList);
router.get('/products/:pid', renderProductDetail );
router.get('/', renderHome);

export default router;