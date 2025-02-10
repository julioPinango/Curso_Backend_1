const fs = require('fs');
const path = require('path');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const cartsFilePath = path.join(__dirname, '../data/carrito.json');
const productsFilePath = path.join(__dirname, '../data/productos.json');

const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    console.log("Contenido actual de cerrito.json:", data)
    return JSON.parse(data);
};

const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

const createCart = (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: `${Date.now()}`,
        products: [],
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
};

const getCartProducts = (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
};

const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;

    console.log(`Intentando agregar producto ${pid} al carrito ${cid}`);

    const carts = readCarts();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
        console.error("Carrito no encontrado");
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    console.log("Estado inicial del carrito:", cart);
    const productInCart = cart.products.find((p) => p.product === pid);

    if (productInCart) {
        productInCart.quantity += 1;
        console.log(`Producto ${pid} ya estaba en el carrito. Nueva cantidad: ${productInCart.quantity}`);
    } 
    else {
        cart.products.push({ product: pid, quantity: 1 });
        console.log(`Producto ${pid} agregado al carrito por primera vez`);
    }
    writeCarts(carts);
    console.log("Estado final del carrito:", cart);
    res.status(200).json(cart);
};

const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = products;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        productInCart.quantity = quantity;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { 
    createCart, 
    getCartProducts, 
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity, 
};
