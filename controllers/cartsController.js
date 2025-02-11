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

// Obtener un carrito por ID
export const getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
};

// Agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        const existingProduct = cart.products.find(p => p.product.equals(productId));

        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            cart.products.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const initialLength = cart.products.length;
        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        if (cart.products.length === initialLength) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        await cart.save();
        res.json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
};


// Vaciar un carrito
export const clearCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar carrito' });
    }
};

// Actualizar todo el carrito con un nuevo array de productos
export const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndUpdate(cid, { products: req.body.products }, { new: true });
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
};

// Actualizar solo la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad del producto' });
    }
};
