import express from 'express';
import { renderProducts, renderCart } from '../controllers/viewsController.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';  
import { getProducts } from '../controllers/productsController.js';


const router = express.Router();

router.get('/products', getProducts);
router.get('/carts/:id', renderCart);
router.get('/carts', async (req, res) => {
    const carts = await Cart.find().lean(); // Obtener todos los carritos
    res.render('cartsList', { carts });
});
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");

        const carts = await Cart.find().lean(); // Obtener todos los carritos

        res.render('productDetail', { product, carts });
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});
router.get('/', (req, res) => {
    res.render('home'); // Renderiza la vista home.handlebars
});

export default router;