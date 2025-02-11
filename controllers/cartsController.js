import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
};

// Agregar producto a un carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        cart.products.push({ product: productId, quantity });
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};
