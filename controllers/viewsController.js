import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

export const renderProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('products', { title: 'Productos', products });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
};

export const renderCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('products.product').lean();

        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.render('carts', { title: 'Carrito', cartId: id, products: cart.products });
    } catch (error) {
        res.status(500).send("Error al cargar carrito");
    }
};
