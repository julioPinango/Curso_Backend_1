import { CartModel } from "../models/Cart.js";

export class CartController {
    static async createCart(req, res) {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el carrito" });
    }
}

static async getCart(req, res) {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
}

static async addProductToCart(req, res) {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        const existingProduct = cart.products.find((p) => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            cart.products.push({ product: pid, quantity: quantity || 1 });
        }

        await cart.save();
        res.json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error al agregar producto al carrito" });
        }
    }

static async removeProductFromCart(req, res) {
    try {
        const { cid, pid } = req.params;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        cart.products = cart.products.filter((p) => p.product.toString() !== pid);
        await cart.save();

        res.json(cart);
        }    catch (error) {
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
}

static async clearCart(req, res) {
    try {
        const { cid } = req.params;
    
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
}
}
