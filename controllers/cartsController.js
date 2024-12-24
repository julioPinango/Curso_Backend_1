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
    console.log(`Intentando agregar producto ${req.params.pid} al carrito ${req.params.cid}`); 
    const carts = readCarts();
    const cart = carts.find((c) => c.id === cid);
    console.log("Estado inicial del carrito:", cart);

    if (productInCart) {
        productInCart.quantity += 1;
        console.log("Cantidad actualizada del producto en el carrito:", productInCart); 
    } else {
        cart.products.push({ product: pid, quantity: 1 });
        console.log("Producto agregado al carrito:", cart.products); 
    }
    writeCarts(carts);
    console.log("Contenido actualizado de carrito.json:", carts); 
    res.status(200).json(cart);
};


module.exports = { createCart, getCartProducts, addProductToCart };
