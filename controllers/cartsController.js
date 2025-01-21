const fs = require('fs');
const path = require('path');
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



module.exports = { createCart, getCartProducts, addProductToCart };
